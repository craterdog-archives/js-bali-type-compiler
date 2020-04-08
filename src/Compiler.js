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
 * procedure defined in the document. The bytecode can then be executed on a
 * Bali Nebula™ virtual processor.
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
 * compiled type document containing the bytecode for each of its procedures.
 *
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Compiler} The new document compiler.
 */
function Compiler(debug) {
    this.debug = debug || false;
    return this;
}
Compiler.prototype.constructor = Compiler;
exports.Compiler = Compiler;


/**
 * This function compiles a type definition so that it may be run on the Bali Nebula™ virtual
 * machine.
 *
 * @param {Catalog} type The type definition to be compiled.
 */
Compiler.prototype.compileType = async function(type) {
    const assembler = new Assembler(this.debug);

    var constants = type.getValue('$constants');
    if (!constants || constants.isEqualTo(bali.pattern.NONE)) {
        constants = bali.catalog();
        type.setValue('$constants', constants);
    }

    var procedures = type.getValue('$procedures');
    if (!procedures || procedures.isEqualTo(bali.pattern.NONE)) {
        procedures = bali.catalog();
        type.setValue('$procedures', procedures);
    }

    type.setValue('$literals', bali.list());

    // compile each procedure
    const iterator = procedures.getIterator();
    while (iterator.hasNext()) {

        // retrieve the source code for the procedure
        const association = iterator.getNext();
        const procedure = association.getValue();

        // compile the source code into assembly instructions
        this.compileProcedure(type, procedure);

        // assemble the instructions into bytecode
        assembler.assembleProcedure(type, procedure);
    }
};


/**
 * This method compiles the a procedure containing Bali source code into the corresponding
 * assembly instructions for the Bali Nebula™ virtual processor.
 *
 * @param {Catalog} type The type context for the procedure being compiled.
 * @param {Catalog} procedure The procedure to be compiled.
 */
Compiler.prototype.compileProcedure = function(type, procedure) {
    const source = procedure.getValue('$source');

    // extract the parameter names for the procedure
    const parameters = bali.list();
    if (source.isParameterized()) {
        const keys = Object.keys(source.getParameters());
        keys.forEach(function(key) {
            parameters.addItem(key);
        });
    }

    // add the compilation context to the procedure
    procedure.setValue('$instructions', bali.pattern.NONE);
    procedure.setValue('$bytecode', bali.pattern.NONE);
    procedure.setValue('$addresses', bali.catalog());
    procedure.setValue('$messages', bali.set());
    procedure.setValue('$parameters', parameters);
    procedure.setValue('$variables', bali.set(['$target']));

    // compile the procedure into assembly instructions
    const visitor = new CompilingVisitor(type, procedure, this.debug);
    source.getStatements().acceptVisitor(visitor);

    // format the instructions and add to the compiled procedure
    var instructions = visitor.getInstructions();
    const parser = new Parser(this.debug);
    instructions = parser.parseInstructions(instructions);
    const formatter = new Formatter(0, this.debug);
    instructions = bali.text(EOL + formatter.formatInstructions(instructions) + EOL, {$mediatype: 'application/basm'});
    procedure.setValue('$instructions', instructions);
};


// PRIVATE CLASSES

/*
 * This private class uses the Visitor Pattern to traverse the syntax tree generated
 * by the parser. It in turn uses another private class, the InstructionBuilder,
 * to construct the corresponding Bali Nebula™ virtual processor instructions for the
 * syntax tree is it traversing.
 */
function CompilingVisitor(type, procedure, debug) {
    Visitor.call(this);
    this.debug = debug || false;
    this.builder = new InstructionBuilder(type, procedure);
    this.temporaryVariableCount = 1;
    return this;
}
CompilingVisitor.prototype = Object.create(Visitor.prototype);
CompilingVisitor.prototype.constructor = CompilingVisitor;


/**
 * This method returns the resulting assembly instructions for the compiled procedure.
 *
 * @returns {String}
 */
CompilingVisitor.prototype.getInstructions = function() {
    if (this.builder.requiresFinalization) this.builder.finalize();
    return this.builder.instructions;
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

    // the VM places the result of the first operand expression on top of the component stack
    firstOperand.acceptVisitor(this);

    // the VM places the result of the second operand expression on top of the component stack
    secondOperand.acceptVisitor(this);

    const operator = tree.operator;
    switch (operator) {
        case '*':
            // the VM places the product of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$product', 2);  // product(x, y)
            break;
        case '/':
            // the VM places the quotient of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$quotient', 2);  // quotient(x, y)
            break;
        case '//':
            // the VM places the remainder of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$remainder', 2);  // remainder(x, y)
            break;
        case '+':
            // the VM places the sum of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$sum', 2);  // sum(x, y)
            break;
        case '-':
            // the VM places the difference of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$difference', 2);  // difference(x,y)
            break;
    }

    // the resulting value remains on the top of the component stack
};


// association: component ':' expression
CompilingVisitor.prototype.visitAssociation = function(association) {
    // the VM places the association key on top of the component stack
    association.getKey().acceptVisitor(this);

    // the VM places the association value on top of the component stack
    association.getValue().acceptVisitor(this);

    // the VM replaces the arguments on the component stack with a new association
    this.builder.insertInvokeInstruction('$association', 2);  // association(key, value)
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
            // the VM jumps out of the enclosing loop
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
 * This method compiles the instructions needed to checkout from the Bali Nebula™
 * a persistent document and assign it to a recipient. The recipient may be either
 * a variable or an indexed child of a collection component.
 */
// checkoutClause: 'checkout' recipient 'from' expression
CompilingVisitor.prototype.visitCheckoutClause = function(tree) {
    const recipient = tree.getItem(1);
    const reference = tree.getItem(2);

    // the VM processes the recipient as needed
    recipient.acceptVisitor(this);

    // the VM places the value of the reference to the location of the document
    // on top of the component stack
    reference.acceptVisitor(this);

    // the VM stores the value of the reference to the location into a temporary variable
    const location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM loads the document from the remote location onto the top of the component stack
    this.builder.insertLoadInstruction('DOCUMENT', location);

    // the VM sets the value of the recipient to the value on the top of the component stack
    this.setRecipient(recipient);
};


/*
 * This method inserts the instructions that cause the VM to place the collection
 * on top of the component stack.
 */
// collection: range | list | catalog
CompilingVisitor.prototype.visitCollection = function(collection) {
    var numberOfArguments = collection.isParameterized() ? 1 : 0;
    if (collection.isType('/bali/collections/Range')) {
        var parameters;
        if (numberOfArguments) {
            // the VM saves off the parameters for after the indices are loaded
            parameters = this.createTemporaryVariable('parameters');
            this.builder.insertStoreInstruction('VARIABLE', parameters);
        }

        // the VM places the value of the starting expression on the component stack
        const first = collection.getFirst();
        first.acceptVisitor(this);  // first value in the range

        // the VM places the value of the ending expression on the component stack
        const last = collection.getLast();
        last.acceptVisitor(this);  // last value in the range

        if (numberOfArguments) {
            // load the parameters back onto the component stack
            this.builder.insertLoadInstruction('VARIABLE', parameters);
        }

        // the VM replaces the arguments on the component stack with a new parameterized range
        numberOfArguments += 2;  // for the first and last values
        this.builder.insertInvokeInstruction('$range', numberOfArguments);  // range(first, last, parameters)

    } else {
        // the VM replaces any parameters on the component stack with a new parameterized collection
        var type = collection.getType().split('/')[3];
        type = '$' + type.charAt(0).toLowerCase() + type.slice(1);
        this.builder.insertInvokeInstruction(type, numberOfArguments);  // <type>(parameters)

        // the VM adds each expression to the collection
        this.depth++;
        const iterator = collection.getIterator();
        while (iterator.hasNext()) {
            var item = iterator.getNext();
            item.acceptVisitor(this);
            this.builder.insertInvokeInstruction('$addItem', 2);  // addItem(collection, item)
        }
        this.depth--;
    }

    // the parameterized collection remains on the component stack
};


/*
 * This method inserts the instructions needed to commit to the Bali Nebula™
 * a document that is on top of the component stack. A reference to
 * the location of the persistent document is evaluated by the VM.
 */
// commitClause: 'commit' expression 'to' expression
CompilingVisitor.prototype.visitCommitClause = function(tree) {
    const document = tree.getItem(1);
    const reference = tree.getItem(2);

    // the VM loads the value of the reference to the location of the persistent
    // document onto the top of the component stack
    reference.acceptVisitor(this);

    // the VM stores the value of the reference to the location into a temporary variable
    const location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM loads the value of the document onto the top of the component stack
    document.acceptVisitor(this);

    // the VM stores the document on top of the component stack into the remote location
    this.builder.insertStoreInstruction('DOCUMENT', location);
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

    // the VM places the result of the first operand expression on top of the component stack
    firstOperand.acceptVisitor(this);

    // the VM places the result of the second operand expression on top of the component stack
    secondOperand.acceptVisitor(this);

    // the VM performs the comparison operation
    const operator = tree.operator;
    switch (operator) {
        case '<':
            // determine whether or not the first value is less than the second value
            this.builder.insertInvokeInstruction('$isLess', 2);  // less(x, y)
            break;
        case '=':
            // determine whether or not the first value is equal to the second value
            this.builder.insertInvokeInstruction('$areEqual', 2);  // equal(x, y)
            break;
        case '>':
            // determine whether or not the first value is more than the second value
            this.builder.insertInvokeInstruction('$isMore', 2);  // more(x, y)
            break;
        case 'IS':
            // determine whether or not the first value is the same value as the second value
            this.builder.insertInvokeInstruction('$areSame', 2);  // same(this, that)
            break;
        case 'MATCHES':
            // determine whether or not the first value matches the second value
            this.builder.insertInvokeInstruction('$doesMatch', 2);  // doesMatch(component, pattern)
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

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);

    // the VM finds the logical complement of the top value on the component stack
    this.builder.insertInvokeInstruction('$not', 1);  // not(p)
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

    // the VM places the result of the first operand expression on top of the component stack
    firstOperand.acceptVisitor(this);

    // the VM places the result of the second operand expression on top of the component stack
    secondOperand.acceptVisitor(this);

    // the VM places the product of the two values on top of the component stack
    this.builder.insertInvokeInstruction('$concatenation', 2);  // concatenation(a, b)

    // the resulting value remains on the top of the component stack
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
            // the VM jumps to the beginning of the enclosing loop
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

    // the VM places the value of the proposed expression on top of the component stack
    proposedValue.acceptVisitor(this);

    // the VM places the value of the default expression on top of the component stack
    defaultValue.acceptVisitor(this);

    // the VM leaves the actual value on the top of the component stack
    this.builder.insertInvokeInstruction('$default', 2);  // default(value, defaultValue)
};


/*
 * This method inserts the instructions that cause the VM to replace the
 * value of the reference expression that is on top of the component stack
 * with the value that it references.
 */
// dereferenceExpression: '@' expression
CompilingVisitor.prototype.visitDereferenceExpression = function(tree) {
    const reference = tree.getItem(1);

    // the VM loads the value of the reference to the location onto the top of the component stack
    reference.acceptVisitor(this);

    // the VM stores the value of the reference to the location into a temporary variable
    const location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM loads the document from the remote location onto the top of the component stack
    this.builder.insertLoadInstruction('DOCUMENT', location);

    // the referenced document remains on top of the component stack
};


/*
 * This method inserts the instructions needed to discard from the Bali Nebula™
 * a persistent draft of a document. A reference to the location of the persistent
 * draft is evaluated by the VM.
 */
// discardClause: 'discard' expression
CompilingVisitor.prototype.visitDiscardClause = function(tree) {
    const reference = tree.getItem(1);

    // the VM loads the value of the reference to the location onto the top of the component stack
    reference.acceptVisitor(this);  // reference expression

    // the VM stores the value of the reference to the location into a temporary variable
    const location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM stores no document into the remote location
    this.builder.insertPushInstruction('LITERAL', 'none');
    this.builder.insertStoreInstruction('DRAFT', location);
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
//     reference |
//     symbol |
//     tag |
//     template |
//     text |
//     version
CompilingVisitor.prototype.visitElement = function(element) {
    // TODO: add instructions to process procedure blocks embedded within text

    // the VM loads the element value onto the top of the component stack
    const literal = element.toBDN();
    this.builder.insertPushInstruction('LITERAL', literal);
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
        // TODO: revisit this as it is currently awkward, it shouldn't require a check
        // the VM processes the recipient as needed
        const recipient = tree.getItem(1);
        if (recipient.isType('/bali/composites/SubcomponentExpression')) {
            recipient.acceptVisitor(this);
        }

        // the VM places the value of the expression on top of the component stack
        expression.acceptVisitor(this);

        // the VM sets the value of the recipient to the value on the top of the component stack
        this.setRecipient(recipient);
    } else {
        // the VM places the value of the expression on top of the component stack
        expression.acceptVisitor(this);

        // the VM stores the value of the expression in the temporary result variable
        this.builder.insertStoreInstruction('VARIABLE', '$$result');
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

    // the VM places the result of the base expression on top of the component stack
    firstOperand.acceptVisitor(this);

    // the VM places the result of the exponent expression on top of the component stack
    secondOperand.acceptVisitor(this);

    // the VM leaves the result of raising the base to the exponent on top of the component stack
    this.builder.insertInvokeInstruction('$exponential', 2);  // exponential(x, power)
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the mathematical
 * factorial of the value.
 */
// factorialExpression: expression '!'
CompilingVisitor.prototype.visitFactorialExpression = function(tree) {
    const operand = tree.getItem(1);

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);

    // the VM leaves the result of the factorial of the value on top of the component stack
    this.builder.insertInvokeInstruction('$factorial', 1);  // factorial(x)
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
    const args = tree.getItem(2);

    // make sure the number of arguments is less than 4
    const numberOfArguments = args.getSize();
    if (numberOfArguments > 3) {
        const exception = bali.exception({
            $module: '/bali/compiler/Compiler',
            $procedure: '$visitFunctionExpression',
            $exception: '$argumentCount',
            $function: tree,
            $message: 'The number of arguments to a function must be less than 4.'
        });
        if (this.debug) console.error(exception.toString());
        throw exception;
    }

    // the VM places each argument on top of the component stack (not a list of the arguments)
    this.depth++;
    const iterator = args.getIterator();
    while (iterator.hasNext()) {
        const argument = iterator.getNext();
        argument.acceptVisitor(this);
    }
    this.depth--;

    // the VM replaces the arguments on the component stack with the result of the function
    this.builder.insertInvokeInstruction(functionName, numberOfArguments);  // <function>(arguments...)

    // the result of the executed function remains on top of the component stack
};


/*
 * This method inserts instructions that cause the VM to attempt to handle
 * the exception that is on top of the component stack. The exception must
 * match the value of the template expression or the VM will jump to the next
 * handler or the end of the exception clauses if there isn't another one.
 */
// handleClause: 'handle' symbol 'matching' expression 'with' block
CompilingVisitor.prototype.visitHandleClause = function(tree) {
    const symbol = tree.getItem(1);
    const template = tree.getItem(2);
    const block = tree.getItem(3);

    // setup the labels
    const statement = this.builder.getStatementContext();
    const clausePrefix = this.builder.getClausePrefix();
    const handleLabel = clausePrefix + 'HandleClause';
    this.builder.insertLabel(handleLabel);

    // the VM stores the exception that is on top of the component stack in the variable
    const exception = symbol.toString();
    this.builder.insertStoreInstruction('VARIABLE', exception);

    // the VM loads the exception back on top of the component stack for the next handler
    this.builder.insertLoadInstruction('VARIABLE', exception);

    // the VM compares the template expression with the actual exception
    this.builder.insertLoadInstruction('VARIABLE', exception);
    template.acceptVisitor(this);
    this.builder.insertInvokeInstruction('$doesMatch', 2);  // matches(symbol, pattern)

    // if the template and exception did not match the VM jumps past this exception handler
    var nextLabel = this.builder.getNextClausePrefix() + 'HandleClause';
    if (statement.clauseNumber === statement.clauseCount) {
        nextLabel = statement.failureLabel;
    }
    this.builder.insertJumpInstruction(nextLabel, 'ON FALSE');

    // the VM pops the exception off the component stack since this handler will handle it
    this.builder.insertPopInstruction('COMPONENT');

    // the VM executes the handler block
    block.acceptVisitor(this);

    // the exception was handled successfully
    this.builder.insertLabel(clausePrefix + 'HandleClauseDone');
    this.builder.insertJumpInstruction(statement.successLabel);
};


/*
 * This method inserts instructions that cause the VM to evaluate one or
 * condition expressions and execute a procedure block for the condition
 * that evaluates to 'true'. If none of the conditions are true an optional
 * procedure block may be executed by the VM.
 */
// ifClause: 'if' expression 'then' block ('else' 'if' expression 'then' block)* ('else' block)?
CompilingVisitor.prototype.visitIfClause = function(tree) {
    const doneLabel = this.builder.getStatementContext().doneLabel;
    var elseBlock;
    var clausePrefix;

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
        clausePrefix = this.builder.getClausePrefix();
        var conditionLabel = clausePrefix + 'ConditionClause';
        this.builder.insertLabel(conditionLabel);

        // the VM places the condition value on top of the component stack
        condition.acceptVisitor(this);

        // determine what the next label will be
        var nextLabel = this.builder.getNextClausePrefix();
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
        clausePrefix = this.builder.getClausePrefix();
        const elseLabel = clausePrefix + 'ElseClause';
        this.builder.insertLabel(elseLabel);
        elseBlock.acceptVisitor(this);
        this.builder.insertLabel(clausePrefix + 'ElseClauseDone');
    }
};


/*
 * This method inserts instructions that cause the VM to traverse all but the
 * last index in a list of indices associated with a component. For each index
 * the VM replaces the component that is on top of the component stack with its
 * subcomponent at that index. It leaves the parent component and the index of
 * the final subcomponent on the component stack so that the outer rule can
 * either use them to get the final subcomponent value or set it depending on
 * the context.
 */
// indices: expression (',' expression)*
CompilingVisitor.prototype.visitIndices = function(tree) {
    var count = tree.getSize() - 1;  // skip the last index
    const iterator = tree.getIterator();
    while (count--) {
        // the VM places a new empty arguments list on the component stack
        this.builder.insertInvokeInstruction('$list', 0);  // list()

        // the VM places the value of the next index onto the top of the component stack
        iterator.getNext().acceptVisitor(this);

        // the VM adds the index to the arguments list as its only item
        this.builder.insertInvokeInstruction('$addItem', 2);  // addItem(arguments, item)

        // the VM retrieves the value of the subcomponent at the given index of the parent component
        this.builder.insertSendInstruction('$getSubcomponent', 'TO COMPONENT WITH ARGUMENTS');
        // the parent and index have been replaced by the value of the subcomponent
    }

    // the VM places the value of the last index onto the top of the component stack
    iterator.getNext().acceptVisitor(this);

    // the parent component and index of the last subcomponent are on top of the component stack
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the arithmetic,
 * geometric, or complex inverse of the value.
 */
// inversionExpression: ('-' | '/' | '*') expression
CompilingVisitor.prototype.visitInversionExpression = function(tree) {
    const operand = tree.getItem(1);

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);

    // the VM leaves the result of the inversion of the value on top of the component stack
    const operator = tree.operator;
    switch (operator) {
        case '-':
            // take the additive inverse of the value on top of the component stack
            this.builder.insertInvokeInstruction('$inverse', 1);  // inverse(x)
            break;
        case '/':
            // take the multiplicative inverse of the value on top of the component stack
            this.builder.insertInvokeInstruction('$reciprocal', 1);  // reciprocal(x)
            break;
        case '*':
            // take the complex conjugate of the value on top of the component stack
            this.builder.insertInvokeInstruction('$conjugate', 1);  // conjugate(x)
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

    // the VM places the value of the first expression on top of the component stack
    firstOperand.acceptVisitor(this);

    // the VM places the value of the second expression on top of the component stack
    secondOperand.acceptVisitor(this);

    // the VM leaves the result of the logical operation on the values on top of the component stack
    const operator = tree.operator;
    switch (operator) {
        case 'AND':
            // find the logical AND of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$and', 2);  // and(p, q)
            break;
        case 'SANS':
            // find the logical SANS of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$sans', 2);  // sans(p, q)
            break;
        case 'OR':
            // find the logical OR of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$or', 2);  // or(p, q)
            break;
        case 'XOR':
            // find the logical XOR of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$xor', 2);  // xor(p, q)
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

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);

    // the VM replaces the value on top of the component stack with its magnitude
    this.builder.insertSendInstruction('$getMagnitude', 'TO COMPONENT');
    // the value has been replaced by its magnitude
};


/*
 * This method inserts instructions that cause the VM to execute the
 * procedure associated with the specified message for the value of the
 * expression, first placing the arguments on the component stack in
 * a list. If the value of the expression is a name, the message and
 * its arguments are placed in a queue to be sent to the named document
 * in a separate process. Otherwise, the result of the executed procedure
 * is placed on the stack.
 */
// messageExpression: expression ('.' | '<-') message '(' arguments ')'
CompilingVisitor.prototype.visitMessageExpression = function(tree) {
    const target = tree.getItem(1);
    const recipient = (tree.operator === '.') ? 'TO COMPONENT' : 'TO DOCUMENT';
    const message = tree.getItem(2);
    const args = tree.getItem(3);
    const numberOfArguments = args.getSize();

    // the VM places the value of the target expression onto the top of the component stack
    target.acceptVisitor(this);

    // extract the message name
    const messageName = '$' + message.toString();

    // if there are arguments then compile accordingly
    if (numberOfArguments > 0) {
        // the VM places an empty list on top of the component stack
        this.builder.insertInvokeInstruction('$list', 0);  // list()

        // the VM places adds each argument to the list on top of the component stack
        const iterator = args.getIterator();
        while (iterator.hasNext()) {
            var argument = iterator.getNext();
            argument.acceptVisitor(this);
            this.builder.insertInvokeInstruction('$addItem', 2);  // addItem(list, argument)
        }

        // the VM sends the message including a list of arguments to the recipient
        this.builder.insertSendInstruction(messageName, recipient + ' WITH ARGUMENTS');
    } else {
        // the VM sends the message to the recipient
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
        // the VM creates a new catalog on the component stack to hold the parameters
        this.builder.insertInvokeInstruction('$catalog', 0);  // catalog()

        // the VM places each parameter on the component stack and then adds them to the catalog
        this.depth++;
        const keys = Object.keys(parameters);
        keys.forEach(function(key) {
            this.builder.insertPushInstruction('LITERAL', key);
            const value = parameters[key];
            value.acceptVisitor(this);
            this.builder.insertInvokeInstruction('$setValue', 3);  // setValue(catalog, key, value)
        }, this);
        this.depth--;
        // the parameter list remains on the component stack
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
 * message expression and then place the resulting message on a message
 * queue in the Bali Nebula™. The reference to the message
 * queue is another expression that the VM evaluates as well.
 */
// postClause: 'post' expression 'on' expression
CompilingVisitor.prototype.visitPostClause = function(tree) {
    const message = tree.getItem(1);
    const reference = tree.getItem(2);

    // the VM stores the reference to the queue in a temporary variable
    reference.acceptVisitor(this);
    const queue = this.createTemporaryVariable('queue');
    this.builder.insertStoreInstruction('VARIABLE', queue);

    // the VM stores the message on the message queue
    message.acceptVisitor(this);
    this.builder.insertStoreInstruction('MESSAGE', queue);
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
    // the VM places the procedure on top of the component stack
    const literal = procedure.toBDN();
    this.builder.insertPushInstruction('LITERAL', literal);
};


/*
 * This method inserts the instructions that cause the VM to evaluate an
 * expression and then publish the resulting value that is on top of the
 * component stack to the global event queue in the Bali Nebula™.
 */
// publishClause: 'publish' expression
CompilingVisitor.prototype.visitPublishClause = function(tree) {
    const event = tree.getItem(1);

    // the VM places the value of the event expression onto the top of the component stack
    event.acceptVisitor(this);

    // the VM stores the event on the event queue
    this.builder.insertStoreInstruction('MESSAGE', '$$eventQueue');
};


// reference: RESOURCE
CompilingVisitor.prototype.visitReference = function(reference) {
    this.visitElement(reference);
};


// reserved: RESERVED
CompilingVisitor.prototype.visitReserved = function(reserved) {
    this.visitElement(reserved);
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

        // the VM places the value of the result expression on top of the component stack
        result.acceptVisitor(this);
    } else {
        // the VM places a 'none' value on top of the component stack
        this.builder.insertPushInstruction('LITERAL', 'none');
    }

    // the VM returns the result to the calling procedure
    this.builder.insertHandleInstruction('RESULT');
    this.builder.requiresFinalization = false;
};


/*
 * This method inserts the instructions that cause the VM to evaluate an
 * expression and then store the resulting component that is on top of
 * the component stack persistently in the Bali Nebula™. The
 * reference to the document location is another expression that the VM
 * evaluates as well.
 */
// saveClause: 'save' expression 'to' expression
CompilingVisitor.prototype.visitSaveClause = function(tree) {
    const draft = tree.getItem(1);
    const reference = tree.getItem(2);

    // the VM stores the value of the reference to the location into a temporary variable
    reference.acceptVisitor(this);
    const location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM loads the value of the draft onto the top of the component stack
    draft.acceptVisitor(this);

    // the VM stores the document on top of the component stack into the remote location
    this.builder.insertStoreInstruction('DRAFT', location);
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
    this.builder.insertStoreInstruction('VARIABLE', selectorVariable);

    // check each option
    const list = bali.list(array);
    const iterator = list.getIterator();
    while (iterator.hasNext()) {
        var option = iterator.getNext();
        var block = iterator.getNext();
        clausePrefix = this.builder.getClausePrefix();
        var optionLabel = clausePrefix + 'OptionClause';
        this.builder.insertLabel(optionLabel);

        // the VM loads the selector value onto the top of the componencomponent stack
        this.builder.insertLoadInstruction('VARIABLE', selectorVariable);

        // the VM places the option value on top of the component stack
        option.acceptVisitor(this);

        // the VM checks to see if the selector and option match and places the result on the component stack
        this.builder.insertInvokeInstruction('$doesMatch', 2);  // matches(selector, option)

        // determine what the next label will be
        var nextLabel = this.builder.getNextClausePrefix();
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
        clausePrefix = this.builder.getClausePrefix();
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
    this.depth++;
    const iterator = statements.getIterator();
    while (iterator.hasNext()) {
        this.builder.requiresFinalization = true;
        var statement = iterator.getNext();
        statement.acceptVisitor(this);
        this.builder.incrementStatementCount();
    }
    this.depth--;

    // throw away the current compiler procedure context in the instruction builder
    this.builder.popProcedureContext();
};


/*
 * This method inserts instructions that cause the VM to attempt to execute
 * a main clause and then if any exceptions are thrown attempts to handle
 * them using a sequence of handle clauses.
 */
// statement: mainClause handleClause*
CompilingVisitor.prototype.visitStatement = function(tree) {
    // initialize the context for this statement
    const statement = this.builder.pushStatementContext(tree);
    this.builder.insertLabel(statement.startLabel);

    // the VM pushes any exception handlers onto the exception handler stack
    if (this.builder.hasHandlers()) {
        this.builder.insertPushInstruction('HANDLER', statement.handlerLabel);
    }

    // the VM attempts to execute the main clause
    statement.mainClause.acceptVisitor(this);

    // the VM made it through the main clause without any exceptions
    if (this.builder.hasClauses()) {
        // need a label for subclauses to jump to when done
        this.builder.insertLabel(statement.doneLabel);

        if (this.builder.hasHandlers()) {
            // the exception handlers are no longer needed
            this.builder.insertPopInstruction('HANDLER');

            // jump over the exception handlers
            this.builder.insertJumpInstruction(statement.successLabel);

            // the VM will direct any exceptions from the main clause here to be handled
            this.builder.insertLabel(statement.handlerLabel);

            // the VM tries each handler for the exception
            const handlers = statement.handleClauses;
            handlers.forEach(function(handler) {
                handler.acceptVisitor(this);
            }, this);

            // none of the exception handlers matched so the VM must try the parent handlers
            this.builder.insertLabel(statement.failureLabel);
            this.builder.insertHandleInstruction('EXCEPTION');

            // the VM encountered no exceptions or was able to handle them
            this.builder.insertLabel(statement.successLabel);
        }
    }

    // the VM moves on to the next statement
    this.builder.popStatementContext();
};


// TODO: added this from FormattingVisitor do we need it?
// subcomponent: variable '[' indices ']'
CompilingVisitor.prototype.visitSubcomponent = function(tree) {
    const variable = tree.getItem(1);
    variable.acceptVisitor(this);
    const indices = tree.getItem(2);
    indices.acceptVisitor(this);
};


/*
 * This method inserts the instructions that cause the VM to replace
 * the value of an expression that is on top of the component stack
 * with its subcomponent referred to by the indices.
 */
// subcomponentExpression: expression '[' indices ']'
CompilingVisitor.prototype.visitSubcomponentExpression = function(tree) {
    const component = tree.getItem(1);
    const indices = tree.getItem(2);

    // the VM places the value of the expression on top of the component stack
    component.acceptVisitor(this);

    // the VM replaces the value on the component stack with the parent and index of the subcomponent
    indices.acceptVisitor(this);

    // the VM saves off the index for after the list is created
    const index = this.createTemporaryVariable('index');
    this.builder.insertStoreInstruction('VARIABLE', index);

    // the VM places a new empty arguments list on the component stack
    this.builder.insertInvokeInstruction('$list', 0);  // list()

    // the VM adds the index to the arguments list as its only item
    this.builder.insertLoadInstruction('VARIABLE', index);
    this.builder.insertInvokeInstruction('$addItem', 2);  // addItem(arguments, index)

    // the VM retrieves the value of the subcomponent at the given index of the parent component
    this.builder.insertSendInstruction('$getSubcomponent', 'TO COMPONENT WITH ARGUMENTS');
    // the parent and index have been replaced by the value of the subcomponent
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
    this.builder.insertHandleInstruction('EXCEPTION');
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
    if (this.builder.parameters.containsItem(variable)) {
        this.builder.insertPushInstruction('PARAMETER', variable);
    } else if (this.builder.constants.getValue(variable)) {
        this.builder.insertPushInstruction('CONSTANT', variable);
    } else {
        this.builder.insertLoadInstruction('VARIABLE', variable);
        this.builder.variables.addItem(variable);
    }
};


// version: VERSION
CompilingVisitor.prototype.visitVersion = function(version) {
    this.visitElement(version);
};


/*
 * This method compiles the instructions needed to wait for a message from a
 * queue in the Bali Nebula™. The resulting message is assigned
 * to a recipient. The recipient may be either a variable or an indexed child
 * of a collection component.
 */
// waitClause: 'wait' 'for' recipient 'from' expression
CompilingVisitor.prototype.visitWaitClause = function(tree) {
    const recipient = tree.getItem(1);
    const reference = tree.getItem(2);

    // the VM processes the recipient as needed
    recipient.acceptVisitor(this);

    // the VM places the value of the reference to the queue
    // on top of the component stack
    reference.acceptVisitor(this);

    // the VM stores the value of the reference to the queue into a temporary variable
    const queue = this.createTemporaryVariable('queue');
    this.builder.insertStoreInstruction('VARIABLE', queue);

    // the VM loads the next message from the remote queue onto the top of the component stack
    // NOTE: this call blocks until a message is available on the queue
    this.builder.insertLoadInstruction('MESSAGE', queue);

    // the VM sets the value of the recipient to the value on the top of the component stack
    this.setRecipient(recipient);
};


/*
 * This method inserts instructions that cause the VM to repeatedly execute a procedure
 * block while a condition expression is true.
 */
// whileClause: 'while' expression 'do' block
CompilingVisitor.prototype.visitWhileClause = function(tree) {
    const condition = tree.getItem(1);
    const block = tree.getItem(2);
    const clausePrefix = this.builder.getClausePrefix();

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
    const clausePrefix = this.builder.getClausePrefix();

    // construct the loop and done labels
    const statement = this.builder.getStatementContext();
    statement.loopLabel = clausePrefix + 'ConditionClause';

    // the VM places the value of the sequence expression onto the top of the component stack
    sequence.acceptVisitor(this);

    // the VM replaces the sequence on the component stack with an iterator to it
    this.builder.insertSendInstruction('$getIterator', 'TO COMPONENT');

    // The VM stores the iterater in a temporary variable
    const iterator = this.createTemporaryVariable('iterator');
    this.builder.insertStoreInstruction('VARIABLE', iterator);

    // label the start of the loop
    this.builder.insertLabel(statement.loopLabel);

    // the VM jumps past the end of the loop if the iterator has no more items
    this.builder.insertLoadInstruction('VARIABLE', iterator);
    this.builder.insertSendInstruction('$hasNext', 'TO COMPONENT');
    this.builder.insertJumpInstruction(statement.doneLabel, 'ON FALSE');

    // the VM places the iterator back onto the component stack
    this.builder.insertLoadInstruction('VARIABLE', iterator);

    // the VM replaces the iterator on the component stack with the next item from the sequence
    this.builder.insertSendInstruction('$getNext', 'TO COMPONENT');

    // the VM stores the item that is on top of the component stack in the variable
    this.builder.insertStoreInstruction('VARIABLE', variable);

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
    return '$$' + name + '-' + this.temporaryVariableCount++;
};


/*
 * This method inserts instructions that cause the VM to either set
 * the value of a variable or a subcomponent to the value on the top of the
 * component stack.
 */
CompilingVisitor.prototype.setRecipient = function(recipient) {
    if (recipient.isType('/bali/elements/Symbol')) {
        // the VM stores the value that is on top of the component stack in the variable
        const symbol = recipient.toString();
        this.builder.insertStoreInstruction('VARIABLE', symbol);
    } else {
        // the VM saves off the index for after the arguments list is created
        const index = this.createTemporaryVariable('index');
        this.builder.insertStoreInstruction('VARIABLE', index);

        // the VM places a new empty arguments list on the component stack
        this.builder.insertInvokeInstruction('$list', 0);  // list()

        // the VM adds the index to the arguments list as its only item
        this.builder.insertLoadInstruction('VARIABLE', index);
        this.builder.insertInvokeInstruction('$addItem', 2);  // addItem(arguments, index)

        // the VM sets the value of the subcomponent at the given index of the parent component
        this.builder.insertSendInstruction('$setSubcomponent', 'TO COMPONENT WITH ARGUMENTS');
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
 * This function returns the subclauses of a statement in an array.
 *
 * @param {Object} statement The statement containing zero or more subclauses.
 * @returns {Array} An array containing the subclauses for the statement.
 */
function getSubclauses(statement) {
    const subClauses = [];
    const iterator = statement.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        if (item.isType('/bali/composites/Block')) {
            subClauses.push(item);
        }
    }
    return subClauses;
}


// PRIVATE BUILDER CLASS

/*
 * This helper class is used to construct the Bali assembly code. It
 * maintains a stack of procedure context objects that track the current statement
 * number and clause number within each procedure.  A prefix is a dot separated
 * sequence of positive numbers defining alternately the statement number and
 * clause number.  For example, a prefix of '2.3.4.' would correspond to the
 * fourth statement in the third clause of the second statement in the main procedure.
 */
function InstructionBuilder(type, procedure, debug) {
    this.debug = debug || false;
    this.literals = type.getValue('$literals');
    this.constants = type.getValue('$constants');
    this.parameters = procedure.getValue('$parameters');
    this.variables = procedure.getValue('$variables');
    this.messages = procedure.getValue('$messages');
    this.addresses = procedure.getValue('$addresses');
    this.address = 1;  // cardinal based addressing
    this.stack = [];  // stack of procedure contexts
    this.instructions = '';
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
            prefix: parent.prefix + parent.statementNumber + '.' + parent.statement.clauseNumber + '.'
        });
        parent.statement.clauseNumber++;
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
    const subClauses = getSubclauses(mainClause);
    const handleClauses = tree.toArray().slice(1);
    const clauseCount = subClauses.length + handleClauses.length;
    const procedure = this.stack.peek();
    procedure.statement = {
        mainClause: mainClause,
        subClauses: subClauses,
        handleClauses: handleClauses,
        clauseCount: clauseCount,
        clauseNumber: 1
    };

    // initialize the procedure configuration for this statement
    const statement = procedure.statement;
    const type = statement.mainClause.getType().split('/')[3].slice(0, -6);  // remove '/bali/composites/' and 'Clause'
    const prefix = procedure.prefix + procedure.statementNumber + '.';
    statement.startLabel = prefix + type + 'Statement';
    if (statement.clauseCount > 0) {
        statement.doneLabel = prefix + type + 'StatementDone';
    }
    if (statement.handleClauses.length > 0) {
        statement.handlerLabel = prefix + type + 'StatementHandlers';
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
InstructionBuilder.prototype.hasClauses = function() {
    const statement = this.stack.peek().statement;
    return statement.clauseCount > 0;
};


/*
 * This method determines whether or not the current statement contains handlers.
 */
InstructionBuilder.prototype.hasHandlers = function() {
    const statement = this.stack.peek().statement;
    return statement.handleClauses.length > 0;
};


/*
 * This method returns the number of the current clause within its procedure context. For
 * example a 'then' clause within an 'if then else' statement would be the first clause
 * and the 'else' clause would be the second clause. Exception clauses and final clauses
 * are also included in the numbering.
 */
InstructionBuilder.prototype.getClauseNumber = function() {
    const procedure = this.stack.peek();
    const number = procedure.statement.clauseNumber;
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
    const type = statement.mainClause.getType().split('/')[3].slice(0, -6);  // remove '/bali/composites/' and 'Clause'
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
InstructionBuilder.prototype.getClausePrefix = function() {
    const procedure = this.stack.peek();
    const prefix = procedure.prefix + procedure.statementNumber + '.' + procedure.statement.clauseNumber + '.';
    return prefix;
};


/*
 * This method returns the label prefix for the next clause within the current
 * procedure context.
 */
InstructionBuilder.prototype.getNextClausePrefix = function() {
    const procedure = this.stack.peek();
    const prefix = procedure.prefix + procedure.statementNumber + '.' + (procedure.statement.clauseNumber + 1) + '.';
    return prefix;
};


/*
 * This method sets the label to be used for the next instruction. If a label has
 * already been set, then the existing label is used to label a new 'skip'
 * instruction that is inserted.
 */
InstructionBuilder.prototype.insertLabel = function(label) {
    // check for existing label
    if (this.nextLabel) {
        this.insertSkipInstruction();
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
        this.addresses.setValue(this.nextLabel, this.address);
        if (this.instructions !== '') this.instructions += EOL;  // not the first instruction
        this.instructions += this.nextLabel + ':' + EOL;
        this.nextLabel = undefined;
    }
    this.instructions += instruction + EOL;
    this.address++;
};


/*
 * This method inserts a 'skip' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertSkipInstruction = function() {
    const instruction = 'SKIP INSTRUCTION';
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'jump' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertJumpInstruction = function(label, context) {
    var instruction = 'JUMP TO ' + label;
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
            if (!this.literals.containsItem(literal)) this.literals.addItem(literal);
            break;
        case 'CONSTANT':
            instruction += value;
            break;
        case 'PARAMETER':
            instruction += value;
            break;
    }
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'pop' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertPopInstruction = function(type) {
    const instruction = 'POP ' + type;
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
 * This method inserts a 'store' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertStoreInstruction = function(type, symbol) {
    const instruction = 'STORE ' + type + ' ' + symbol;
    this.insertInstruction(instruction);
    this.variables.addItem(symbol);
};


/*
 * This method inserts an 'invoke' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertInvokeInstruction = function(intrinsic, numberOfArguments) {
    var instruction = 'INVOKE ' + intrinsic;
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
 * This method inserts a 'handle' instruction into the assembly code.
 */
InstructionBuilder.prototype.insertHandleInstruction = function(context) {
    const instruction = 'HANDLE ' + context;
    this.insertInstruction(instruction);
};


/*
 * This method finalizes the builder by adding instructions to handle the
 * result if not handled earlier.
 */
InstructionBuilder.prototype.finalize = function() {
    this.insertLoadInstruction('VARIABLE', '$$result');
    this.insertHandleInstruction('RESULT');
};
