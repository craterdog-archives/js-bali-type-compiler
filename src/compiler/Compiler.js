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
 * procedure defined in the document. The bytecode can then be executed on the
 * Bali Virtual Machine™.
 */
var bali = require('bali-component-framework');
var utilities = require('../utilities');
var assembler = require('./Assembler').assembler;


// PUBLIC FUNCTIONS

/**
 * This class implements a compiler that analyzes and compiles a document into a
 * type document containing the bytecode for each of its procedures.
 * 
 * @constructor
 * @returns {Compiler} The new document compiler.
 */
function Compiler() {
    return this;
}
Compiler.prototype.constructor = Compiler;
exports.Compiler = Compiler;
exports.compiler = new Compiler();


/**
 * This method compiles the document that is cited by the specified citation.
 * 
 * @param {Object} nebula A singleton object that implements the Bali Nebula API™.
 * @param {Catalog} citation A citation referencing the document to be compiled.
 * @returns {Catalog} A document citation for the resulting compiled type document.
 */
Compiler.prototype.compileDocument = function(nebula, citation) {
    // retrieve the document
    var document = nebula.retrieveDocument(citation);

    // traverse the ancestry for the document (child -> parent)
    var ancestry = new bali.Stack();
    var parent = document.getValue('$parent');
    while (parent) {
        ancestry.addItem(parent);
        parent = nebula.retrieveDocument(parent).getValue('$parent');
    }

    // extract the procedures for the ancestors (parent -> child)
    var type = new bali.Catalog();
    var iterator = ancestry.getIterator();
    while (iterator.hasNext()) {
        var ancestor = iterator.getNext();
        type.addItems(nebula.retrieveType(ancestor).getValue('$procedures'));
    }

    // compile each procedure defined in the document
    iterator = document.getValue('$procedures').getIterator();
    while (iterator.hasNext()) {

        // retrieve the source code for the procedure
        var association = iterator.getNext();
        var procedureName = association.key.toString();
        var source = association.value.getValue('$source');
        var parameters = source.parameters;
        var procedure = source.procedure;

        // compile the source code
        var instructions = this.compileProcedure(procedure);
        instructions = utilities.parser.parseDocument(instructions);

        // assemble the instructions
        var context = assembler.analyzeInstructions(instructions, parameters);
        var bytecode = assembler.assembleInstructions(instructions, context);

        // format the instructions and add to the context
        var formatter = new utilities.Formatter('    ');
        instructions = bali.parser.parseDocument('"' + EOL + formatter.formatInstructions(instructions) + EOL + '"($mediatype: "application/basm")');
        context.setValue('$intructions', instructions);

        // format the bytecode and add to the context
        var base16 = bali.codex.base16Encode(utilities.bytecode.bytecodeToBytes(bytecode), '            ');
        bytecode = bali.parser.parseDocument("'" + base16 + EOL + "            '" + '($base: 16, $mediatype: "application/bcod")');
        context.setValue('$bytecode', bytecode);

        // record the context for the procedure in the type
        type.setValue(procedureName, context);
    }

    // checkin the newly compiled type
    var typeCitation = nebula.commitType(citation, type);

    return typeCitation;
};
        

/**
 * This function traverses a parse tree structure containing a Bali procedure
 * generating the corresponding assembly instructions for the Bali Virtual
 * Machine™.
 * 
 * @param {List} procedure The parse tree structure for the procedure.
 * @returns {String} The assembly code instructions.
 */
Compiler.prototype.compileProcedure = function(procedure) {
    var visitor = new CompilingVisitor();
    procedure.acceptVisitor(visitor);
    var instructions = visitor.getInstructions();
    return instructions;
};


// PRIVATE FUNCTIONS

var EOL = '\n';  // POSIX end of line character


/*
 * This function defines a missing conversion function for the standard String class.
 */
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

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
function getSubClauses(statement) {
    var subClauses = [];
    var iterator = statement.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        if (item.type === bali.types.BLOCK) {
            subClauses.push(item);
        }
    }
    return subClauses;
}


// PRIVATE CLASSES

/*
 * This private class uses the Visitor Pattern to traverse the syntax tree generated
 * by the parser. It in turn uses another private class, the InstructionBuilder,
 * to construct the corresponding Bali Virtual Machine™ instructions for the syntax
 * tree is it traversing.
 */
function CompilingVisitor() {
    bali.Visitor.call(this);
    this.builder = new InstructionBuilder();
    this.temporaryVariableCount = 1;
    return this;
}
CompilingVisitor.prototype = Object.create(bali.Visitor.prototype);
CompilingVisitor.prototype.constructor = CompilingVisitor;


/**
 * This method returns the resulting assembly instructions for the compiled procedure.
 * 
 * @returns {String}
 */
CompilingVisitor.prototype.getInstructions = function() {
    if (this.builder.requiresFinalization) this.builder.finalize();
    return this.builder.asmcode;
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of an arithmetic operation on them.
 */
// arithmeticExpression: expression ('*' | '/' | '//' | '+' | '-') expression
CompilingVisitor.prototype.visitArithmeticExpression = function(tree) {
    var firstOperand = tree.getChild(1);
    var secondOperand = tree.getChild(2);

    // the VM places the result of the first operand expression on top of the component stack
    firstOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM places the result of the second operand expression on top of the component stack
    secondOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    var operator = tree.operator;
    switch (operator) {
        case '*':
            // the VM places the product of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$product', 2);
            break;
        case '/':
            // the VM places the quotient of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$quotient', 2);
            break;
        case '//':
            // the VM places the remainder of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$remainder', 2);
            break;
        case '+':
            // the VM places the sum of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$sum', 2);
            break;
        case '-':
            // the VM places the difference of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$difference', 2);
            break;
    }

    // the resulting value remains on the top of the component stack
};


/*
 *  This method is causes the VM to jump out of the enclosing loop procedure block.
 */
// breakClause: 'break' 'loop'
CompilingVisitor.prototype.visitBreakClause = function(tree) {
    // retrieve the loop label from the parent context
    var procedures = this.builder.procedures;
    var procedure;
    var loopLabel;
    var numberOfProcedures = procedures.length;
    for (var i = 0; i < numberOfProcedures; i++) {
        procedure = procedures[numberOfProcedures - i - 1];  // work backwards
        loopLabel = procedure.statement.loopLabel;
        if (loopLabel) {
            var doneLabel = procedure.statement.doneLabel;
            // the VM jumps out of the enclosing loop
            this.builder.insertJumpInstruction(doneLabel);
            return;
        }
    }
    // there was no matching enclosing loop with that label
    throw new Error('COMPILER: A break statement was found with no enclosing loop.');
};


/*
 * This method constructs a new catalog component and places it on top of the
 * component stack. The catalog contains a sequence of key-value associations.
 * The order in which the associations are listed is maintained by the catalog.
 */
// catalog:
//     association (',' association)* |
//     EOL (association EOL)* |
//     ':' /*empty catalog*/
CompilingVisitor.prototype.visitCatalog = function(catalog) {
    // the VM places an empty catalog on the component stack
    this.builder.insertInvokeInstruction('$catalog', 0);

    // the VM adds each association to the catalog
    this.depth++;
    var iterator = catalog.getIterator();
    while (iterator.hasNext()) {
        var association = iterator.getNext();
        // the VM places the association's key and value onto the top of the component stack
        association.acceptVisitor(this);

        // the VM sets the key in the catalog to the value
        this.builder.insertInvokeInstruction('$setValue', 3);
    }
    this.depth--;

    if (catalog.isParameterized()) {
        // the VM loads the parameters associated with the catalog onto the top of the component stack
        catalog.parameters.acceptVisitor(this);

        // the VM sets the parameters for the catalog
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
    // the catalog remains on the component stack
};


/*
 * This method compiles the instructions needed to checkout from the Bali Nebula™
 * a persistent document and assign it to a recipient. The recipient may be either
 * a variable or an indexed child of a collection component.
 */
// checkoutClause: 'checkout' recipient 'from' expression
CompilingVisitor.prototype.visitCheckoutClause = function(tree) {
    var recipient = tree.getChild(1);
    var reference = tree.getChild(2);

    // the VM processes the recipient as needed
    recipient.acceptVisitor(this);

    // the VM places the value of the reference to the location of the document
    // on top of the component stack
    reference.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');

    // the VM stores the value of the reference to the location into a temporary variable
    var location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM loads the document from the remote location onto the top of the component stack
    this.builder.insertLoadInstruction('DOCUMENT', location);

    // the VM sets the value of the recipient to the value on the top of the component stack
    this.setRecipient(recipient);
};


/*
 * This method inserts the instructions needed to commit to the Bali Nebula™
 * a document that is on top of the component stack. A reference to
 * the location of the persistent document is evaluated by the VM.
 */
// commitClause: 'commit' expression 'to' expression
CompilingVisitor.prototype.visitCommitClause = function(tree) {
    var document = tree.getChild(1);
    var reference = tree.getChild(2);

    // the VM loads the value of the reference to the location of the persistent
    // document onto the top of the component stack
    reference.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');

    // the VM stores the value of the reference to the location into a temporary variable
    var location = this.createTemporaryVariable('location');
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
// comparisonExpression: expression ('<' | '=' | '>' | 'is' | 'matches') expression
CompilingVisitor.prototype.visitComparisonExpression = function(tree) {
    var firstOperand = tree.getChild(1);
    var secondOperand = tree.getChild(2);

    // the VM places the result of the first operand expression on top of the component stack
    firstOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM places the result of the second operand expression on top of the component stack
    secondOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM performs the comparison operation
    var operator = tree.operator;
    switch (operator) {
        case '<':
            // determine whether or not the first value is less than the second value
            this.builder.insertInvokeInstruction('$less', 2);
            break;
        case '=':
            // determine whether or not the first value is equal to the second value
            this.builder.insertInvokeInstruction('$equal', 2);
            break;
        case '>':
            // determine whether or not the first value is more than the second value
            this.builder.insertInvokeInstruction('$more', 2);
            break;
        case 'is':
            // determine whether or not the first value is the same value as the second value
            this.builder.insertInvokeInstruction('$is', 2);
            break;
        case 'matches':
            // determine whether or not the first value matches the second value
            this.builder.insertInvokeInstruction('$matches', 2);
            break;
    }
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the logical
 * complement of the value.
 */
// complementExpression: 'not' expression
CompilingVisitor.prototype.visitComplementExpression = function(tree) {
    var operand = tree.getChild(1);

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asLogical', 'ON TARGET');

    // the VM finds the logical complement of the top value on the component stack
    this.builder.insertInvokeInstruction('$complement', 1);
};


// continueClause: 'continue' 'loop'
/*
 *  This method is causes the VM to jump to the beginning of the enclosing loop procedure block.
 */
CompilingVisitor.prototype.visitContinueClause = function(tree) {
    // retrieve the loop label from the parent context
    var procedures = this.builder.procedures;
    var procedure;
    var loopLabel;
    var numberOfProcedures = procedures.length;
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
    throw new Error('COMPILER: A continue statement was found with no enclosing loop.');
};


/*
 * This method evaluates the first expression and if its 'asBoolean()' value is
 * 'false', replaces it on top of the component stack with the value of the
 * second expression.
 */
// defaultExpression: expression '?' expression
CompilingVisitor.prototype.visitDefaultExpression = function(tree) {
    var proposedValue = tree.getChild(1);
    var defaultValue = tree.getChild(2);

    // the VM places the result of the first expression on top of the component stack
    proposedValue.acceptVisitor(this);

    // the VM stores the value of the proposed expression into a temporary variable
    var value = this.createTemporaryVariable('value');
    this.builder.insertStoreInstruction('VARIABLE', value);

    // the VM loads the value of the proposed expression back onto the component stack
    this.builder.insertLoadInstruction('VARIABLE', value);

    // the VM replaces the proposed value with its boolean value
    this.builder.insertExecuteInstruction('$asBoolean', 'ON TARGET');

    // the VM loads the value of the proposed expression back onto the component stack
    this.builder.insertLoadInstruction('VARIABLE', value);

    // the VM places the value of the second expression on top of the component stack
    defaultValue.acceptVisitor(this);

    // the VM leaves the actual value on the top of the component stack
    this.builder.insertInvokeInstruction('$default', 3);
};


/*
 * This method inserts the instructions that cause the VM to replace the
 * value of the reference expression that is on top of the component stack
 * with the value that it references.
 */
// dereferenceExpression: '@' expression
CompilingVisitor.prototype.visitDereferenceExpression = function(tree) {
    var reference = tree.getChild(1);

    // the VM loads the value of the reference to the location onto the top of the component stack
    reference.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');

    // the VM stores the value of the reference to the location into a temporary variable
    var location = this.createTemporaryVariable('location');
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
    var reference = tree.getChild(1);

    // the VM loads the value of the reference to the location onto the top of the component stack
    reference.acceptVisitor(this);  // reference expression
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');

    // the VM stores the value of the reference to the location into a temporary variable
    var location = this.createTemporaryVariable('location');
    this.builder.insertStoreInstruction('VARIABLE', location);

    // the VM stores no document into the remote location
    this.builder.insertPushInstruction('ELEMENT', 'none');
    this.builder.insertStoreInstruction('DRAFT', location);
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
    var literal = element.toString();
    this.builder.insertPushInstruction('ELEMENT', literal);

    if (element.isParameterized()) {
        // the VM loads the parameters associated with the element onto the top of the component stack
        element.parameters.acceptVisitor(this);

        // the VM sets the parameters for the element
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
};


/*
 * This method compiles the instructions needed to evaluate an expression and
 * optionally assign the resulting value to a recipient. The recipient may be
 * either a variable or an indexed child of a collection component.
 */
// evaluateClause: (recipient ':=')? expression
CompilingVisitor.prototype.visitEvaluateClause = function(tree) {
    var expression = tree.getChild(-1);

    if (tree.getSize() > 1) {
        // TODO: revisit this as it is currently awkward, it shouldn't require a check
        // the VM processes the recipient as needed
        var recipient = tree.getChild(1);
        if (recipient.type === bali.types.SUBCOMPONENT_EXPRESSION) {
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
    var firstOperand = tree.getChild(1);
    var secondOperand = tree.getChild(2);

    // the VM places the result of the base expression on top of the component stack
    firstOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM places the result of the exponent expression on top of the component stack
    secondOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM leaves the result of raising the base to the exponent on top of the component stack
    this.builder.insertInvokeInstruction('$exponential', 2);
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the mathematical
 * factorial of the value.
 */
// factorialExpression: expression '!'
CompilingVisitor.prototype.visitFactorialExpression = function(tree) {
    var operand = tree.getChild(1);

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM leaves the result of the factorial of the value on top of the component stack
    this.builder.insertInvokeInstruction('$factorial', 1);
};


/*
 * This method inserts instructions that cause the VM to execute the
 * procedure associated with the named function, first placing the parameters
 * on the component stack in a list. The resulting value of the procedure
 * remains on the component stack.
 */
// functionExpression: function parameters
CompilingVisitor.prototype.visitFunctionExpression = function(tree) {
    var functionName = '$' + tree.getChild(1).toString();
    var parameters = tree.getChild(2);

    // make sure the number of parameters is less than 4
    var numberOfParameters = parameters.getSize();
    if (numberOfParameters > 3) {
        throw new Error('COMPILER: The number of function parameters must be less than 4: ' + numberOfParameters);
    }

    // the VM places each parameter on top of the component stack
    this.depth++;
    var iterator = parameters.getIterator();
    while (iterator.hasNext()) {
        var parameter = iterator.getNext();
        if (parameter.constructor.name === 'Association') {
            parameter = parameter.value;  // don't place the 'key' on the component stack
        }
        parameter.acceptVisitor(this);
    }
    this.depth--;

    // the VM replaces the parameters on the component stack with the result of the function
    this.builder.insertInvokeInstruction(functionName, numberOfParameters);

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
    var symbol = tree.getChild(1);
    var template = tree.getChild(2);
    var block = tree.getChild(3);

    // setup the labels
    var statement = this.builder.getStatementContext();
    var clausePrefix = this.builder.getClausePrefix();
    var handleLabel = clausePrefix + 'HandleClause';
    this.builder.insertLabel(handleLabel);

    // the VM stores the exception that is on top of the component stack in the variable
    var exception = symbol.toString();
    this.builder.insertStoreInstruction('VARIABLE', exception);

    // the VM loads the exception back on top of the component stack for the next handler
    this.builder.insertLoadInstruction('VARIABLE', exception);

    // the VM compares the template expression with the actual exception
    this.builder.insertLoadInstruction('VARIABLE', exception);
    template.acceptVisitor(this);
    this.builder.insertInvokeInstruction('$matches', 2);

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
    var doneLabel = this.builder.getStatementContext().doneLabel;
    var elseBlock;
    var clausePrefix;

    // separate out the parts of the statement
    var array = tree.toArray();
    if (array.length % 2 === 1) {
        elseBlock = array.pop();  // remove the else block
    }

    // compile each condition
    var iterator = new bali.Iterator(array);
    while (iterator.hasNext()) {
        var condition = iterator.getNext();
        var block = iterator.getNext();
        clausePrefix = this.builder.getClausePrefix();
        var conditionLabel = clausePrefix + 'ConditionClause';
        this.builder.insertLabel(conditionLabel);

        // the VM places the condition value on top of the component stack
        condition.acceptVisitor(this);
        this.builder.insertExecuteInstruction('$asBoolean', 'ON TARGET');

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
        var elseLabel = clausePrefix + 'ElseClause';
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
// indices: '[' list ']'
CompilingVisitor.prototype.visitIndices = function(tree) {
    // the VM has the component to be indexed on top of the component stack
    var list = tree.getChild(1);
    var size = list.getSize();

    // traverse all but the last index
    for (var i = 1; i < size; i++) {

        // the VM places the value of the next index onto the top of the component stack
        list.getItem(i).acceptVisitor(this);

        // the VM retrieves the value of the subcomponent at the given index of the parent component
        this.builder.insertInvokeInstruction('$getValue', 2);
        // the parent and index have been replaced by the value of the subcomponent
    }

    // the VM places the value of the last index onto the top of the component stack
    list.getItem(size).acceptVisitor(this);

    // the parent component and index of the last subcomponent are on top of the component stack
};


/*
 * This method inserts the instructions that cause the VM to replace the value
 * of the expression that is on top of the component stack with the arithmetic,
 * geometric, or complex inverse of the value.
 */
// inversionExpression: ('-' | '/' | '*') expression
CompilingVisitor.prototype.visitInversionExpression = function(tree) {
    var operand = tree.getChild(1);

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM leaves the result of the inversion of the value on top of the component stack
    var operator = tree.operator;
    switch (operator) {
        case '-':
            // take the additive inverse of the value on top of the component stack
            this.builder.insertInvokeInstruction('$negative', 1);
            break;
        case '/':
            // take the multiplicative inverse of the value on top of the component stack
            this.builder.insertInvokeInstruction('$inverse', 1);
            break;
        case '*':
            // take the complex conjugate of the value on top of the component stack
            this.builder.insertInvokeInstruction('$conjugate', 1);
            break;
    }
};


/*
 * This method constructs a new list component and places it on top of the
 * component stack. The list contains a sequence of values. The order in
 * which the values are listed is maintained by the list.
 */
// list:
//     expression (',' expression)* |
//     EOL (expression EOL)* |
//     /*empty list*/
CompilingVisitor.prototype.visitList = function(list) {
    // the VM replaces the size value on the component stack with a new list of that size
    this.builder.insertInvokeInstruction('$list', 0);

    // the VM adds each expression to the list
    this.depth++;
    var iterator = list.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        item.acceptVisitor(this);
        this.builder.insertInvokeInstruction('$addItem', 2);
    }
    this.depth--;

    if (list.isParameterized()) {
        // the VM loads the parameters associated with the list onto the top of the component stack
        list.parameters.acceptVisitor(this);

        // the VM sets the parameters for the list
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
    // the list remains on the component stack
};


/*
 * This method inserts the instructions that cause the VM to replace the values
 * of two expressions that are on top of the component stack with the resulting
 * value of a logical operation on them.
 */
// logicalExpression: expression ('and' | 'sans' | 'xor' | 'or') expression
CompilingVisitor.prototype.visitLogicalExpression = function(tree) {
    var firstOperand = tree.getChild(1);
    var secondOperand = tree.getChild(2);

    // the VM places the value of the first expression on top of the component stack
    firstOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asLogical', 'ON TARGET');

    // the VM places the value of the second expression on top of the component stack
    secondOperand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asLogical', 'ON TARGET');

    // the VM leaves the result of the logical operation on the values on top of the component stack
    var operator = tree.operator;
    switch (operator) {
        case 'and':
            // find the logical AND of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$and', 2);
            break;
        case 'sans':
            // find the logical SANS of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$sans', 2);
            break;
        case 'xor':
            // find the logical XOR of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$xor', 2);
            break;
        case 'or':
            // find the logical OR of the two values on top of the component stack
            this.builder.insertInvokeInstruction('$or', 2);
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
    var operand = tree.getChild(1);

    // the VM places the value of the expression on top of the component stack
    operand.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asNumeric', 'ON TARGET');

    // the VM leaves the result of the magnitude of the value on top of the component stack
    this.builder.insertInvokeInstruction('$magnitude', 1);
};


/*
 * This method inserts instructions that cause the VM to execute the
 * procedure associated with the named message on the value of an
 * expression, first placing the parameters on the component stack in
 * a list. The resulting value of the procedure remains on the component
 * stack.
 */
// messageExpression: expression '.' message parameters
CompilingVisitor.prototype.visitMessageExpression = function(tree) {
    var target = tree.getChild(1);
    var message = tree.getChild(2);
    var parameters = tree.getChild(3);
    var numberOfParameters = parameters.getSize();

    // the VM places the value of the target expression onto the top of the component stack
    target.acceptVisitor(this);

    // extract the procedure name
    var procedureName = '$' + message.toString();

    // if there are parameters then compile accordingly
    if (numberOfParameters > 0) {
        // the VM places each parameter on top of the component stack
        parameters.acceptVisitor(this);

        // the VM executes the target.<procedure name>(<parameters>) method
        this.builder.insertExecuteInstruction(procedureName, 'ON TARGET WITH PARAMETERS');
    } else {
        // the VM executes the target.<procedure name>() method
        this.builder.insertExecuteInstruction(procedureName, 'ON TARGET');
    }

    // the result of the executed method remains on the component stack
};


// parameters: '(' collection ')'
CompilingVisitor.prototype.visitParameters = function(parameters) {
    // the VM places the collection on the top of the component stack
    this.depth++;
    parameters.collection.acceptVisitor(this);
    this.depth--;

    // the VM places a new parameters component containing the collection on the top of the component stack
    this.builder.insertInvokeInstruction('$parameters', 1);

    // the parameter list remains on the component stack
};


/*
 * This method compiles a sequence of statements by inserting instructions for
 * the VM to follow for each statement. Since procedure blocks can be nested
 * within statement clauses each procedure needs its own compilation context. When
 * entering a procedure a new context is pushed onto the compilation stack and when
 * the procedure is done being compiled, that context is popped back off the stack.
 * NOTE: This stack is different than the runtime component stack that is
 * maintained by the Bali Virtual Machine™.
 */
// procedure:
//     statement (';' statement)*   |
//     EOL (statement EOL)* |
//     /*empty statements*/
CompilingVisitor.prototype.visitProcedure = function(procedure) {
    // create a new compiler procedure context in the instruction builder
    this.builder.pushProcedureContext(procedure);

    // the VM executes each statement
    this.depth++;
    var iterator = procedure.getIterator();
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
 * This method inserts the instructions that cause the VM to evaluate an
 * expression and then publish the resulting value that is on top of the
 * component stack to the global event queue in the Bali Nebula™.
 */
// publishClause: 'publish' expression
CompilingVisitor.prototype.visitPublishClause = function(tree) {
    var event = tree.getChild(1);

    // the VM places the value of the event expression onto the top of the component stack
    event.acceptVisitor(this);

    // the VM stores the event on the event queue
    this.builder.insertStoreInstruction('MESSAGE', '$$eventQueue');
};


/*
 * This method inserts the instructions that cause the VM to evaluate a
 * message expression and then place the resulting message on a message
 * queue in the Bali Nebula™. The reference to the message
 * queue is another expression that the VM evaluates as well.
 */
// queueClause: 'queue' expression 'on' expression
CompilingVisitor.prototype.visitQueueClause = function(tree) {
    var message = tree.getChild(1);
    var reference = tree.getChild(2);

    // the VM stores the reference to the queue in a temporary variable
    reference.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');
    var queue = this.createTemporaryVariable('queue');
    this.builder.insertStoreInstruction('VARIABLE', queue);

    // the VM stores the message on the message queue
    message.acceptVisitor(this);
    this.builder.insertStoreInstruction('MESSAGE', queue);
};


/*
 * This method inserts the instructions that cause the VM to evaluate two
 * expressions and then replace the resulting values that are on the
 * component stack with a range component that has the two values as its
 * starting and ending values.
 */
// range: expression '..' expression
CompilingVisitor.prototype.visitRange = function(range) {
    var firstValue = range.firstItem;
    var lastValue = range.lastItem;

    // the VM places the value of the starting expression on the component stack
    firstValue.acceptVisitor(this);  // first value in the range

    // the VM places the value of the ending expression on the component stack
    lastValue.acceptVisitor(this);  // last value in the range

    // the VM replaces the two range values on the component stack with a new range component
    this.builder.insertInvokeInstruction('$range', 2);

    if (range.isParameterized()) {
        // the VM loads the parameters associated with the range onto the top of the component stack
        range.parameters.acceptVisitor(this);

        // the VM sets the parameters for the range
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
    // the range remains on the component stack
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
        var result = tree.getChild(1);

        // the VM places the value of the result expression on top of the component stack
        result.acceptVisitor(this);
    } else {
        // the VM places a 'none' value on top of the component stack
        this.builder.insertPushInstruction('ELEMENT', 'none');
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
    var draft = tree.getChild(1);
    var reference = tree.getChild(2);

    // the VM stores the value of the reference to the location into a temporary variable
    reference.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');
    var location = this.createTemporaryVariable('location');
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
    var doneLabel = this.builder.getStatementContext().doneLabel;
    var elseBlock;
    var clausePrefix;

    // separate out the parts of the statement
    var array = tree.toArray();
    var selector = array.splice(0, 1)[0];  // remove the selector
    if (array.length % 2 === 1) {
        elseBlock = array.pop();  // remove the else block
    }

    // the VM saves the value of the selector expression in a temporary variable
    selector.acceptVisitor(this);
    var selectorVariable = this.createTemporaryVariable('selector');
    this.builder.insertStoreInstruction('VARIABLE', selectorVariable);

    // check each option
    var iterator = new bali.Iterator(array);
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
        this.builder.insertInvokeInstruction('$matches', 2);

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
        var elseLabel = clausePrefix + 'ElseClause';
        this.builder.insertLabel(elseLabel);
        elseBlock.acceptVisitor(this);
        this.builder.insertLabel(clausePrefix + 'ElseClauseDone');
        this.builder.insertJumpInstruction(doneLabel);
    }
};


/*
 * This method constructs a new set component and places it on top of the
 * component stack. The set contains a sequence of values. The order in
 * which the values are listed is maintained by the set.
 */
// set:
//     expression (',' expression)* |
//     EOL (expression EOL)* |
//     /*empty list*/
CompilingVisitor.prototype.visitSet = function(set) {
    // the VM places the size of the set on the component stack
    var size = set.getSize();
    this.builder.insertPushInstruction('ELEMENT', size);

    // the VM replaces the size value on the component stack with a new set of that size
    this.builder.insertInvokeInstruction('$set', 1);

    // the VM adds each expression to the set
    this.depth++;
    var iterator = set.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        item.acceptVisitor(this);
        this.builder.insertInvokeInstruction('$addItem', 2);
    }
    this.depth--;

    if (set.isParameterized()) {
        // the VM loads the parameters associated with the set onto the top of the component stack
        set.parameters.acceptVisitor(this);

        // the VM sets the parameters for the set
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
    // the set remains on the component stack
};


/*
 * This method compiles a procedure as a component rather than part of a code block.
 * NOTE: the 'source' and 'block' rules have the same syntax but different symantics.
 * A code block gets compiled into the corresponding assembly instructions, but a
 * source code component gets treated as a component on the component stack.
 */
// source: '{' procedure '}'
CompilingVisitor.prototype.visitSource = function(source) {
    // the VM places the source code for the procedure on top of the component stack
    this.builder.insertPushInstruction('SOURCE', source.toString());

    if (source.isParameterized()) {
        // the VM loads the parameters associated with the source code onto the top of the component stack
        source.parameters.acceptVisitor(this);

        // the VM sets the parameters for the source code
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
};


/*
 * This method constructs a new stack component and places it on top of the
 * component stack. The stack contains a sequence of values. The order in
 * which the values are listed is maintained by the stack.
 */
// stack:
//     expression (',' expression)* |
//     EOL (expression EOL)* |
//     /*empty list*/
CompilingVisitor.prototype.visitStack = function(stack) {
    // the VM places the size of the stack on the component stack
    var size = stack.getSize();
    this.builder.insertPushInstruction('ELEMENT', size);

    // the VM replaces the size value on the component stack with a new stack of that size
    this.builder.insertInvokeInstruction('$stack', 1);

    // the VM adds each expression to the stack
    this.depth++;
    var iterator = stack.getIterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        item.acceptVisitor(this);
        this.builder.insertInvokeInstruction('$addItem', 2);
    }
    this.depth--;

    if (stack.isParameterized()) {
        // the VM loads the parameters associated with the stack onto the top of the component stack
        stack.parameters.acceptVisitor(this);

        // the VM sets the parameters for the stack
        this.builder.insertInvokeInstruction('$setParameters', 2);
    }
    // the stack remains on the component stack
};


/*
 * This method inserts instructions that cause the VM to attempt to execute
 * a main clause and then if any exceptions are thrown attempts to handle
 * them using a sequence of handle clauses.
 */
// statement: mainClause handleClause*
CompilingVisitor.prototype.visitStatement = function(tree) {
    // initialize the context for this statement
    var statement = this.builder.pushStatementContext(tree);
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
            var handlers = statement.handleClauses;
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


/*
 * This method inserts the instructions that cause the VM to replace
 * the value of an expression that is on top of the component stack
 * with its subcomponent referred to by the indices.
 */
// subcomponentExpression: expression indices
CompilingVisitor.prototype.visitSubcomponentExpression = function(tree) {
    var component = tree.getChild(1);
    var indices = tree.getChild(2);

    // TODO: replace invoke with execute no matter what

    // the VM places the value of the expression on top of the component stack
    component.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asSequential', 'ON TARGET');

    // the VM replaces the value on the component stack with the parent and index of the subcomponent
    indices.acceptVisitor(this);

    // the VM retrieves the value of the subcomponent at the given index of the parent component
    this.builder.insertInvokeInstruction('$getValue', 2);
    // the value of the subcomponent remains on the component stack
};


/*
 * This method inserts the instructions that cause the VM to evaluate an
 * exception expression and then jumps to the the handle clauses for the
 * current handler context.
 */
// throwClause: 'throw' expression
CompilingVisitor.prototype.visitThrowClause = function(tree) {
    var exception = tree.getChild(1);

    // the VM places the value of the exception expression on top of the component stack
    exception.acceptVisitor(this);

    // the VM jumps to the handler clauses for the current context
    this.builder.insertHandleInstruction('EXCEPTION');
};


/*
 * This method inserts the instructions that cause the VM to place the
 * value of a variable onto the top of the component stack.
 */
// variable: IDENTIFIER
CompilingVisitor.prototype.visitVariable = function(identifier) {
    // the VM loads the value of the variable onto the top of the component stack
    var variable = '$' + identifier.toString();
    this.builder.insertLoadInstruction('VARIABLE', variable);
};


/*
 * This method compiles the instructions needed to wait for a message from a
 * queue in the Bali Nebula™. The resulting message is assigned
 * to a recipient. The recipient may be either a variable or an indexed child
 * of a collection component.
 */
// waitClause: 'wait' 'for' recipient 'from' expression
CompilingVisitor.prototype.visitWaitClause = function(tree) {
    var recipient = tree.getChild(1);
    var reference = tree.getChild(2);

    // the VM processes the recipient as needed
    recipient.acceptVisitor(this);

    // the VM places the value of the reference to the queue
    // on top of the component stack
    reference.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asReference', 'ON TARGET');

    // the VM stores the value of the reference to the queue into a temporary variable
    var queue = this.createTemporaryVariable('queue');
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
    var condition = tree.getChild(1);
    var block = tree.getChild(2);
    var clausePrefix = this.builder.getClausePrefix();

    // construct the loop and done labels
    var statement = this.builder.getStatementContext();
    statement.loopLabel = clausePrefix + 'ConditionClause';

    // label the start of the loop
    this.builder.insertLabel(statement.loopLabel);

    // the VM jumps past the end of the loop if the condition expression evaluates to false
    condition.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asBoolean', 'ON TARGET');
    this.builder.insertJumpInstruction(statement.doneLabel, 'ON FALSE');

    // if the condition is true, then the VM enters the block
    block.acceptVisitor(this);

    // the VM jumps to the top of the loop for the next iteration
    var statementPrefix = this.builder.getStatementPrefix();
    var repeatLabel = statementPrefix + 'ConditionRepeat';
    this.builder.insertLabel(repeatLabel);
    this.builder.insertJumpInstruction(statement.loopLabel);
};


/*
 * This method inserts instructions that cause the VM to execute a procedure block for
 * each item in a collection expression.
 */
// withClause: 'with' ('each' symbol 'in')? expression 'do' block
CompilingVisitor.prototype.visitWithClause = function(tree) {
    var variable = tree.getSize() > 2 ? tree.getChild(1) : this.createTemporaryVariable('item');
    var sequence = tree.getChild(-2);
    var block = tree.getChild(-1);
    var clausePrefix = this.builder.getClausePrefix();

    // construct the loop and done labels
    var statement = this.builder.getStatementContext();
    statement.loopLabel = clausePrefix + 'ConditionClause';

    // the VM places the value of the sequence expression onto the top of the component stack
    sequence.acceptVisitor(this);
    this.builder.insertExecuteInstruction('$asSequential', 'ON TARGET');

    // the VM replaces the sequence on the component stack with an iterator to it
    this.builder.insertExecuteInstruction('$iterator', 'ON TARGET');

    // The VM stores the iterater in a temporary variable
    var iterator = this.createTemporaryVariable('iterator');
    this.builder.insertStoreInstruction('VARIABLE', iterator);

    // label the start of the loop
    this.builder.insertLabel(statement.loopLabel);

    // the VM jumps past the end of the loop if the iterator has no more items
    this.builder.insertLoadInstruction('VARIABLE', iterator);
    this.builder.insertExecuteInstruction('$hasNext', 'ON TARGET');
    this.builder.insertJumpInstruction(statement.doneLabel, 'ON FALSE');

    // the VM places the iterator back onto the component stack
    this.builder.insertLoadInstruction('VARIABLE', iterator);

    // the VM replaces the iterator on the component stack with the next item from the sequence
    this.builder.insertExecuteInstruction('$getNext', 'ON TARGET');

    // the VM stores the item that is on top of the component stack in the variable
    this.builder.insertStoreInstruction('VARIABLE', variable);

    // the VM executes the block using the item if needed
    block.acceptVisitor(this);

    // the VM jumps to the top of the loop for the next iteration
    var statementPrefix = this.builder.getStatementPrefix();
    var repeatLabel = statementPrefix + 'ConditionRepeat';
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
    // TODO: change invoke to execute for a subcomponent

    if (recipient.type === bali.types.SYMBOL) {
        // the VM stores the value that is on top of the component stack in the variable
        var symbol = recipient.toString();
        this.builder.insertStoreInstruction('VARIABLE', symbol);
    } else {
        // the VM sets the value of the subcomponent at the given index of the parent component
        // to the value that is on top of the component stack
        this.builder.insertInvokeInstruction('$setValue', 3);
    }
};


// PRIVATE BUILDER CLASS

/*
 * This helper class is used to construct the Bali assembly source code. It
 * maintains a stack of procedure context objects that track the current statement
 * number and clause number within each procedure.  A prefix is a dot separated
 * sequence of positive numbers defining alternately the statement number and
 * clause number.  For example, a prefix of '2.3.4.' would correspond to the
 * fourth statement in the third clause of the second statement in the main procedure.
 */
function InstructionBuilder() {
    this.asmcode = '';
    this.procedures = [];  // stack of procedure contexts
    return this;
}
InstructionBuilder.prototype.constructor = InstructionBuilder;


/*
 * This method pushes a new procedure context onto the procedure stack and initializes
 * it based on the parent procedure context if one exists.
 */
InstructionBuilder.prototype.pushProcedureContext = function(procedure) {
    var statementCount = procedure.getSize();
    if (this.procedures.length > 0) {
        var parent = this.procedures.peek();
        this.procedures.push({
            statementNumber: 1,
            statementCount: statementCount,
            prefix: parent.prefix + parent.statementNumber + '.' + parent.statement.clauseNumber + '.'
        });
        parent.statement.clauseNumber++;
    } else {
        this.procedures.push({
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
    this.procedures.pop();
};


/*
 * This method pushes a new statement context onto the procedure stack and initializes
 * it.
 */
InstructionBuilder.prototype.pushStatementContext = function(tree) {
    var mainClause = tree.getChild(1);
    var subClauses = getSubClauses(mainClause);
    var handleClauses = tree.toArray().slice(1);
    var clauseCount = subClauses.length + handleClauses.length;
    var procedure = this.procedures.peek();
    procedure.statement = {
        mainClause: mainClause,
        subClauses: subClauses,
        handleClauses: handleClauses,
        clauseCount: clauseCount,
        clauseNumber: 1
    };

    // initialize the procedure configuration for this statement
    var statement = procedure.statement;
    var type = bali.types.typeName(statement.mainClause.type).toTitleCase().slice(0, -6);
    var prefix = procedure.prefix + procedure.statementNumber + '.';
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
    this.procedures.peek().statement = undefined;
};


/*
 * This method determines whether or not the current statement contains clauses.
 */
InstructionBuilder.prototype.hasClauses = function() {
    var statement = this.procedures.peek().statement;
    return statement.clauseCount > 0;
};


/*
 * This method determines whether or not the current statement contains handlers.
 */
InstructionBuilder.prototype.hasHandlers = function() {
    var statement = this.procedures.peek().statement;
    return statement.handleClauses.length > 0;
};


/*
 * This method returns the number of the current clause within its procedure context. For
 * example a 'then' clause within an 'if then else' statement would be the first clause
 * and the 'else' clause would be the second clause. Exception clauses and final clauses
 * are also included in the numbering.
 */
InstructionBuilder.prototype.getClauseNumber = function() {
    var procedure = this.procedures.peek();
    var number = procedure.statement.clauseNumber;
    return number;
};


/*
 * This method returns the number of the current statement within its procedure context. The
 * statements are numbered sequentially starting with the number 1.
 */
InstructionBuilder.prototype.getStatementNumber = function() {
    var procedure = this.procedures.peek();
    var number = procedure.statementNumber;
    return number;
};


/*
 * This method increments by one the statement counter within the current procedure context.
 */
InstructionBuilder.prototype.incrementStatementCount = function() {
    var procedure = this.procedures.peek();
    procedure.statementNumber++;
};


/*
 * This method returns the label prefix for the current instruction within the current
 * procedure context.
 */
InstructionBuilder.prototype.getStatementPrefix = function() {
    var procedure = this.procedures.peek();
    var prefix = procedure.prefix + procedure.statementNumber + '.';
    return prefix;
};


/*
 * This method returns the type of the current statement.
 */
InstructionBuilder.prototype.getStatementType = function() {
    var statement = this.procedures.peek().statement;
    var type = bali.types.typeName(statement.mainClause.type).toTitleCase().slice(0, -6);
    return type;
};


/*
 * This method returns the context for the current statement.
 */
InstructionBuilder.prototype.getStatementContext = function() {
    var statement = this.procedures.peek().statement;
    return statement;
};


/*
 * This method returns the label prefix for the current clause within the current
 * procedure context.
 */
InstructionBuilder.prototype.getClausePrefix = function() {
    var procedure = this.procedures.peek();
    var prefix = procedure.prefix + procedure.statementNumber + '.' + procedure.statement.clauseNumber + '.';
    return prefix;
};


/*
 * This method returns the label prefix for the next clause within the current
 * procedure context.
 */
InstructionBuilder.prototype.getNextClausePrefix = function() {
    var procedure = this.procedures.peek();
    var prefix = procedure.prefix + procedure.statementNumber + '.' + (procedure.statement.clauseNumber + 1) + '.';
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
 * This method inserts into the assembly source code the specified instruction. If
 * a label is pending it is prepended to the instruction.
 */
InstructionBuilder.prototype.insertInstruction = function(instruction) {
    if (this.nextLabel) {
        if (this.asmcode !== '') this.asmcode += EOL;  // not the first instruction
        this.asmcode += this.nextLabel + ':' + EOL;
        this.nextLabel = undefined;
    }
    this.asmcode += instruction + EOL;
};


/*
 * This method inserts a 'skip' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertSkipInstruction = function() {
    var instruction = 'SKIP INSTRUCTION';
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'jump' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertJumpInstruction = function(label, context) {
    var instruction = 'JUMP TO ' + label;
    if (context) instruction += ' ' + context;
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'push' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertPushInstruction = function(type, value) {
    var instruction = 'PUSH ' + type;
    switch (type) {
        case 'HANDLER':
            instruction += ' ' + value;  // value as a label
            break;
        case 'ELEMENT':
        case 'SOURCE':
            instruction += ' `' + value + '`';  // value as a literal
            break;
    }
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'pop' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertPopInstruction = function(type) {
    var instruction = 'POP ' + type;
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'load' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertLoadInstruction = function(type, symbol) {
    var instruction = 'LOAD ' + type + ' ' + symbol;
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'store' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertStoreInstruction = function(type, symbol) {
    var instruction = 'STORE ' + type + ' ' + symbol;
    this.insertInstruction(instruction);
};


/*
 * This method inserts an 'invoke' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertInvokeInstruction = function(intrinsic, numberOfParameters) {
    var instruction = 'INVOKE ' + intrinsic;
    switch (numberOfParameters) {
        case undefined:
        case 0:
            break;
        case 1:
            instruction += ' WITH PARAMETER';
            break;
        default:
            instruction += ' WITH ' + numberOfParameters + ' PARAMETERS';
    }
    this.insertInstruction(instruction);
};


/*
 * This method inserts an 'execute' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertExecuteInstruction = function(method, context) {
    var instruction = 'EXECUTE ' + method;
    if (context) instruction += ' ' + context;
    this.insertInstruction(instruction);
};


/*
 * This method inserts a 'handle' instruction into the assembly source code.
 */
InstructionBuilder.prototype.insertHandleInstruction = function(context) {
    var instruction = 'HANDLE ' + context;
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
