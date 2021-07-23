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
    var instructions = method.getAttribute('$instructions');
    const parser = new Parser(this.debug);
    instructions = parser.parseInstructions(instructions.getValue());
    const visitor = new AssemblingVisitor(type, method, this.debug);
    instructions.acceptVisitor(visitor);

    // format the bytecode and add to the method context
    var bytecode = visitor.getBytecode();
    const base16 = this.bali.decoder(2).base16Encode(this.decoder.bytecodeToBytes(bytecode));
    bytecode = this.bali.component("'" + base16 + EOL + "        '" + '($encoding: $base16, $mediaType: "application/bcod")');
    method.setAttribute('$bytecode', bytecode);
};


// PRIVATE CLASSES

function AssemblingVisitor(type, method, debug) {
    this.debug = debug || 0;
    this.decoder = new Decoder(this.debug);
    this.intrinsics = require('./Intrinsics').api(this.debug);
    this.literals = type.getAttribute('$literals');
    this.constants = type.getAttribute('$constants');
    this.argumentz = method.getAttribute('$arguments');
    this.variables = method.getAttribute('$variables');
    this.messages = method.getAttribute('$messages');
    this.addresses = method.getAttribute('$addresses');
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
// instructions: (instruction EOL)*
AssemblingVisitor.prototype.visitList = function(instructions) {
    const iterator = instructions.getIterator();
    while (iterator.hasNext()) {
        var instruction = iterator.getNext();
        instruction.acceptVisitor(this);
    }
};


// instruction: label? action
// label: EOL LABEL ':' EOL
AssemblingVisitor.prototype.visitCatalog = function(instruction) {
    // can ignore the label at this stage since they don't show up in the bytecode
    const operation = instruction.getAttribute('$operation').toNumber();
    switch (operation) {
        case types.NOTE:
            this.visitNote(instruction);
            break;
        case types.JUMP:
            this.visitJump(instruction);
            break;
        case types.PUSH:
            this.visitPush(instruction);
            break;
        case types.PULL:
            this.visitPull(instruction);
            break;
        case types.LOAD:
            this.visitLoad(instruction);
            break;
        case types.SAVE:
            this.visitSave(instruction);
            break;
        case types.DROP:
            this.visitDrop(instruction);
            break;
        case types.CALL:
            this.visitCall(instruction);
            break;
        case types.SEND:
            this.visitSend(instruction);
            break;
        default:
            const exception = this.bali.exception({
                $module: '/bali/compiler/Assembler',
                $procedure: '$visitCatalog',
                $exception: '$invalidOperation',
                $expected: this.bali.range(0, 7),
                $actual: operation,
                $instruction: instruction,
                $message: 'An invalid operation was found in a procedure instruction.'
            });
            if (this.debug) console.error(exception.toString());
            throw exception;
    }
};


// note: COMMENT
AssemblingVisitor.prototype.visitNote = function(instruction) {
    // ignore notes
};


// jump:
//     'JUMP' 'TO' 'NEXT' 'INSTRUCTION' |
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'EMPTY' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE'
AssemblingVisitor.prototype.visitJump = function(instruction) {
    var word;
    var modifier = instruction.getAttribute('$modifier');
    if (!modifier) {
        word = this.decoder.encodeInstruction(types.JUMP, 0, 0);  // JUMP TO NEXT INSTRUCTION
    } else {
        modifier = modifier.toNumber();
        const label = instruction.getAttribute('$operand');
        const address = this.addresses.getAttribute(label);
        word = this.decoder.encodeInstruction(types.JUMP, modifier, address);
    }
    this.bytecode.push(word);
};


// push:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'ARGUMENT' SYMBOL
AssemblingVisitor.prototype.visitPush = function(instruction) {
    const modifier = instruction.getAttribute('$modifier').toNumber();
    var value = instruction.getAttribute('$operand');
    switch(modifier) {
        case types.HANDLER:
            value = this.addresses.getAttribute(value);
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


// pull:
//     'PULL' 'HANDLER' |
//     'PULL' 'COMPONENT' |
//     'PULL' 'RESULT' |
//     'PULL' 'EXCEPTION'
AssemblingVisitor.prototype.visitPull = function(instruction) {
    const modifier = instruction.getAttribute('$modifier').toNumber();
    const word = this.decoder.encodeInstruction(types.PULL, modifier);
    this.bytecode.push(word);
};


// load:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
AssemblingVisitor.prototype.visitLoad = function(instruction) {
    const modifier = instruction.getAttribute('$modifier').toNumber();
    const symbol = instruction.getAttribute('$operand');
    const index = this.variables.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.LOAD, modifier, index);
    this.bytecode.push(word);
};


// save:
//     'SAVE' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
AssemblingVisitor.prototype.visitSave = function(instruction) {
    const modifier = instruction.getAttribute('$modifier').toNumber();
    const symbol = instruction.getAttribute('$operand');
    const index = this.variables.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.SAVE, modifier, index);
    this.bytecode.push(word);
};


// drop:
//     'DROP' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
AssemblingVisitor.prototype.visitDrop = function(instruction) {
    const modifier = instruction.getAttribute('$modifier').toNumber();
    const symbol = instruction.getAttribute('$operand');
    const index = this.variables.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.DROP, modifier, index);
    this.bytecode.push(word);
};


// call:
//     'CALL' SYMBOL |
//     'CALL' SYMBOL 'WITH' '1' 'ARGUMENT' |
//     'CALL' SYMBOL 'WITH' NUMBER 'ARGUMENTS'
AssemblingVisitor.prototype.visitCall = function(instruction) {
    const count = instruction.getAttribute('$modifier').toNumber();
    const symbol = instruction.getAttribute('$operand');
    const index = this.intrinsics.index(symbol.toString());
    const word = this.decoder.encodeInstruction(types.CALL, count, index);
    this.bytecode.push(word);
};


// send:
//     'SEND' SYMBOL 'TO' 'COMPONENT' |
//     'SEND' SYMBOL 'TO' 'COMPONENT' 'WITH' 'ARGUMENTS' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' 'WITH' 'ARGUMENTS'
AssemblingVisitor.prototype.visitSend = function(instruction) {
    const modifier = instruction.getAttribute('$modifier').toNumber();
    const symbol = instruction.getAttribute('$operand');
    const index = this.messages.getIndex(symbol);
    const word = this.decoder.encodeInstruction(types.SEND, modifier, index);
    this.bytecode.push(word);
};
