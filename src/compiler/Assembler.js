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
 * This module defines a class that analyzes and assembles a list of instructions
 * that implement a procedure for the Bali Virtual Machine™.
 */
var bali = require('bali-component-framework');
var types = require('../utilities/Types');
var bytecode = require('../utilities/Bytecode');
var intrinsics = require('../utilities/Intrinsics');


// PUBLIC FUNCTIONS

/**
 * This class implements an assembler that analyzes and assembles a list of
 * instructions.
 * 
 * @constructor
 * @returns {Assembler} The new instruction assembler.
 */
function Assembler() {
    return this;
}
Assembler.prototype.constructor = Assembler;
exports.Assembler = Assembler;
exports.assembler = new Assembler();


/**
 * This method traverses a list of assembly instructions that implement a procedure
 * and extracts from it the context of the procedure needed to assemble the instructions.
 * 
 * @param {List} instructions The list of instructions that implement the procedure
 * to be analyzed.
 * @param {Parameters} parameters An optional list of parameters (and default values) that
 * are associated with the procedure. 
 * @returns {Object} context The resulting context.
 */
Assembler.prototype.analyzeInstructions = function(instructions, parameters) {
    var visitor = new AnalyzingVisitor(parameters);
    instructions.acceptVisitor(visitor);
    return visitor.getContext();
};


/**
 * This method traverses a list of Bali assembly instructions and assembles them into
 * their corresponding bytecode instructions.
 * 
 * @param {List} instructions The list of instructions to be assembled into bytecode.
 * @param {Catalog} context The context required by the assembler to generate the bytecode.
 * @returns {Array} An array containing the bytecode instructions.
 */
Assembler.prototype.assembleInstructions = function(instructions, context) {
    var visitor = new AssemblingVisitor(context);
    instructions.acceptVisitor(visitor);
    return visitor.getBytecode();
};


// PRIVATE CLASSES

function AnalyzingVisitor(parameters) {
    this.parameters = new bali.Catalog();
    this.procedures = new bali.Set();
    this.literals = new bali.Set();
    this.variables = new bali.Set();
    this.addresses = new bali.Catalog();
    this.address = 1;  // bali VM unit based addressing
    if (parameters) {
        var collection = parameters.collection;
        if (collection.constructor.name === 'Catalog') {
            this.parameters.addItems(collection);
            this.variables.addItems(collection.getKeys());
        } else {
            var iterator = collection.getIterator();
            while (iterator.hasNext()) {
                var parameter = iterator.getNext();
                this.parameters.setValue(parameter, bali.Filter.NONE);
                this.variables.addItem(parameter);
            }
        }
    }
    return this;
}
AnalyzingVisitor.prototype.constructor = AnalyzingVisitor;


AnalyzingVisitor.prototype.getContext = function() {
    var context = new bali.Catalog();
    context.setValue('$parameters', this.parameters);
    context.setValue('$procedures', this.procedures);
    context.setValue('$literals', this.literals);
    context.setValue('$variables', this.variables);
    context.setValue('$addresses', this.addresses);
    return context;
};


// document: EOL* instructions EOL* EOF
// instructions: step (EOL step)*
AnalyzingVisitor.prototype.visitList = function(instructions) {
    var iterator = instructions.getIterator();
    while (iterator.hasNext()) {
        var step = iterator.getNext();
        step.acceptVisitor(this);
    }
};


// step: label? instruction
// label: EOL? LABEL ':' EOL;
AnalyzingVisitor.prototype.visitCatalog = function(step) {
    var label = step.getValue('$label');
    if (label) {
        var existing = this.addresses.setValue(label, this.address);
        if (existing) {
            throw new Error('ASSEMBLER: A duplicate label was found: ' + label);
        }
    }
    var operation = step.getValue('$operation').toNumber();
    switch (operation) {
        case types.JUMP:
            this.visitJumpInstruction(step);
            break;
        case types.PUSH:
            this.visitPushInstruction(step);
            break;
        case types.POP:
            this.visitPopInstruction(step);
            break;
        case types.LOAD:
            this.visitLoadInstruction(step);
            break;
        case types.STORE:
            this.visitStoreInstruction(step);
            break;
        case types.INVOKE:
            this.visitInvokeInstruction(step);
            break;
        case types.EXECUTE:
            this.visitExecuteInstruction(step);
            break;
        case types.HANDLE:
            this.visitHandleInstruction(step);
            break;
        default:
            throw new Error('ASSEMBLER: An invalid instruction operation was passed: ' + types.typeString(operation));
    }
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
AnalyzingVisitor.prototype.visitJumpInstruction = function(instruction) {
    // we only care about statements with labels, not statements that use labels
    this.address++;
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'ELEMENT' LITERAL |
//     'PUSH' 'SOURCE' LITERAL
AnalyzingVisitor.prototype.visitPushInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    switch (modifier) {
        case types.HANDLER:
            // we only care about statements with labels, not statements that use labels
            break;
        case types.ELEMENT:
        case types.SOURCE:
            var literal = instruction.getValue('$operand');
            this.literals.addItem(literal);
            break;
    }
    this.address++;
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
AnalyzingVisitor.prototype.visitPopInstruction = function(instruction) {
    this.address++;
};


// loadInstruction:
//     'LOAD' 'VARIABLE' variable |
//     'LOAD' 'MESSAGE' variable |
//     'LOAD' 'DRAFT' variable |
//     'LOAD' 'DOCUMENT' variable
AnalyzingVisitor.prototype.visitLoadInstruction = function(instruction) {
    var symbol = instruction.getValue('$operand');
    this.variables.addItem(symbol);
    this.address++;
};


// storeInstruction:
//     'STORE' 'VARIABLE' variable |
//     'STORE' 'MESSAGE' variable |
//     'STORE' 'DRAFT' variable |
//     'STORE' 'DOCUMENT' variable
AnalyzingVisitor.prototype.visitStoreInstruction = function(instruction) {
    var symbol = instruction.getValue('$operand');
    this.variables.addItem(symbol);
    this.address++;
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
AnalyzingVisitor.prototype.visitInvokeInstruction = function(instruction) {
    this.address++;
};


// executeInstruction:
//     'EXECUTE' SYMBOL |
//     'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
AnalyzingVisitor.prototype.visitExecuteInstruction = function(instruction) {
    var symbol = instruction.getValue('$operand');
    this.procedures.addItem(symbol);
    this.address++;
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
AnalyzingVisitor.prototype.visitHandleInstruction = function(instruction) {
    this.address++;
};


function AssemblingVisitor(context) {
    this.context = context;
    this.bytecode = [];
    return this;
}
AssemblingVisitor.prototype.constructor = AssemblingVisitor;


AssemblingVisitor.prototype.getBytecode = function() {
    return this.bytecode;
};


// document: EOL* instructions EOL* EOF
// instructions: step (EOL step)*
AssemblingVisitor.prototype.visitList = function(instructions) {
    var iterator = instructions.getIterator();
    while (iterator.hasNext()) {
        var step = iterator.getNext();
        step.acceptVisitor(this);
    }
};


// step: label? instruction
// label: EOL? LABEL ':' EOL
AssemblingVisitor.prototype.visitCatalog = function(step) {
    // can ignore the label at this stage since they don't show up in the bytecode
    var operation = step.getValue('$operation').toNumber();
    switch (operation) {
        case types.JUMP:
            this.visitJumpInstruction(step);
            break;
        case types.PUSH:
            this.visitPushInstruction(step);
            break;
        case types.POP:
            this.visitPopInstruction(step);
            break;
        case types.LOAD:
            this.visitLoadInstruction(step);
            break;
        case types.STORE:
            this.visitStoreInstruction(step);
            break;
        case types.INVOKE:
            this.visitInvokeInstruction(step);
            break;
        case types.EXECUTE:
            this.visitExecuteInstruction(step);
            break;
        case types.HANDLE:
            this.visitHandleInstruction(step);
            break;
        default:
            throw new Error('ASSEMBLER: An invalid instruction operation was passed: ' + types.typeString(operation));
    }
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
AssemblingVisitor.prototype.visitJumpInstruction = function(instruction) {
    var word;
    var modifier = instruction.getValue('$modifier');
    if (!modifier) {
        word = bytecode.encodeInstruction(types.SKIP, 0, 0);
    } else {
        modifier = modifier.toNumber();
        var label = instruction.getValue('$operand');
        var addresses = this.context.getValue('$addresses');
        var address = addresses.getValue(label);
        word = bytecode.encodeInstruction(types.JUMP, modifier, address);
    }
    this.bytecode.push(word);
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'ELEMENT' LITERAL |
//     'PUSH' 'SOURCE' LITERAL
AssemblingVisitor.prototype.visitPushInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var value = instruction.getValue('$operand');
    switch(modifier) {
        case types.HANDLER:
            var addresses = this.context.getValue('$addresses');
            value = addresses.getValue(value);
            break;
        case types.ELEMENT:
        case types.SOURCE:
            var literals = this.context.getValue('$literals');
            value = literals.getIndex(value);
            break;
    }
    var word = bytecode.encodeInstruction(types.PUSH, modifier, value);
    this.bytecode.push(word);
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
AssemblingVisitor.prototype.visitPopInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var word = bytecode.encodeInstruction(types.POP, modifier);
    this.bytecode.push(word);
};


// loadInstruction:
//     'LOAD' 'VARIABLE' variable |
//     'LOAD' 'MESSAGE' variable |
//     'LOAD' 'DRAFT' variable |
//     'LOAD' 'DOCUMENT' variable
AssemblingVisitor.prototype.visitLoadInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var index = this.context.getValue('$variables').getIndex(symbol);
    var word = bytecode.encodeInstruction(types.LOAD, modifier, index);
    this.bytecode.push(word);
};


// storeInstruction:
//     'STORE' 'VARIABLE' variable |
//     'STORE' 'MESSAGE' variable |
//     'STORE' 'DRAFT' variable |
//     'STORE' 'DOCUMENT' variable
AssemblingVisitor.prototype.visitStoreInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var index = this.context.getValue('$variables').getIndex(symbol);
    var word = bytecode.encodeInstruction(types.STORE, modifier, index);
    this.bytecode.push(word);
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
AssemblingVisitor.prototype.visitInvokeInstruction = function(instruction) {
    var count = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var index = intrinsics.names.indexOf(symbol.toString());
    var word = bytecode.encodeInstruction(types.INVOKE, count, index);
    this.bytecode.push(word);
};


// executeInstruction:
//     'EXECUTE' SYMBOL |
//     'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
AssemblingVisitor.prototype.visitExecuteInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var procedures = this.context.getValue('$procedures');
    var index = procedures.getIndex(symbol);
    var word = bytecode.encodeInstruction(types.EXECUTE, modifier, index);
    this.bytecode.push(word);
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
AssemblingVisitor.prototype.visitHandleInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var word = bytecode.encodeInstruction(types.HANDLE, modifier);
    this.bytecode.push(word);
};
