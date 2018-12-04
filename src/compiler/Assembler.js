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
 * This module defines a class that assembles compiled procedures into bytecode that
 * can run on the Bali Virtual Machine™.
 */
var bali = require('bali-component-framework');
var utilities = require('../utilities');
var EOL = '\n';  // POSIX end of line character


// PUBLIC FUNCTIONS

/**
 * This class implements an assembler that assembles a compiled procedure into the corresponding
 * bytecode to be run on the Bali Virtual Machine™.
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
 * This method assembles the instructions in a compiled procedure into the corresponding
 * bytecode to be run on the Bali Virtual Machine™.
 * 
 * @param {Catalog} type The type context for the document being compiled and assembled.
 * @param {Catalog} context The compilation context for the procedure being assembled.
 */
Assembler.prototype.assembleProcedure = function(type, context) {

    // assemble the instructions into bytecode
    var instructions = context.getValue('$instructions');
    instructions = utilities.parser.parseDocument(instructions.getRawString());
    var visitor = new AssemblingVisitor(type, context);
    instructions.acceptVisitor(visitor);

    // format the bytecode and add to the procedure context
    var bytecode = visitor.getBytecode();
    var base16 = bali.codex.base16Encode(utilities.bytecode.bytecodeToBytes(bytecode), '            ');
    bytecode = bali.parser.parseDocument("'" + base16 + EOL + "            '" + '($base: 16, $mediatype: "application/bcod")');
    context.setValue('$bytecode', bytecode);
};


// PRIVATE CLASSES

function AssemblingVisitor(type, context) {
    this.literals = type.getValue('$literals');
    this.constants = type.getValue('$constants');
    this.parameters = context.getValue('$parameters');
    this.variables = context.getValue('$variables');
    this.procedures = context.getValue('$procedures');
    this.addresses = context.getValue('$addresses');
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
        case utilities.types.JUMP:
            this.visitJumpInstruction(step);
            break;
        case utilities.types.PUSH:
            this.visitPushInstruction(step);
            break;
        case utilities.types.POP:
            this.visitPopInstruction(step);
            break;
        case utilities.types.LOAD:
            this.visitLoadInstruction(step);
            break;
        case utilities.types.STORE:
            this.visitStoreInstruction(step);
            break;
        case utilities.types.INVOKE:
            this.visitInvokeInstruction(step);
            break;
        case utilities.types.EXECUTE:
            this.visitExecuteInstruction(step);
            break;
        case utilities.types.HANDLE:
            this.visitHandleInstruction(step);
            break;
        default:
            throw new Error('ASSEMBLER: An invalid instruction operation was passed: ' + utilities.types.typeString(operation));
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
        word = utilities.bytecode.encodeInstruction(utilities.types.SKIP, 0, 0);
    } else {
        modifier = modifier.toNumber();
        var label = instruction.getValue('$operand');
        var address = this.addresses.getValue(label);
        word = utilities.bytecode.encodeInstruction(utilities.types.JUMP, modifier, address);
    }
    this.bytecode.push(word);
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'PARAMETER' SYMBOL
AssemblingVisitor.prototype.visitPushInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var value = instruction.getValue('$operand');
    switch(modifier) {
        case utilities.types.HANDLER:
            value = this.addresses.getValue(value);
            break;
        case utilities.types.LITERAL:
            value = this.literals.getIndex(value);
            break;
        case utilities.types.CONSTANT:
            value = this.constants.getKeys().getIndex(value);
            break;
        case utilities.types.PARAMETER:
            value = this.parameters.getIndex(value);
            break;
    }
    var word = utilities.bytecode.encodeInstruction(utilities.types.PUSH, modifier, value);
    this.bytecode.push(word);
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
AssemblingVisitor.prototype.visitPopInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var word = utilities.bytecode.encodeInstruction(utilities.types.POP, modifier);
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
    var index = this.variables.getIndex(symbol);
    var word = utilities.bytecode.encodeInstruction(utilities.types.LOAD, modifier, index);
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
    var index = this.variables.getIndex(symbol);
    var word = utilities.bytecode.encodeInstruction(utilities.types.STORE, modifier, index);
    this.bytecode.push(word);
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
AssemblingVisitor.prototype.visitInvokeInstruction = function(instruction) {
    var count = instruction.getValue('$modifier').toNumber();
    var symbol = instruction.getValue('$operand');
    var index = utilities.intrinsics.names.indexOf(symbol.toString());
    var word = utilities.bytecode.encodeInstruction(utilities.types.INVOKE, count, index);
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
    var index = this.procedures.getIndex(symbol);
    var word = utilities.bytecode.encodeInstruction(utilities.types.EXECUTE, modifier, index);
    this.bytecode.push(word);
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
AssemblingVisitor.prototype.visitHandleInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier').toNumber();
    var word = utilities.bytecode.encodeInstruction(utilities.types.HANDLE, modifier);
    this.bytecode.push(word);
};
