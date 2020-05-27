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
 * This module defines a class that assembles compiled methods into bytecode that
 * can run on the Bali Virtual Machine™.
 */
const Decoder = require('./Decoder').Decoder;
const types = require('./Types');
const Parser = require('./Parser').Parser;
const Formatter = require('./Formatter').Formatter;
const EOL = '\n';  // POSIX end of line character


// PUBLIC FUNCTIONS

/**
 * This class implements an assembler that assembles a compiled method into the corresponding
 * bytecode to be run on the Nebula Virtual Processor.
 *
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Assembler} The new instruction assembler.
 */
function Assembler(debug) {
    this.debug = debug || false;
    this.bali = require('bali-component-framework').api(this.debug);
    this.decoder = new Decoder(this.debug);
    return this;
}
Assembler.prototype.constructor = Assembler;
exports.Assembler = Assembler;
exports.assembler = new Assembler();


/**
 * This method assembles the instructions for a procedure in a compiled method into the
 * corresponding bytecode to be run on the Bali Virtual Machine™.
 *
 * @param {Catalog} type The type context for the method being assembled.
 * @param {Catalog} method The method being assembled.
 */
Assembler.prototype.assembleMethod = function(type, method) {

    // assemble the instructions into bytecode
    var instructions = method.getValue('$instructions');
    const parser = new Parser(this.debug);
    instructions = parser.parseInstructions(instructions.getValue());
    const visitor = new AssemblingVisitor(type, method, this.debug);
    instructions.acceptVisitor(visitor);

    // format the bytecode and add to the method context
    var bytecode = visitor.getBytecode();
    const base16 = this.bali.decoder('        ').base16Encode(this.decoder.bytecodeToBytes(bytecode));
    bytecode = this.bali.component("'" + base16 + EOL + "        '" + '($encoding: $base16, $mediaType: "application/bcod")');
    method.setValue('$bytecode', bytecode);
};


// PRIVATE CLASSES

function AssemblingVisitor(type, method, debug) {
    this.debug = debug || 0;
    this.decoder = new Decoder(this.debug);
    this.intrinsics = require('./Intrinsics').api(this.debug);
    this.literals = type.getValue('$literals');
    this.constants = type.getValue('$constants');
    this.argumentz = method.getValue('$arguments');
    this.variables = method.getValue('$variables');
    this.messages = method.getValue('$messages');
    this.addresses = method.getValue('$addresses');
    this.bytecode = [];
    return this;
}
AssemblingVisitor.prototype.constructor = AssemblingVisitor;


AssemblingVisitor.prototype.getBytecode = function() {
    return this.bytecode;
};


AssemblingVisitor.prototype.visitCollection = function(collection) {
    if (collection.isType('/bali/collections/List')) {
        this.visitList(collection);
    } else {
        this.visitCatalog(collection);
    }
};


// document: EOL* instructions EOL* EOF
// instructions: step (EOL step)*
AssemblingVisitor.prototype.visitList = function(instructions) {
    const iterator = instructions.getIterator();
    while (iterator.hasNext()) {
        var step = iterator.getNext();
        step.acceptVisitor(this);
    }
};


// step: label? instruction
// label: EOL? LABEL ':' EOL
AssemblingVisitor.prototype.visitCatalog = function(step) {
    // can ignore the label at this stage since they don't show up in the bytecode
    const operation = step.getValue('$operation').toNumber();
    switch (operation) {
        case types.NOTE:
            this.visitComment(step);
            break;
        case types.JUMP:
            this.visitJumpInstruction(step);
            break;
        case types.PUSH:
            this.visitPushInstruction(step);
            break;
        case types.PULL:
            this.visitPullInstruction(step);
            break;
        case types.LOAD:
            this.visitLoadInstruction(step);
            break;
        case types.SAVE:
            this.visitSaveInstruction(step);
            break;
        case types.DROP:
            this.visitDropInstruction(step);
            break;
        case types.CALL:
            this.visitCallInstruction(step);
            break;
        case types.SEND:
            this.visitSendInstruction(step);
            break;
        default:
            const exception = this.bali.exception({
                $module: '/bali/compiler/Assembler',
                $procedure: '$visitCatalog',
                $exception: '$invalidOperation',
                $expected: this.bali.range(0, 7),
                $actual: operation,
                $step: step,
                $message: 'An invalid operation was found in a procedure step.'
            });
            if (this.debug) console.error(exception.toString());
            throw exception;
    }
};


// comment: COMMENT
AssemblingVisitor.prototype.visitComment = function(instruction) {
    // ignore comments
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
        word = this.decoder.encodeInstruction(types.SKIP, 0, 0);
    } else {
        modifier = modifier.toNumber();
        const label = instruction.getValue('$operand');
        const address = this.addresses.getValue(label);
        word = this.decoder.encodeInstruction(types.JUMP, modifier, address);
    }
    this.bytecode.push(word);
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'ARGUMENT' SYMBOL
AssemblingVisitor.prototype.visitPushInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    var value = instruction.getValue('$operand');
    switch(modifier) {
        case types.HANDLER:
            value = this.addresses.getValue(value);
            break;
        case types.LITERAL:
            value = this.literals.getIndex(value);
            break;
        case types.CONSTANT:
            value = this.constants.getKeys().getIndex(value);
            break;
        case types.ARGUMENT:
            value = this.argumentz.getIndex(value);
            break;
    }
    const word = this.decoder.encodeInstruction(types.PUSH, modifier, value);
    this.bytecode.push(word);
};


// pullInstruction:
//     'PULL' 'HANDLER' |
//     'PULL' 'COMPONENT' |
//     'PULL' 'RESULT' |
//     'PULL' 'EXCEPTION'
AssemblingVisitor.prototype.visitPullInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const word = this.decoder.encodeInstruction(types.PULL, modifier);
    this.bytecode.push(word);
};


// loadInstruction:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL |
//     'LOAD' 'DRAFT' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL
AssemblingVisitor.prototype.visitLoadInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.variables.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.LOAD, modifier, index);
    this.bytecode.push(word);
};


// saveInstruction:
//     'SAVE' 'VARIABLE' SYMBOL |
//     'SAVE' 'MESSAGE' SYMBOL |
//     'SAVE' 'DRAFT' SYMBOL |
//     'SAVE' 'DOCUMENT' SYMBOL
AssemblingVisitor.prototype.visitSaveInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.variables.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.SAVE, modifier, index);
    this.bytecode.push(word);
};


// dropInstruction:
//     'DROP' 'VARIABLE' SYMBOL |
//     'DROP' 'MESSAGE' SYMBOL |
//     'DROP' 'DRAFT' SYMBOL |
//     'DROP' 'DOCUMENT' SYMBOL
AssemblingVisitor.prototype.visitDropInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.variables.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.DROP, modifier, index);
    this.bytecode.push(word);
};


// callInstruction:
//     'CALL' SYMBOL |
//     'CALL' SYMBOL 'WITH' '1' 'ARGUMENT' |
//     'CALL' SYMBOL 'WITH' NUMBER 'ARGUMENTS'
AssemblingVisitor.prototype.visitCallInstruction = function(instruction) {
    const count = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.intrinsics.index(symbol.toString());
    const word = this.decoder.encodeInstruction(types.CALL, count, index);
    this.bytecode.push(word);
};


// sendInstruction:
//     'SEND' SYMBOL 'TO' 'COMPONENT' |
//     'SEND' SYMBOL 'TO' 'COMPONENT' 'WITH' 'ARGUMENTS' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' 'WITH' 'ARGUMENTS'
AssemblingVisitor.prototype.visitSendInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.messages.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.SEND, modifier, index);
    this.bytecode.push(word);
};
