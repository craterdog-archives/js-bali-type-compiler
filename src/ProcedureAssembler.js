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
var bali = require('bali-component-framework');
var types = require('./Types');
var bytecode = require('./BytecodeUtilities');
var intrinsics = require('./IntrinsicFunctions');

/**
 * This library provides functions that assemble and disassemble instructions
 * for the Bali Virtual Machine™.
 */


// PUBLIC FUNCTIONS

/**
 * This function traverses a list of Bali assembly instructions and extracts
 * from it a procedure scoped context containing the symbols and literals used
 * in the procedure.
 * 
 * @param {List} procedure The list of instructions that make up the procedure
 * to be analyzed.
 * @returns {Object} context The resulting procedure scoped context.
 */
exports.analyzeProcedure = function(procedure) {
    var visitor = new AnalyzingVisitor();
    procedure.acceptVisitor(visitor);
    return visitor.getContext();
};


/**
 * This function traverses a list of Bali assembly instructions and assembles
 * them into their corresponding bytecode instructions.
 * 
 * @param {List} procedure The list of instructions to be assembled into bytecode.
 * @param {Catalog} context The procedure scoped context for the procedure
 * being assembled.
 * @returns {Component} A binary component containing the resulting bytecode
 * instructions.
 */
exports.assembleProcedure = function(procedure, context) {
    var visitor = new AssemblingVisitor(context);
    procedure.acceptVisitor(visitor);
    return visitor.bytecode;
};


// PRIVATE CLASSES

function AnalyzingVisitor() {
    this.symbols = new bali.Set();
    this.literals = new bali.Set();
    this.parameters = new bali.Set();
    this.variables = new bali.Set();
    this.addresses = new bali.Catalog();
    this.address = 1;  // bali VM unit based addressing
    return this;
}
AnalyzingVisitor.prototype.constructor = AnalyzingVisitor;


AnalyzingVisitor.prototype.getContext = function() {
    var context = new bali.Catalog();
    context.setValue('$symbols', this.symbols);
    context.setValue('$literals', this.literals);
    context.setValue('$parameters', this.parameters);
    context.setValue('$variables', this.variables);
    context.setValue('$addresses', this.addresses);
    return context;
};


// procedure: EOL* step (EOL step)* EOL* EOF
AnalyzingVisitor.prototype.visitList = function(procedure) {
    var iterator = procedure.getIterator();
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
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'PARAMETER' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
AnalyzingVisitor.prototype.visitLoadInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var type;
    switch(modifier) {
        case types.PARAMETER:
            type = 'parameters';
            break;
        case types.VARIABLE:
        case types.DOCUMENT:
        case types.MESSAGE:
            type = 'variables';
            break;
    }
    this[type].addItem(symbol);
    this.address++;
};


// storeInstruction:
//     'STORE' 'VARIABLE' SYMBOL |
//     'STORE' 'DRAFT' SYMBOL |
//     'STORE' 'DOCUMENT' SYMBOL |
//     'STORE' 'MESSAGE' SYMBOL
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
    this.symbols.addItem(symbol);
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


// procedure: EOL* step (EOL step)* EOL* EOF
AssemblingVisitor.prototype.visitList = function(procedure) {
    var iterator = procedure.getIterator();
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
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'PARAMETER' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
AssemblingVisitor.prototype.visitLoadInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var type;
    switch(modifier) {
        case types.PARAMETER:
            type = '$parameters';
            break;
        case types.VARIABLE:
        case types.DOCUMENT:
        case types.MESSAGE:
            type = '$variables';
            break;
    }
    var index = this.context.getValue(type).getIndex(symbol);
    var word = bytecode.encodeInstruction(types.LOAD, modifier, index);
    this.bytecode.push(word);
};


// storeInstruction:
//     'STORE' 'VARIABLE' SYMBOL |
//     'STORE' 'DOCUMENT' SYMBOL |
//     'STORE' 'DRAFT' SYMBOL |
//     'STORE' 'MESSAGE' SYMBOL
AssemblingVisitor.prototype.visitStoreInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var variables = this.context.getValue('$variables');
    var index = variables.getIndex(symbol);
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
    var symbols = this.context.getValue('$symbols');
    var index = symbols.getIndex(symbol);
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
