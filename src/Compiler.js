/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This module defines a class that analyzes and compiles a document written using
 * Bali Document Notation™ into a type document that contains the bytecode for each
 * method defined in the document. The bytecode can then be executed on the
 * Bali Virtual Machine™.
 */
const bali = require('bali-component-framework').api();
const Visitor = require('bali-component-framework/src/abstractions/Visitor').Visitor;
const Assembler = require('./Assembler').Assembler;
const Parser = require('./Parser').Parser;
const Formatter = require('./Formatter').Formatter;
const EOL = '\n';  // POSIX end of line character


// PUBLIC FUNCTIONS

/**
 * This class implements a compiler that compiles a type definition document into a
 * compiled type document containing the bytecode for each of its methods.
 *
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Compiler} The new document compiler.
 */
function Compiler(debug) {
    this.debug = debug || 0;
    return this;
}
Compiler.prototype.constructor = Compiler;
exports.Compiler = Compiler;


/**
 * This function cleans a type definition so that it does not contain any compilation attributes.
 *
 * @param {Catalog} type The type definition to be cleaned.
 */
Compiler.prototype.cleanType = function(type) {
    type.removeAttribute('$literals');

    // create the methods catalog if necessary
    var methods = type.getAttribute('$methods');
    if (methods && !methods.isEqualTo(bali.pattern.NONE)) {

        // clean each method
        const iterator = methods.getIterator();
        while (iterator.hasNext()) {

            // retrieve the source code for the method
            const association = iterator.getNext();
            const method = association.getValue();

            // compile the source code into assembly instructions
            this.cleanMethod(method);
        }
    }
};


/**
 * This function cleans a method definition so that it does not contain any compilation
 * attributes.
 *
 * @param {Catalog} method The method definition to be cleaned.
 */
Compiler.prototype.cleanMethod = function(method) {
    method.removeAttribute('$instructions');
    method.removeAttribute('$addresses');
    method.removeAttribute('$bytecode');
    method.removeAttribute('$arguments');
    method.removeAttribute('$variables');
    method.removeAttribute('$messages');
};


/**
 * This function compiles and assembles each method in a type definition so that they may be
 * run on the Bali Virtual Machine™.
 *
 * @param {Catalog} type The type definition to be compiled.
 */
Compiler.prototype.compileType = function(type) {
    var methods = type.getAttribute('$methods');
    if (methods) {
        // compile each method
        const iterator = methods.getIterator();
        while (iterator.hasNext()) {
            const association = iterator.getNext();
            const method = association.getValue();
            this.compileMethod(type, method);
        }

        // assemble each method
        const assembler = new Assembler(this.debug);
        iterator.toStart();
        while (iterator.hasNext()) {
            const association = iterator.getNext();
            const method = association.getValue();
            assembler.assembleMethod(type, method);
        }
    }
};


/**
 * This method compiles a method containing a Bali procedure into the corresponding
 * assembly instructions for the Bali Virtual Machine™.
 *
 * @param {Catalog} type The type context for the method being compiled.
 * @param {Catalog} method The method to be compiled.
 */
Compiler.prototype.compileMethod = function(type, method) {
    // compile the method into assembly instructions
    const visitor = new CompilingVisitor(type, method, this.debug);
    const procedure = method.getAttribute('$procedure');
    procedure.getStatements().acceptVisitor(visitor);

    // format the instructions and add to the compiled method
    var instructions = visitor.getInstructions();
    const parser = new Parser(this.debug);
    instructions = parser.parseInstructions(instructions);
    const formatter = new Formatter(0, this.debug);
    instructions = bali.text(formatter.formatInstructions(instructions), {$mediaType: 'application/basm'});
    method.setAttribute('$instructions', instructions);
};


// PRIVATE CLASSES

/*
 * This private class uses the Visitor Pattern to traverse the syntax tree generated
 * by the parser. It in turn uses another private class, the InstructionBuilder,
 * to construct the corresponding Bali Virtual Machine™ instructions for the
 * syntax tree is it traversing.
 */
function CompilingVisitor(type, method, debug) {
    Visitor.call(this);
    this.debug = debug || 0;
    this.builder = new InstructionBuilder(type, method);
    this.temporaryVariableCount = 2;  // skip the $result-1 temporary variable
    return this;
}
CompilingVisitor.prototype = Object.create(Visitor.prototype);
CompilingVisitor.prototype.constructor = CompilingVisitor;


/**
 * This method returns the resulting assembly instructions for the compiled method.
 *
 * @returns {String}
 */
CompilingVisitor.prototype.getInstructions = function() {
    if (this.builder.requiresFinalization) this.builder.finalize();
    return this.builder.instructions;
};


/*
 * This method inserts the instructions that cause the VM to accept a message that
 * was retrieved from a message bag.
 */
// acceptClause: 'accept' expression
CompilingVisitor.prototype.visitAcceptClause = function(tree) {
    const expression = tree.getItem(1);

    this.builder.insertNoteInstruction('Save the message to be accepted.');
    expression.acceptVisitor(this);
    const message = this.createTemporaryVariable('message');
    this.builder.insertSaveInstruction('VARIABLE', message);

    this.builder.insertNoteInstruction('Extract and save the name of the message bag.');
    this.builder.insertLoadInstruction('VARIABLE', message);
    this.builder.insertPushInstruction('LITERAL', '$bag');
    this.builder.insertCallInstruction('$attribute', 2);  // attribute(message, key)
    const bag = this.createTemporaryVariable('bag');
    this.builder.insertSaveInstruction('VARIABLE', bag);

    this.builder.insertNoteInstruction('Drop the message from the named message bag.');
    this.builder.insertLoadInstruction('VARIABLE', message);
    this.builder.insertDropInstruction('MESSAGE', bag);
};


// angle: ANGLE
CompilingVisitor.prototype.visitAngle = function(angle) {
    this.visitElement(angle);
};


/*
 * This method inserts the instructions that cause the VM to place the values
 * of each argument on top of the component stack.
 */
// arguments:
//     expression (',' expression)* |
//     /* no arguments */
CompilingVisitor.prototype.visitArguments = function(tree) {
    if (!tree.isEmpty()) {
        const iterator = tree.getIterator();
        while (iterator.hasNext()) {
            const argument = iterator.getNext();
            argument.acceptVisitor(this);
        }
    }
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of an arithmetic operation on them.
 */
// arithmeticExpression: expression ('*' | '/' | '//' | '+' | '-') expression
CompilingVisitor.prototype.visitArithmeticExpression = function(tree) {
    const firstOperand = tree.getItem(1);
    const secondOperand = tree.getItem(2);
    firstOperand.acceptVisitor(this);
    secondOperand.acceptVisitor(this);
    const operator = tree.operator;
    switch (operator) {
        case '*':
            this.builder.insertCallInstruction('$product', 2);  // product(x, y)
            break;
        case '/':
            this.builder.insertCallInstruction('$quotient', 2);  // quotient(x, y)
            break;
        case '//':
            this.builder.insertCallInstruction('$remainder', 2);  // remainder(x, y)
            break;
        case '+':
            this.builder.insertCallInstruction('$sum', 2);  // sum(x, y)
            break;
        case '-':
            this.builder.insertCallInstruction('$difference', 2);  // difference(x,y)
            break;
    }
};


// association: component ':' expression
CompilingVisitor.prototype.visitAssociation = function(association) {
    association.getKey().acceptVisitor(this);
    association.getValue().acceptVisitor(this);
    this.builder.insertCallInstruction('$association', 2);  // association(key, value)
};


// binary: BINARY
CompilingVisitor.prototype.visitBinary = function(binary) {
    this.visitElement(binary);
};


/*
 *  This method is causes the VM to jump out of the enclosing loop procedure block.
 */
// breakClause: 'break' 'loop'
CompilingVisitor.prototype.visitBreakClause = function(tree) {
    // retrieve the loop label from the parent context
    const procedures = this.builder.stack;
    var procedure;
    var loopLabel;
    const numberOfProcedures = procedures.length;
    for (var i = 0; i < numberOfProcedures; i++) {
        procedure = procedures[numberOfProcedures - i - 1];  // work backwards
        loopLabel = procedure.statement.loopLabel;
        if (loopLabel) {
            const doneLabel = procedure.statement.doneLabel;
            this.builder.insertJumpInstruction(doneLabel);
            return;
        }
    }
    // there was no matching enclosing loop with that label
    const exception = bali.exception({
        $module: '/bali/compiler/Compiler',
        $procedure: '$visitBreakClause',
        $exception: '$noEnclosingLoop',
        $parent: tree.getParent(),
        $message: 'A break statement was found with no enclosing loop.'
    });
    if (this.debug) console.error(exception.toString());
    throw exception;
};


/*
 * This method compiles the instructions needed to checkout from the Bali Document Repository™
 * a committed document and assign it to a recipient. The recipient may be either
 * a variable or an indexed child of a composite component.
 */
// checkoutClause: 'checkout' ('level' expression 'of')? recipient 'from' expression
CompilingVisitor.prototype.visitCheckoutClause = function(tree) {
    var index = 1;
    const level = (tree.getSize() === 3) ? tree.getItem(index++) : bali.number();
    const recipient = tree.getItem(index++);
    const expression = tree.getItem(index);

    this.builder.insertNoteInstruction('Save the name of the contract.');
    expression.acceptVisitor(this);
    const name = this.createTemporaryVariable('name');
    this.builder.insertSaveInstruction('VARIABLE', name);

    this.builder.insertNoteInstruction('Load a copy of the named contract from the repository.');
    this.builder.insertLoadInstruction('CONTRACT', name);
    this.builder.insertPushInstruction('LITERAL', '$document');
    this.builder.insertCallInstruction('$attribute', 2);  // attribute(contract, key)
    this.builder.insertCallInstruction('$duplicate', 1);  // duplicate(document)
    const document = this.createTemporaryVariable('document');
    this.builder.insertSaveInstruction('VARIABLE', document);

    this.builder.insertNoteInstruction('Calculate the new version string for the new document and save it.');
    this.builder.insertLoadInstruction('VARIABLE', document);
    this.builder.insertPushInstruction('LITERAL', '$version');
    this.builder.insertCallInstruction('$parameter', 2);  // parameter(document, key)
    level.acceptVisitor(this);
    this.builder.insertCallInstruction('$nextVersion', 2);  // nextVersion(version, level)
    const version = this.createTemporaryVariable('version');
    this.builder.insertSaveInstruction('VARIABLE', version);

    this.builder.insertNoteInstruction('Set the new version string parameter for the new document.');
    this.builder.insertLoadInstruction('VARIABLE', document);
    this.builder.insertPushInstruction('LITERAL', '$version');
    this.builder.insertLoadInstruction('VARIABLE', version);
    this.builder.insertCallInstruction('$setParameter', 3);  // setParameter(document, key, value)
    this.builder.insertPullInstruction('COMPONENT');  // remove the document from the stack

    this.builder.insertNoteInstruction('Set the new document as the value of the recipient.');
    this.visitRecipient(recipient);
    this.builder.insertLoadInstruction('VARIABLE', document);
    this.setRecipient(recipient);
};


/*
 * This method inserts the instructions that cause the VM to place the collection
 * on top of the component stack.
 */
// collection: list | catalog
CompilingVisitor.prototype.visitCollection = function(collection) {
    var type = collection.constructor.name;
    type = '$' + type.charAt(0).toLowerCase() + type.slice(1);
    const parameters = collection.getParameters();
    const numberOfArguments = parameters ? 2 : 0;
    if (numberOfArguments) {
        this.builder.insertNoteInstruction('Place an empty parameterized ' + type.slice(1) + ' on the stack.');
        this.builder.insertPushInstruction('LITERAL', 'none');  // no items to add yet
        this.visitParameters(parameters);
    }
    this.builder.insertCallInstruction(type, numberOfArguments);  // <type>(items, parameters)
    var count = 0;
    const iterator = collection.getIterator();
    while (iterator.hasNext()) {
        this.builder.insertNoteInstruction('Add an' + (count++ ? 'other' : '') + ' item to the ' + type.slice(1) + '.');
        var item = iterator.getNext();
        item.acceptVisitor(this);
        this.builder.insertCallInstruction('$addItem', 2);  // addItem(collection, item)
    }
};


/*
 * This method inserts the instructions needed to commit to the Bali Document Repository™
 * a named contract that is on top of the component stack.
 */
// commitClause: 'commit' expression 'to' expression
CompilingVisitor.prototype.visitCommitClause = function(tree) {
    const contract = tree.getItem(1);
    const expression = tree.getItem(2);
    this.builder.insertNoteInstruction('Save the name of the new contract.');
    expression.acceptVisitor(this);
    const name = this.createTemporaryVariable('name');
    this.builder.insertSaveInstruction('VARIABLE', name);
    this.builder.insertNoteInstruction('Commit the named contract to the repository.');
    contract.acceptVisitor(this);
    this.builder.insertSaveInstruction('CONTRACT', name);
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of a comparison operation on them.
 */
// comparisonExpression: expression ('<' | '=' | '>' | 'IS' | 'MATCHES') expression
CompilingVisitor.prototype.visitComparisonExpression = function(tree) {
    const firstOperand = tree.getItem(1);
    const secondOperand = tree.getItem(2);
    firstOperand.acceptVisitor(this);
    secondOperand.acceptVisitor(this);
    const operator = tree.operator;
    switch (operator) {
        case '<':
            this.builder.insertCallInstruction('$isLess', 2);  // less(x, y)
            break;
        case '=':
            this.builder.insertCallInstruction('$areEqual', 2);  // equal(x, y)
            break;
        case '>':
            this.builder.insertCallInstruction('$isMore', 2);  // more(x, y)
            break;
        case 'IS':
            this.builder.insertCallInstruction('$areSame', 2);  // same(this, that)
            break;
        case 'MATCHES':
            this.builder.insertCallInstruction('$doesMatch', 2);  // doesMatch(component, pattern)
            break;
    }
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the logical
 * complement of the value.
 */
// complementExpression: 'NOT' expression
CompilingVisitor.prototype.visitComplementExpression = function(tree) {
    const operand = tree.getItem(1);
    operand.acceptVisitor(this);
    this.builder.insertCallInstruction('$not', 1);  // not(p)
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of a concatenation operation on them.
 */
// concatenationExpression: expression '&' expression
CompilingVisitor.prototype.visitConcatenationExpression = function(tree) {
    const firstOperand = tree.getItem(1);
    const secondOperand = tree.getItem(2);
    firstOperand.acceptVisitor(this);
    secondOperand.acceptVisitor(this);
    this.builder.insertCallInstruction('$concatenation', 2);  // concatenation(a, b)
};


// continueClause: 'continue' 'loop'
/*
 *  This method is causes the VM to jump to the beginning of the enclosing loop procedure block.
 */
CompilingVisitor.prototype.visitContinueClause = function(tree) {
    // retrieve the loop label from the parent context
    const procedures = this.builder.stack;
    var procedure;
    var loopLabel;
    const numberOfProcedures = procedures.length;
    for (var i = 0; i < numberOfProcedures; i++) {
        procedure = procedures[numberOfProcedures - i - 1];  // work backwards
        loopLabel = procedure.statement.loopLabel;
        if (loopLabel) {
            this.builder.insertJumpInstruction(loopLabel);
            return;
        }
    }
    // there was no matching enclosing loop with that label
    const exception = bali.exception({
        $module: '/bali/compiler/Compiler',
        $procedure: '$visitContinueClause',
        $exception: '$noEnclosingLoop',
        $parent: tree.getParent(),
        $message: 'A continue statement was found with no enclosing loop.'
    });
    if (this.debug) console.error(exception.toString());
    throw exception;
};


/*
 * This method evaluates the first expression and if its 'asBoolean()' value is
 * 'false', replaces it on top of the component stack with the value of the
 * second expression.
 */
// defaultExpression: expression '?' expression
CompilingVisitor.prototype.visitDefaultExpression = function(tree) {
    const proposedValue = tree.getItem(1);
    const defaultValue = tree.getItem(2);
    proposedValue.acceptVisitor(this);
    defaultValue.acceptVisitor(this);
    this.builder.insertCallInstruction('$default', 2);  // default(value, defaultValue)
};


/*
 * This method inserts the instructions that cause the VM to replace the name of the
 * document that is on top of the component stack with the named document.
 */
// dereferenceExpression: '@' expression
CompilingVisitor.prototype.visitDereferenceExpression = function(tree) {
    const expression = tree.getItem(1);
    expression.acceptVisitor(this);
    const nameOrCitation = this.createTemporaryVariable('nameOrCitation');
    this.builder.insertSaveInstruction('VARIABLE', nameOrCitation);
    this.builder.insertLoadInstruction('DOCUMENT', nameOrCitation);
};


/*
 * This method inserts the instructions needed to discard from the Bali Document Repository™
 * the cited document.
 */
// discardClause: 'discard' expression
CompilingVisitor.prototype.visitDiscardClause = function(tree) {
    this.builder.insertNoteInstruction('Save the citation to the document.');
    const expression = tree.getItem(1);
    expression.acceptVisitor(this);
    const citation = this.createTemporaryVariable('citation');
    this.builder.insertSaveInstruction('VARIABLE', citation);
    this.builder.insertNoteInstruction('Drop the cited document from the repository.');
    this.builder.insertDropInstruction('DOCUMENT', citation);
};


// duration: DURATION
CompilingVisitor.prototype.visitDuration = function(duration) {
    this.visitElement(duration);
};


/*
 * This method tells the VM to place an element on the component stack
 * as a literal value.
 */
// element:
//     angle |
//     binary |
//     duration |
//     moment |
//     number |
//     percent |
//     probability |
//     range |
//     reference |
//     symbol |
//     tag |
//     template |
//     text |
//     version
CompilingVisitor.prototype.visitElement = function(element) {
    this.builder.insertPushInstruction('LITERAL', element.toLiteral());
    const parameters = element.getParameters();
    this.visitParameters(parameters);
};


/*
 * This method compiles the instructions needed to evaluate an expression and
 * optionally assign the resulting value to a recipient. The recipient may be
 * either a variable or an indexed child of a collection component.
 */
// evaluateClause: (recipient ':=')? expression
CompilingVisitor.prototype.visitEvaluateClause = function(tree) {
    const expression = tree.getItem(-1);
    if (tree.getSize() > 1) {
        const recipient = tree.getItem(1);
        this.visitRecipient(recipient);
        expression.acceptVisitor(this);
        this.setRecipient(recipient);
    } else {
        expression.acceptVisitor(this);
        this.builder.insertSaveInstruction('VARIABLE', '$result-1');
    }
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of an exponential operation on them.
 */
// exponentialExpression: <assoc=right> expression '^' expression
CompilingVisitor.prototype.visitExponentialExpression = function(tree) {
    const firstOperand = tree.getItem(1);
    const secondOperand = tree.getItem(2);
    firstOperand.acceptVisitor(this);
    secondOperand.acceptVisitor(this);
    this.builder.insertCallInstruction('$exponential', 2);  // exponential(x, power)
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the mathematical
 * factorial of the value.
 */
// factorialExpression: expression '!'
CompilingVisitor.prototype.visitFactorialExpression = function(tree) {
    const operand = tree.getItem(1);
    operand.acceptVisitor(this);
    this.builder.insertCallInstruction('$factorial', 1);  // factorial(x)
};


/*
 * This method inserts instructions that cause the VM to execute the
 * procedure associated with the named function, first placing any arguments
 * on the component stack. The resulting value of the procedure remains on
 * the component stack.
 */
// functionExpression: function '(' arguments ')'
CompilingVisitor.prototype.visitFunctionExpression = function(tree) {
    const functionName = '$' + tree.getItem(1).toString();
    const argumentz = tree.getItem(2);
    const numberOfArguments = argumentz.getSize();
    if (numberOfArguments > 3) {
        const exception = bali.exception({
            $module: '/bali/compiler/Compiler',
            $procedure: '$visitFunctionExpression',
            $exception: '$argumentCount',
            $function: tree,
            $message: 'The number of arguments to a function must be three or less.'
        });
        if (this.debug) console.error(exception.toString());
        throw exception;
    }
    argumentz.acceptVisitor(this);
    this.builder.insertCallInstruction(functionName, numberOfArguments);  // <function>(arguments...)
};


/*
 * This method inserts instructions that cause the VM to attempt to handle
 * the exception that is on top of the component stack. The exception must
 * match the value of the template expression or the VM will jump to the next
 * handler or the end of the exception clauses if there isn't another one.
 */
// handleClause: 'handle' symbol ('matching' expression 'with' block)+
CompilingVisitor.prototype.visitHandleClause = function(tree) {
    // the VM saves the exception that is on top of the component stack in the variable
    const iterator = tree.getIterator();
    const symbol = iterator.getNext();
    const exception = symbol.toString();
    this.builder.insertSaveInstruction('VARIABLE', exception);

    const statement = this.builder.getStatementContext();
    while (iterator.hasNext()) {
        // setup the labels
        const statement = this.builder.getStatementContext();
        const clausePrefix = this.builder.getBlockPrefix();
        const handleLabel = clausePrefix + 'HandleBlock';
        this.builder.insertLabel(handleLabel);

        // the VM compares the template expression with the actual exception
        this.builder.insertLoadInstruction('VARIABLE', exception);
        const template = iterator.getNext();
        template.acceptVisitor(this);
        this.builder.insertCallInstruction('$doesMatch', 2);  // matches(symbol, pattern)

        // if the template and exception did not match the VM jumps past this exception handler
        var nextLabel = this.builder.getNextBlockPrefix() + 'HandleBlock';
        if (statement.blockNumber === statement.blockCount) {
            nextLabel = statement.failureLabel;
        }
        this.builder.insertJumpInstruction(nextLabel, 'ON FALSE');

        // the VM executes the handler block
        const block = iterator.getNext();
        block.acceptVisitor(this);

        // the exception was handled successfully
        this.builder.insertLabel(clausePrefix + 'HandleBlockDone');
        this.builder.insertJumpInstruction(statement.successLabel);
    }

    // none of the exception handlers matched so the VM must try the parent handlers
    this.builder.insertLabel(statement.failureLabel);
    this.builder.insertLoadInstruction('VARIABLE', exception);
    this.builder.insertPullInstruction('EXCEPTION');

    // the VM encountered no exceptions or was able to handle them
    this.builder.insertLabel(statement.successLabel);
};


/*
 * This method inserts instructions that cause the VM to evaluate one or
 * condition expressions and execute a procedure block for the condition
 * that evaluates to 'true'. If none of the conditions are true an optional
 * procedure block may be executed by the VM.
 */
// ifClause: 'if' expression 'then' block ('else' 'if' expression 'then' block)* ('else' block)?
CompilingVisitor.prototype.visitIfClause = function(tree) {
    var elseBlock;
    var clausePrefix;
    const doneLabel = this.builder.getStatementContext().doneLabel;

    // separate out the parts of the statement
    const array = tree.toArray();
    if (array.length % 2 === 1) {
        elseBlock = array.pop();  // remove the else block
    }

    // compile each condition
    const list = bali.list(array);
    const iterator = list.getIterator();
    while (iterator.hasNext()) {
        var condition = iterator.getNext();
        var block = iterator.getNext();
        clausePrefix = this.builder.getBlockPrefix();
        var conditionLabel = clausePrefix + 'ConditionClause';
        this.builder.insertLabel(conditionLabel);

        // the VM places the condition value on top of the component stack
        condition.acceptVisitor(this);

        // determine what the next label will be
        var nextLabel = this.builder.getNextBlockPrefix();
        if (!iterator.hasNext()) {
            // we are on the last condition
            if (elseBlock) {
                nextLabel += 'ElseClause';
            } else {
                nextLabel = doneLabel;
            }
        } else {
            nextLabel += 'ConditionClause';
        }

        // if the condition is not true, the VM jumps to the next condition, else block, or the end
        this.builder.insertJumpInstruction(nextLabel, 'ON FALSE');

        // if the condition is true, then the VM enters the block
        block.acceptVisitor(this);

        // completed execution of the block
        if (elseBlock || iterator.hasNext()) {
            // not the last block so the VM jumps to the end of the statement
            this.builder.insertLabel(clausePrefix + 'ConditionClauseDone');
            this.builder.insertJumpInstruction(doneLabel);
        }
    }

    // the VM executes the optional else block
    if (elseBlock) {
        clausePrefix = this.builder.getBlockPrefix();
        const elseLabel = clausePrefix + 'ElseClause';
        this.builder.insertLabel(elseLabel);
        elseBlock.acceptVisitor(this);
        this.builder.insertLabel(clausePrefix + 'ElseClauseDone');
    }
};


/*
 * This method inserts instructions that cause the VM to traverse all but the last
 * index in a list of indices associated with a composite component. For each index
 * the VM replaces the component that is on top of the component stack with the
 * attribute at that index. It leaves the parent component and the index of the
 * final attribute on the component stack so that the outer rule can either use
 * them to get the final attribute value or set it depending on the context.
 */
// indices: expression (',' expression)*
CompilingVisitor.prototype.visitIndices = function(tree) {
    const iterator = tree.getIterator();
    var count = tree.getSize() - 1;  // skip the last index
    while (count--) {
        // the VM places the value of the next index onto the top of the component stack
        iterator.getNext().acceptVisitor(this);
        // the VM retrieves the value of the attribute at the given index of the parent component
        this.builder.insertCallInstruction('$attribute', 2);  // attribute(composite, index)
        // the parent and index have been replaced by the value of the attribute
    }
    // the VM places the value of the last index onto the top of the component stack
    iterator.getNext().acceptVisitor(this);
    // the parent component and index of the last attribute are on top of the component stack
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the arithmetic,
 * geometric, or complex inverse of the value.
 */
// inversionExpression: ('-' | '/' | '*') expression
CompilingVisitor.prototype.visitInversionExpression = function(tree) {
    const operand = tree.getItem(1);
    operand.acceptVisitor(this);
    const operator = tree.operator;
    switch (operator) {
        case '-':
            this.builder.insertCallInstruction('$inverse', 1);  // inverse(x)
            break;
        case '/':
            this.builder.insertCallInstruction('$reciprocal', 1);  // reciprocal(x)
            break;
        case '*':
            this.builder.insertCallInstruction('$conjugate', 1);  // conjugate(x)
            break;
    }
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of a logical operation on them.
 */
// logicalExpression: expression ('AND' | 'SANS' | 'XOR' | 'OR') expression
CompilingVisitor.prototype.visitLogicalExpression = function(tree) {
    const firstOperand = tree.getItem(1);
    const secondOperand = tree.getItem(2);
    firstOperand.acceptVisitor(this);
    secondOperand.acceptVisitor(this);
    const operator = tree.operator;
    switch (operator) {
        case 'AND':
            this.builder.insertCallInstruction('$and', 2);  // and(p, q)
            break;
        case 'SANS':
            this.builder.insertCallInstruction('$sans', 2);  // sans(p, q)
            break;
        case 'OR':
            this.builder.insertCallInstruction('$or', 2);  // or(p, q)
            break;
        case 'XOR':
            this.builder.insertCallInstruction('$xor', 2);  // xor(p, q)
            break;
    }
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the numeric
 * magnitude of the value.
 */
// magnitudeExpression: '|' expression '|'
CompilingVisitor.prototype.visitMagnitudeExpression = function(tree) {
    const operand = tree.getItem(1);
    operand.acceptVisitor(this);
    this.builder.insertCallInstruction('$magnitude', 1);  // magnitude(x)
};


/*
 * This method inserts instructions that cause the VM to execute the
 * procedure associated with the specified message for the value of the
 * expression, first placing the arguments on the component stack in
 * a list. If the value of the expression is a name, the message and
 * its arguments are placed in a bag to be sent to the named document
 * in a separate process. Otherwise, the result of the executed procedure
 * is placed on the stack.
 */
// messageExpression: expression ('.' | '<-') message '(' arguments ')'
CompilingVisitor.prototype.visitMessageExpression = function(tree) {
    const target = tree.getItem(1);
    const recipient = (tree.operator === '.') ? 'TO COMPONENT' : 'TO DOCUMENT';
    const message = tree.getItem(2);
    const argumentz = tree.getItem(3);
    const numberOfArguments = argumentz.getSize();

    // the VM places the value of the target expression onto the top of the component stack
    target.acceptVisitor(this);

    // extract the message name
    const messageName = '$' + message.toString();

    // if there are arguments then compile accordingly
    if (numberOfArguments > 0) {
        this.builder.insertNoteInstruction('Place a list of the message arguments on the stack.');
        this.builder.insertCallInstruction('$list', 0);  // list()
        const iterator = argumentz.getIterator();
        while (iterator.hasNext()) {
            var argument = iterator.getNext();
            argument.acceptVisitor(this);
            this.builder.insertCallInstruction('$addItem', 2);  // addItem(list, argument)
        }
        this.builder.insertNoteInstruction('Send the message with its arguments to the recipient.');
        this.builder.insertSendInstruction(messageName, recipient + ' WITH ARGUMENTS');
    } else {
        this.builder.insertSendInstruction(messageName, recipient);
    }

    // the result of the executed method remains on the component stack
};


// moment: MOMENT
CompilingVisitor.prototype.visitMoment = function(moment) {
    this.visitElement(moment);
};


// name: NAME
CompilingVisitor.prototype.visitName = function(name) {
    this.visitElement(name);
};


// number:
//    'undefined' |
//    'infinity' |
//    real |
//    imaginary |
//    '(' real (',' imaginary | 'e^' angle 'i') ')'
CompilingVisitor.prototype.visitNumber = function(number) {
    this.visitElement(number);
};


// parameters: '(' catalog ')'
CompilingVisitor.prototype.visitParameters = function(parameters) {
    if (parameters) {
        this.builder.insertNoteInstruction('Place a catalog of the parameters on the stack.');
        this.builder.insertCallInstruction('$catalog', 0);  // catalog()
        const keys = parameters.getKeys();
        const iterator = keys.getIterator();
        while (iterator.hasNext()) {
            const key = iterator.getNext();
            this.builder.insertPushInstruction('LITERAL', key.toLiteral());
            const value = parameters.getAttribute(key);
            value.acceptVisitor(this);
            this.builder.insertCallInstruction('$setAttribute', 3);  // setAttribute(catalog, key, value)
        }
    }
};


// pattern: 'none' | REGEX | 'any'
CompilingVisitor.prototype.visitPattern = function(pattern) {
    this.visitElement(pattern);
};


// percent: PERCENT
CompilingVisitor.prototype.visitPercent = function(percent) {
    this.visitElement(percent);
};


/*
 * This method inserts the instructions that cause the VM to evaluate a
 * message expression and then place the resulting message in a message
 * bag in the Bali Document Repository™. The name of the message bag
 * is another expression that the VM evaluates as well.
 */
// postClause: 'post' expression 'to' expression
CompilingVisitor.prototype.visitPostClause = function(tree) {
    const message = tree.getItem(1);
    const name = tree.getItem(2);
    this.builder.insertNoteInstruction('Save the name of the message bag.');
    name.acceptVisitor(this);
    const bag = this.createTemporaryVariable('bag');
    this.builder.insertSaveInstruction('VARIABLE', bag);
    this.builder.insertNoteInstruction('Post a message to the named message bag.');
    message.acceptVisitor(this);
    this.builder.insertSaveInstruction('MESSAGE', bag);
};


// probability: 'false' | FRACTION | 'true'
CompilingVisitor.prototype.visitProbability = function(probability) {
    this.visitElement(probability);
};


/*
 * This method compiles a procedure as a component rather than part of a code block.
 * NOTE: the 'procedure' and 'block' rules have the same syntax but different symantics.
 * A code block gets compiled into the corresponding assembly instructions, but a
 * procedure gets treated as a component on the component stack.
 */
// procedure: '{' statements '}'
CompilingVisitor.prototype.visitProcedure = function(procedure) {
    this.builder.insertPushInstruction('LITERAL', procedure.toLiteral());
    const parameters = procedure.getParameters();
    this.visitParameters(parameters);
};


/*
 * This method inserts the instructions that cause the VM to evaluate an
 * expression and then publish the resulting value that is on top of the
 * component stack to the global event bag in the Bali Document Repository™.
 */
// publishClause: 'publish' expression
CompilingVisitor.prototype.visitPublishClause = function(tree) {
    const event = tree.getItem(1);
    this.builder.insertNoteInstruction('Save the name of the global event bag.');
    this.builder.insertPushInstruction('LITERAL', '/bali/vm/events/v1');
    const bag = this.createTemporaryVariable('bag');
    this.builder.insertSaveInstruction('VARIABLE', bag);
    this.builder.insertNoteInstruction('Publish an event to the global event bag.');
    event.acceptVisitor(this);
    this.builder.insertSaveInstruction('MESSAGE', bag);
};


// range: ('0' | REAL)? '..' ('0' | REAL)?
CompilingVisitor.prototype.visitRange = function(range) {
    this.visitElement(range);
};


/*
 * This method compiles the instructions needed to retrieve a message from a
 * bag in the Bali Document Repository™. The resulting message is assigned
 * to a recipient. The recipient may be either a variable or an indexed child
 * of a composite component.
 */
// retrieveClause: 'retrieve' recipient 'from' expression
CompilingVisitor.prototype.visitRetrieveClause = function(tree) {
    const recipient = tree.getItem(1);
    const name = tree.getItem(2);
    this.builder.insertNoteInstruction('Save the name of the message bag.');
    name.acceptVisitor(this);
    const bag = this.createTemporaryVariable('bag');
    this.builder.insertSaveInstruction('VARIABLE', bag);
    this.visitRecipient(recipient);
    this.builder.insertNoteInstruction('Place a message from the message bag on the stack.');
    this.builder.insertNoteInstruction('Note: this call blocks until a message is available from the bag.');
    this.builder.insertLoadInstruction('MESSAGE', bag);
    this.setRecipient(recipient);
};


// recipient: symbol | attribute
CompilingVisitor.prototype.visitRecipient = function(recipient) {
    if (recipient.isType('/bali/structures/Attribute')) {
        this.builder.insertNoteInstruction('Place the recipient and the index of its attribute on the stack.');
        recipient.acceptVisitor(this);
    }
};


// reference: RESOURCE
CompilingVisitor.prototype.visitReference = function(reference) {
    this.visitElement(reference);
};


/*
 * This method inserts the instructions that cause the VM to reject a message that
 * was retrieved from a message bag.  A new version of the message will be posted to
 * the message bag.
 */
// rejectClause: 'reject' expression
CompilingVisitor.prototype.visitRejectClause = function(tree) {
    this.builder.insertNoteInstruction('Save the message to be rejected.');
    const expression = tree.getItem(1);
    expression.acceptVisitor(this);
    const message = this.createTemporaryVariable('message');
    this.builder.insertSaveInstruction('VARIABLE', message);

    this.builder.insertNoteInstruction('Extract and save the name of the message bag.');
    this.builder.insertLoadInstruction('VARIABLE', message);
    this.builder.insertPushInstruction('LITERAL', '$bag');
    this.builder.insertCallInstruction('$attribute', 2);  // attribute(message, key)
    const bag = this.createTemporaryVariable('bag');
    this.builder.insertSaveInstruction('VARIABLE', bag);

    this.builder.insertNoteInstruction('Extract and save the version string for the message.');
    this.builder.insertLoadInstruction('VARIABLE', message);
    this.builder.insertPushInstruction('LITERAL', '$version');
    this.builder.insertCallInstruction('$parameter', 2);  // parameter(message, key)
    this.builder.insertCallInstruction('$nextVersion', 1);  // nextVersion(version)
    const version = this.createTemporaryVariable('version');
    this.builder.insertSaveInstruction('VARIABLE', version);

    this.builder.insertNoteInstruction('Set the new version string parameter for the message.');
    this.builder.insertLoadInstruction('VARIABLE', message);
    this.builder.insertPushInstruction('LITERAL', '$version');
    this.builder.insertLoadInstruction('VARIABLE', version);
    this.builder.insertCallInstruction('$setParameter', 3);  // setParameter(message, key, value)

    this.builder.insertNoteInstruction('Post the new version of the message to the named message bag.');
    this.builder.insertLoadInstruction('VARIABLE', message);
    this.builder.insertSaveInstruction('MESSAGE', bag);
};


/*
 * This method inserts the instructions that cause the VM to evaluate an
 * optional expression and then set the resulting value that is on top
 * of the component stack as the result of the current procedure. The VM
 * then returns the result to the calling procedure.
 */
// returnClause: 'return' expression?
CompilingVisitor.prototype.visitReturnClause = function(tree) {
    if (tree.getSize() > 0) {
        const result = tree.getItem(1);
        result.acceptVisitor(this);
    } else {
        this.builder.insertPushInstruction('LITERAL', 'none');
    }
    // the VM returns the result to the calling procedure
    this.builder.insertPullInstruction('RESULT');
    this.builder.requiresFinalization = false;
};


/*
 * This method inserts the instructions that cause the VM to save the document into
 * the Bali Document Repository™.
 */
// saveClause: 'save' expression ('as' recipient)?
CompilingVisitor.prototype.visitSaveClause = function(tree) {
    const expression = tree.getItem(1);

    this.builder.insertNoteInstruction('Place the document on the stack.');
    expression.acceptVisitor(this);

    this.builder.insertNoteInstruction('Save the document to the repository and a citation to it.');
    const citation = this.createTemporaryVariable('citation');
    this.builder.insertSaveInstruction('DOCUMENT', citation);

    if (tree.getSize() > 1) {
        const recipient = tree.getItem(2);
        this.visitRecipient(recipient);
        this.builder.insertLoadInstruction('VARIABLE', citation);
        this.setRecipient(recipient);
    }
};


/*
 * This method inserts instructions that cause the VM to evaluate one or
 * condition expressions and execute a procedure block for the condition
 * that matches the value of a selector expression. If none of the
 * conditions are true an optional procedure block may be executed by the VM.
 */
// selectClause: 'select' expression 'from' (expression 'do' block)+ ('else' block)?
CompilingVisitor.prototype.visitSelectClause = function(tree) {
    const doneLabel = this.builder.getStatementContext().doneLabel;
    var elseBlock;
    var clausePrefix;

    // separate out the parts of the statement
    const array = tree.toArray();
    const selector = array.splice(0, 1)[0];  // remove the selector
    if (array.length % 2 === 1) {
        elseBlock = array.pop();  // remove the else block
    }

    // the VM saves the value of the selector expression in a temporary variable
    selector.acceptVisitor(this);
    const selectorVariable = this.createTemporaryVariable('selector');
    this.builder.insertSaveInstruction('VARIABLE', selectorVariable);

    // check each option
    const list = bali.list(array);
    const iterator = list.getIterator();
    while (iterator.hasNext()) {
        var option = iterator.getNext();
        var block = iterator.getNext();
        clausePrefix = this.builder.getBlockPrefix();
        var optionLabel = clausePrefix + 'OptionClause';
        this.builder.insertLabel(optionLabel);

        // the VM loads the selector value onto the top of the componencomponent stack
        this.builder.insertLoadInstruction('VARIABLE', selectorVariable);

        // the VM places the option value on top of the component stack
        option.acceptVisitor(this);

        // the VM checks to see if the selector and option match and places the result on the component stack
        this.builder.insertCallInstruction('$doesMatch', 2);  // matches(selector, option)

        // determine what the next label will be
        var nextLabel = this.builder.getNextBlockPrefix();
        if (!iterator.hasNext()) {
            // we are on the last option
            if (elseBlock) {
                nextLabel += 'ElseClause';
            } else {
                nextLabel = doneLabel;
            }
        } else {
            nextLabel += 'OptionClause';
        }

        // if the option does not match, the VM jumps to the next option, the else block, or the end
        this.builder.insertJumpInstruction(nextLabel, 'ON FALSE');

        // if the option matches, then the VM enters the block
        block.acceptVisitor(this);

        // completed execution of the block
        if (elseBlock || iterator.hasNext()) {
            // not the last block so the VM jumps to the end of the statement
            this.builder.insertLabel(clausePrefix + 'OptionClauseDone');
            this.builder.insertJumpInstruction(doneLabel);
        }
    }

    // the VM executes the optional else block
    if (elseBlock) {
        clausePrefix = this.builder.getBlockPrefix();
        const elseLabel = clausePrefix + 'ElseClause';
        this.builder.insertLabel(elseLabel);
        elseBlock.acceptVisitor(this);
        this.builder.insertLabel(clausePrefix + 'ElseClauseDone');
        this.builder.insertJumpInstruction(doneLabel);
    }
};


/*
 * This method compiles a sequence of statements by inserting instructions for
 * the VM to follow for each statement. Since procedure blocks can be nested
 * within statement clauses each procedure needs its own compilation context. When
 * entering a procedure a new context is pushed onto the compilation stack and when
 * the procedure is done being compiled, that context is popped back off the stack.
 * NOTE: This stack is different than the runtime component stack that is
 * maintained by the Nebula Virtual Processor.
 */
// statements:
//     statement (';' statement)*   |
//     EOL (statement EOL)* |
//     /*empty statements*/
CompilingVisitor.prototype.visitStatements = function(statements) {
    // create a new compiler procedure context in the instruction builder
    this.builder.pushProcedureContext(statements);

    // the VM executes each statement
    const iterator = statements.getIterator();
    while (iterator.hasNext()) {
        this.builder.requiresFinalization = true;
        var statement = iterator.getNext();
        statement.acceptVisitor(this);
        this.builder.incrementStatementCount();
    }

    // throw away the current compiler procedure context in the instruction builder
    this.builder.popProcedureContext();
};


/*
 * This method inserts instructions that cause the VM to attempt to execute
 * a main clause and then if any exceptions are thrown attempts to handle
 * them using a sequence of handle clauses.
 */
// statement: mainClause handleClause?
CompilingVisitor.prototype.visitStatement = function(tree) {
    // initialize the context for this statement
    const statement = this.builder.pushStatementContext(tree);
    this.builder.insertLabel(statement.startLabel);

    // the VM pushes any exception handlers onto the exception handler stack
    if (this.builder.hasHandler()) {
        this.builder.insertPushInstruction('HANDLER', statement.handlerLabel);
    }

    // the VM attempts to execute the main clause
    statement.mainClause.acceptVisitor(this);

    // the VM made it through the main clause without any exceptions
    if (this.builder.hasBlocks()) {
        // need a label for subclauses to jump to when done
        this.builder.insertLabel(statement.doneLabel);

        if (this.builder.hasHandler()) {
            // the exception handlers are no longer needed
            this.builder.insertPullInstruction('HANDLER');

            // jump over the exception handlers
            this.builder.insertJumpInstruction(statement.successLabel);

            // the VM will direct any exceptions from the main clause here to be handled
            this.builder.insertLabel(statement.handlerLabel);

            // the VM tries each handler block for the exception
            const handleClause = statement.handleClause;
            handleClause.acceptVisitor(this);
        }
    }

    // the VM moves on to the next statement
    this.builder.popStatementContext();
};


/*
 * This method inserts the instructions that cause the VM to replace
 * the value of an expression that is on top of the component stack
 * with its attribute referred to by the indices.
 */
// attributeExpression: expression '[' indices ']'
CompilingVisitor.prototype.visitAttributeExpression = function(tree) {
    const component = tree.getItem(1);
    const indices = tree.getItem(2);
    // the VM places the value of the expression on top of the component stack
    component.acceptVisitor(this);
    // the VM replaces the value on the component stack with the parent and index of the attribute
    indices.acceptVisitor(this);
    // the VM retrieves the value of the attribute at the given index of the parent component
    this.builder.insertCallInstruction('$attribute', 2);  // attribute(composite, index)
    // the parent and index have been replaced by the value of the attribute
};


// symbol: SYMBOL
CompilingVisitor.prototype.visitSymbol = function(symbol) {
    this.visitElement(symbol);
};


// tag: TAG
CompilingVisitor.prototype.visitTag = function(tag) {
    this.visitElement(tag);
};


// text: TEXT | TEXT_BLOCK
CompilingVisitor.prototype.visitText = function(text) {
    // TODO: add instructions to first process procedure blocks embedded within text
    this.visitElement(text);
};


/*
 * This method inserts the instructions that cause the VM to evaluate an
 * exception expression and then jumps to the the handle clauses for the
 * current handler context.
 */
// throwClause: 'throw' expression
CompilingVisitor.prototype.visitThrowClause = function(tree) {
    const exception = tree.getItem(1);
    // the VM places the value of the exception expression on top of the component stack
    exception.acceptVisitor(this);
    // the VM jumps to the handler clauses for the current context
    this.builder.insertPullInstruction('EXCEPTION');
    this.builder.requiresFinalization = false;
};


/*
 * This method inserts the instructions that cause the VM to place the
 * value of a variable onto the top of the component stack.
 */
// variable: IDENTIFIER
CompilingVisitor.prototype.visitVariable = function(identifier) {
    // the VM loads the value of the variable onto the top of the component stack
    const variable = '$' + identifier.toString();
    if (this.builder.argumentz.containsItem(variable)) {
        // arguments take precedence over local variables and global constants
        this.builder.insertPushInstruction('ARGUMENT', variable);
    } else if (this.builder.constants.getAttribute(variable)) {
        // global constants take precedence over local variables
        this.builder.insertPushInstruction('CONSTANT', variable);
    } else {
        // it is a local variable
        this.builder.insertLoadInstruction('VARIABLE', variable);
    }
};


// version: VERSION
CompilingVisitor.prototype.visitVersion = function(version) {
    this.visitElement(version);
};


/*
 * This method inserts instructions that cause the VM to repeatedly execute a procedure
 * block while a condition expression is true.
 */
// whileClause: 'while' expression 'do' block
CompilingVisitor.prototype.visitWhileClause = function(tree) {
    const condition = tree.getItem(1);
    const block = tree.getItem(2);
    const clausePrefix = this.builder.getBlockPrefix();

    // construct the loop and done labels
    const statement = this.builder.getStatementContext();
    statement.loopLabel = clausePrefix + 'ConditionClause';

    // label the start of the loop
    this.builder.insertLabel(statement.loopLabel);

    // the VM jumps past the end of the loop if the condition expression evaluates to false
    condition.acceptVisitor(this);
    this.builder.insertJumpInstruction(statement.doneLabel, 'ON FALSE');

    // if the condition is true, then the VM enters the block
    block.acceptVisitor(this);

    // the VM jumps to the top of the loop for the next iteration
    const statementPrefix = this.builder.getStatementPrefix();
    const repeatLabel = statementPrefix + 'ConditionRepeat';
    this.builder.insertLabel(repeatLabel);
    this.builder.insertJumpInstruction(statement.loopLabel);
};


/*
 * This method inserts instructions that cause the VM to execute a procedure block for
 * each item in a collection expression.
 */
// withClause: 'with' ('each' symbol 'in')? expression 'do' block
CompilingVisitor.prototype.visitWithClause = function(tree) {
    const variable = tree.getSize() > 2 ? tree.getItem(1).toString() : this.createTemporaryVariable('item');
    const sequence = tree.getItem(-2);
    const block = tree.getItem(-1);
    const clausePrefix = this.builder.getBlockPrefix();

    // construct the loop and done labels
    const statement = this.builder.getStatementContext();
    statement.loopLabel = clausePrefix + 'ConditionClause';

    // the VM places the value of the sequence expression onto the top of the component stack
    sequence.acceptVisitor(this);

    // the VM replaces the sequence on the component stack with an iterator to it
    this.builder.insertSendInstruction('$iterator', 'TO COMPONENT');

    // The VM saves the iterater in a temporary variable
    const iterator = this.createTemporaryVariable('iterator');
    this.builder.insertSaveInstruction('VARIABLE', iterator);

    // label the start of the loop
    this.builder.insertLabel(statement.loopLabel);

    // the VM jumps past the end of the loop if the iterator has no more items
    this.builder.insertLoadInstruction('VARIABLE', iterator);
    this.builder.insertSendInstruction('$hasNext', 'TO COMPONENT');
    this.builder.insertJumpInstruction(statement.doneLabel, 'ON FALSE');

    // the VM places the iterator back onto the component stack
    this.builder.insertLoadInstruction('VARIABLE', iterator);

    // the VM replaces the iterator on the component stack with the next item from the sequence
    this.builder.insertSendInstruction('$next', 'TO COMPONENT');

    // the VM saves the item that is on top of the component stack in the variable
    this.builder.insertSaveInstruction('VARIABLE', variable);

    // the VM executes the block using the item if needed
    block.acceptVisitor(this);

    // the VM jumps to the top of the loop for the next iteration
    const statementPrefix = this.builder.getStatementPrefix();
    const repeatLabel = statementPrefix + 'ConditionRepeat';
    this.builder.insertLabel(repeatLabel);
    this.builder.insertJumpInstruction(statement.loopLabel);
};


/*
 * This method creates a new temporary variable name. Since each variable name must
 * be unique within the scope of the procedure block being compiled, a counter is
 * used to append a unique number to the end of each temporary variable.
 */
CompilingVisitor.prototype.createTemporaryVariable = function(name) {
    return '$' + name + '-' + this.temporaryVariableCount++;
};


/*
 * This method inserts instructions that cause the VM to either set
 * the value of a variable or an attribute to the value on the top of the
 * component stack.
 */
CompilingVisitor.prototype.setRecipient = function(recipient) {
    if (recipient.isType('/bali/elements/Symbol')) {
        const symbol = recipient.toString();
        if (symbol === '$target') {
            const exception = bali.exception({
                $module: '/bali/compiler/Compiler',
                $procedure: '$setRecipient',
                $exception: '$immutable',
                $recipient: recipient,
                $message: 'The $target variable is immutable.'
            });
            if (this.debug) console.error(exception.toString());
            throw exception;
        }
        this.builder.insertSaveInstruction('VARIABLE', symbol);
    } else {
        this.builder.insertNoteInstruction('Assign the result as the value of the attribute.');
        this.builder.insertCallInstruction('$setAttribute', 3);
        this.builder.insertPullInstruction('COMPONENT');
    }
};


// PRIVATE FUNCTIONS

/*
 * This function defines a missing stack function for the standard Array class.
 * The push(item) and pop() methods are already defined.
 */
Array.prototype.peek = function() {
    return this[this.length - 1];
};


/*
 * This function returns the number of blocks in a clause.
 *
 * @param {Object} clause The clause containing zero or more blocks.
 * @returns {Number} The number of blocks in the clause.
 */
function countBlocks(clause) {
    var count = 0;
    if (clause) {
        const iterator = clause.getIterator();
        while (iterator.hasNext()) {
            var item = iterator.getNext();
            if (item.isType('/bali/structures/Block')) {
                count++;
            }
        }
    }
    return count;
}


// PRIVATE BUILDER CLASS

/*
 * This helper class is used to construct the Bali assembly code for the procedure defined
 * within a method. It maintains a stack of procedure context objects that track the current
 * statement number and clause number within each procedure.  A prefix is a dot separated
 * sequence of positive numbers defining alternately the statement number and  clause number.
 * For example, a prefix of '2.3.4.' would correspond to the fourth statement in the third
 * clause of the second statement in the main procedure.
 */
function InstructionBuilder(type, method, debug) {
    this.debug = debug || false;

    // setup the compilation context
    this.literals = type.getAttribute('$literals') || bali.set();
    this.constants = type.getAttribute('$constants') || bali.catalog();
    this.argumentz = bali.list();
    const parameters = method.getAttribute('$parameters');
    if (parameters) this.argumentz.addItems(parameters.getKeys());
    this.variables = bali.set();
    this.messages = bali.set();
    this.instructions = '';
    this.addresses = bali.catalog();
    this.address = 1;  // cardinal based addressing
    this.stack = [];  // stack of procedure contexts

    // add the compilation context to the type and method
    type.setAttribute('$literals', this.literals);
    method.setAttribute('$instructions', bali.pattern.NONE);
    method.setAttribute('$addresses', this.addresses);
    method.setAttribute('$bytecode', bali.pattern.NONE);
    method.setAttribute('$arguments', this.argumentz);
    method.setAttribute('$variables', this.variables);
    method.setAttribute('$messages', this.messages);

    return this;
}
InstructionBuilder.prototype.constructor = InstructionBuilder;


/*
 * This method pushes a new procedure context onto the procedure stack and initializes
 * it based on the parent procedure context if one exists.
 */
InstructionBuilder.prototype.pushProcedureContext = function(procedure) {
    const statementCount = procedure.getSize();
    if (this.stack.length > 0) {
        const parent = this.stack.peek();
        this.stack.push({
            statementNumber: 1,
            statementCount: statementCount,
            prefix: parent.prefix + parent.statementNumber + '.' + parent.statement.blockNumber + '.'
        });
        parent.statement.blockNumber++;
    } else {
        this.stack.push({
            statementNumber: 1,
            statementCount: statementCount,
            prefix: ''
        });
    }
};


/*
 * This method pops off the current procedure context when the compiler is done processing
 * that procedure.
 */
InstructionBuilder.prototype.popProcedureContext = function() {
    this.stack.pop();
};


/*
 * This method pushes a new statement context onto the procedure stack and initializes
 * it.
 */
InstructionBuilder.prototype.pushStatementContext = function(tree) {
    const mainClause = tree.getItem(1);
    const handleClause = tree.getSize() > 1 ? tree.getItem(2) : undefined;
    const blockCount = countBlocks(mainClause) + countBlocks(handleClause);
    const statement = {
        mainClause: mainClause,
        handleClause: handleClause,
        blockCount: blockCount,
        blockNumber: 1
    };

    // initialize the procedure configuration for this statement
    const procedure = this.stack.peek();
    procedure.statement = statement;
    const type = statement.mainClause.getType().split('/')[3].slice(0, -6);  // remove '/bali/structures/' and 'Clause'
    const prefix = procedure.prefix + procedure.statementNumber + '.';
    statement.startLabel = prefix + type + 'Statement';
    if (statement.blockCount > 0) {
        statement.doneLabel = prefix + type + 'StatementDone';
    }
    if (statement.handleClause) {
        statement.handlerLabel = prefix + type + 'StatementHandler';
        statement.failureLabel = prefix + type + 'StatementFailed';
        statement.successLabel = prefix + type + 'StatementSucceeded';
    }

    return procedure.statement;
};


/*
 * This method pops off the current statement context when the compiler is done processing
 * that statement.
 */
InstructionBuilder.prototype.popStatementContext = function() {
    this.stack.peek().statement = undefined;
};


/*
 * This method determines whether or not the current statement contains clauses.
 */
InstructionBuilder.prototype.hasBlocks = function() {
    const statement = this.stack.peek().statement;
    return statement.blockCount > 0;
};


/*
 * This method determines whether or not the current statement contains handlers.
 */
InstructionBuilder.prototype.hasHandler = function() {
    const statement = this.stack.peek().statement;
    return statement.handleClause !== undefined;
};


/*
 * This method returns the number of the current clause within its procedure context. For
 * example a 'then' clause within an 'if then else' statement would be the first clause
 * and the 'else' clause would be the second clause. Exception clauses and final clauses
 * are also included in the numbering.
 */
InstructionBuilder.prototype.getBlockNumber = function() {
    const procedure = this.stack.peek();
    const number = procedure.statement.blockNumber;
    return number;
};


/*
 * This method returns the number of the current statement within its procedure context. The
 * statements are numbered sequentially starting with the number 1.
 */
InstructionBuilder.prototype.getStatementNumber = function() {
    const procedure = this.stack.peek();
    const number = procedure.statementNumber;
    return number;
};


/*
 * This method increments by one the statement counter within the current procedure context.
 */
InstructionBuilder.prototype.incrementStatementCount = function() {
    const procedure = this.stack.peek();
    procedure.statementNumber++;
};


/*
 * This method returns the label prefix for the current instruction within the current
 * procedure context.
 */
InstructionBuilder.prototype.getStatementPrefix = function() {
    const procedure = this.stack.peek();
    const prefix = procedure.prefix + procedure.statementNumber + '.';
    return prefix;
};


/*
 * This method returns the type of the current statement.
 */
InstructionBuilder.prototype.getStatementType = function() {
    const statement = this.stack.peek().statement;
    const type = statement.mainClause.getType().split('/')[3].slice(0, -6);  // remove '/bali/structures/' and 'Clause'
    return type;
};


/*
 * This method returns the context for the current statement.
 */
InstructionBuilder.prototype.getStatementContext = function() {
    const statement = this.stack.peek().statement;
    return statement;
};


/*
 * This method returns the label prefix for the current clause within the current
 * procedure context.
 */
InstructionBuilder.prototype.getBlockPrefix = function() {
    const procedure = this.stack.peek();
    const prefix = procedure.prefix + procedure.statementNumber + '.' + procedure.statement.blockNumber + '.';
    return prefix;
};


/*
 * This method returns the label prefix for the next clause within the current
 * procedure context.
 */
InstructionBuilder.prototype.getNextBlockPrefix = function() {
    const procedure = this.stack.peek();
    const prefix = procedure.prefix + procedure.statementNumber + '.' + (procedure.statement.blockNumber + 1) + '.';
    return prefix;
};


/*
 * This method sets the label to be used for the next instruction. If a label has
 * already been set, then the existing label is used to label a new
 * 'JUMP TO NEXT INSTRUCTION' that is inserted.
 */
InstructionBuilder.prototype.insertLabel = function(label) {
    // check for existing label
    if (this.nextLabel) {
        this.insertJumpInstruction();  // JUMP TO NEXT INSTRUCTION
    }

    // set the new label
    this.nextLabel = label;
};


/*
 * This method inserts into the assembly code the specified instruction. If
 * a label is pending it is prepended to the instruction.
 */
InstructionBuilder.prototype.insertInstruction = function(instruction) {
    if (this.nextLabel) {
        this.addresses.setAttribute(this.nextLabel, this.address);
        this.instructions += EOL;
        this.instructions += this.nextLabel + ':' + EOL;
        this.nextLabel = undefined;
    }
    this.instructions += instruction + EOL;
    this.address++;
};


/*
 * This method inserts a 'note' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertNoteInstruction = function(comment) {
    if (this.nextLabel) {
        this.addresses.setAttribute(this.nextLabel, this.address);
        this.instructions += EOL;
        this.instructions += this.nextLabel + ':' + EOL;
        this.nextLabel = undefined;
    }
    this.instructions += 'NOTE --' + comment + EOL;
};


/*
 * This method inserts a 'jump' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertJumpInstruction = function(label, context) {
    var instruction = 'JUMP TO ' + (label? label : 'NEXT INSTRUCTION');
    if (context) instruction += ' ' + context;
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'push' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertPushInstruction = function(type, value) {
    var instruction = 'PUSH ' + type + ' ';
    switch (type) {
        case 'HANDLER':
            instruction += value;
            break;
        case 'LITERAL':
            var literal = '`' + value + '`';
            instruction += literal;
            literal = bali.component(value);
            this.literals.addItem(literal);
            break;
        case 'CONSTANT':
            instruction += value;
            break;
        case 'ARGUMENT':
            instruction += value;
            break;
    }
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'pull' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertPullInstruction = function(type) {
    const instruction = 'PULL ' + type;
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'load' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertLoadInstruction = function(type, symbol) {
    const instruction = 'LOAD ' + type + ' ' + symbol;
    this.insertInstruction(instruction);
    this.variables.addItem(symbol);
};


/*
 * This method inserts a 'save' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertSaveInstruction = function(type, symbol) {
    const instruction = 'SAVE ' + type + ' ' + symbol;
    this.insertInstruction(instruction);
    this.variables.addItem(symbol);
};


/*
 * This method inserts a 'drop' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertDropInstruction = function(type, symbol) {
    const instruction = 'DROP ' + type + ' ' + symbol;
    this.insertInstruction(instruction);
    this.variables.addItem(symbol);
};


/*
 * This method inserts an 'call' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertCallInstruction = function(intrinsic, numberOfArguments) {
    var instruction = 'CALL ' + intrinsic;
    switch (numberOfArguments) {
        case undefined:
        case 0:
            break;
        case 1:
            instruction += ' WITH 1 ARGUMENT';
            break;
        default:
            instruction += ' WITH ' + numberOfArguments + ' ARGUMENTS';
    }
    this.insertInstruction(instruction);
};


/*
 * This method inserts an 'send' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertSendInstruction = function(message, context) {
    var instruction = 'SEND ' + message + ' ' + context;
    this.insertInstruction(instruction);
    this.messages.addItem(message);
};


/*
 * This method finalizes the builder by adding instructions to handle the
 * result if not handled earlier.
 */
InstructionBuilder.prototype.finalize = function() {
    this.insertLoadInstruction('VARIABLE', '$result-1');
    this.insertPullInstruction('RESULT');
};
