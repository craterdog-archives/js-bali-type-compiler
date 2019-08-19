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
 * can run on the Nebula Virtual Processor.
 */
const bali = require('bali-component-framework');
const utilities = require('./utilities');
const EOL = '\n';  // POSIX end of line character


// PUBLIC FUNCTIONS

/**
 * This class implements an assembler that assembles a compiled procedure into the corresponding
 * bytecode to be run on the Nebula Virtual Processor.
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
 * bytecode to be run on the Nebula Virtual Processor.
 * 
 * @param {Catalog} type The type context for the document being compiled and assembled.
 * @param {Catalog} context The compilation context for the procedure being assembled.
 */
Assembler.prototype.assembleProcedure = function(type, context) {

    // assemble the instructions into bytecode
    var instructions = context.getValue('$instructions');
    const parser = new utilities.Parser();
    instructions = parser.parseAssembly(instructions.getValue());
    const visitor = new AssemblingVisitor(type, context);
    instructions.acceptVisitor(visitor);

    // format the bytecode and add to the procedure context
    var bytecode = visitor.getBytecode();
    const base16 = bali.codex.base16Encode(utilities.bytecode.bytecodeToBytes(bytecode), '            ');
    bytecode = bali.parse("'" + base16 + EOL + "            '" + '($encoding: $base16, $mediatype: "application/bcod")');
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
            throw bali.exception({
                $module: '/bali/compiler/Assembler',
                $procedure: '$visitCatalog',
                $exception: '$invalidOperation',
                $expected: bali.range(0, 7),
                $actual: operation,
                $step: step,
                $message: 'An invalid operation was found in a procedure step.'
            });
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
        const label = instruction.getValue('$operand');
        const address = this.addresses.getValue(label);
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
    const modifier = instruction.getValue('$modifier').toNumber();
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
    const word = utilities.bytecode.encodeInstruction(utilities.types.PUSH, modifier, value);
    this.bytecode.push(word);
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
AssemblingVisitor.prototype.visitPopInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const word = utilities.bytecode.encodeInstruction(utilities.types.POP, modifier);
    this.bytecode.push(word);
};


// loadInstruction:
//     'LOAD' 'VARIABLE' variable |
//     'LOAD' 'MESSAGE' variable |
//     'LOAD' 'DRAFT' variable |
//     'LOAD' 'DOCUMENT' variable
AssemblingVisitor.prototype.visitLoadInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.variables.getIndex(symbol);
    const word = utilities.bytecode.encodeInstruction(utilities.types.LOAD, modifier, index);
    this.bytecode.push(word);
};


// storeInstruction:
//     'STORE' 'VARIABLE' variable |
//     'STORE' 'MESSAGE' variable |
//     'STORE' 'DRAFT' variable |
//     'STORE' 'DOCUMENT' variable
AssemblingVisitor.prototype.visitStoreInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.variables.getIndex(symbol);
    const word = utilities.bytecode.encodeInstruction(utilities.types.STORE, modifier, index);
    this.bytecode.push(word);
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
AssemblingVisitor.prototype.visitInvokeInstruction = function(instruction) {
    const count = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = intrinsic(symbol);
    const word = utilities.bytecode.encodeInstruction(utilities.types.INVOKE, count, index);
    this.bytecode.push(word);
};


// executeInstruction:
//     'EXECUTE' SYMBOL |
//     'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
AssemblingVisitor.prototype.visitExecuteInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const symbol = instruction.getValue('$operand');
    const index = this.procedures.getIndex(symbol);
    const word = utilities.bytecode.encodeInstruction(utilities.types.EXECUTE, modifier, index);
    this.bytecode.push(word);
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
AssemblingVisitor.prototype.visitHandleInstruction = function(instruction) {
    const modifier = instruction.getValue('$modifier').toNumber();
    const word = utilities.bytecode.encodeInstruction(utilities.types.HANDLE, modifier);
    this.bytecode.push(word);
};


// INTRINSIC FUNCTION NAMES

const intrinsic = function(symbol) {
    const index = SYMBOLS.indexOf(symbol.toString());
    return index;
};


const SYMBOLS = [
    '<invalid>',
    '$addChild',
    '$addItem',
    '$addItems',
    '$and',
    '$angle',
    '$arccosine',
    '$arcsine',
    '$arctangent',
    '$association',
    '$base2',
    '$base16',
    '$base32',
    '$base64',
    '$binary',
    '$catalog',
    '$complement',
    '$concatenation',
    '$conjugate',
    '$containsAll',
    '$containsAny',
    '$containsItem',
    '$cosine',
    '$default',
    '$deleteAll',
    '$difference',
    '$duration',
    '$earlier',
    '$exponential',
    '$extraction',
    '$factorial',
    '$format',
    '$getAssociationKey',
    '$getAssociationValue',
    '$getAssociations',
    '$getBytes',
    '$getChild',
    '$getDegrees',
    '$getFirst',
    '$getHash',
    '$getHead',
    '$getImaginary',
    '$getIndex',
    '$getItem',
    '$getItems',
    '$getKeys',
    '$getLast',
    '$getLevels',
    '$getMagnitude',
    '$getParameter',
    '$getParameters',
    '$getParent',
    '$getPhase',
    '$getProcedure',
    '$getRadians',
    '$getReal',
    '$getSize',
    '$getTop',
    '$getType',
    '$getValue',
    '$getValues',
    '$insertItem',
    '$insertItems',
    '$inverse',
    '$isEmpty',
    '$isEqualTo',
    '$isInRange',
    '$isInfinite',
    '$isLessThan',
    '$isMatchedBy',
    '$isMoreThan',
    '$isParameterized',
    '$isSameAs',
    '$isUndefined',
    '$isZero',
    '$later',
    '$list',
    '$literal',
    '$logarithm',
    '$moment',
    '$nextVersion',
    '$not',
    '$number',
    '$or',
    '$parameters',
    '$parse',
    '$pattern',
    '$percent',
    '$period',
    '$polar',
    '$probability',
    '$product',
    '$queue',
    '$quotient',
    '$randomBytes',
    '$randomCoinToss',
    '$randomIndex',
    '$randomInteger',
    '$randomProbability',
    '$range',
    '$reciprocal',
    '$rectangular',
    '$reference',
    '$remainder',
    '$removeHead',
    '$removeIndex',
    '$removeItem',
    '$removeItems',
    '$removeRange',
    '$removeTop',
    '$removeValue',
    '$removeValues',
    '$reverseAssociations',
    '$reverseItems',
    '$sans',
    '$scaled',
    '$set',
    '$setAssociationValue',
    '$setItem',
    '$setParameters',
    '$setValue',
    '$setValues',
    '$shuffleItems',
    '$sine',
    '$sortAssociations',
    '$sortItems',
    '$source',
    '$stack',
    '$sum',
    '$supplement',
    '$symbol',
    '$tag',
    '$tangent',
    '$text',
    '$tree',
    '$validNextVersion',
    '$version',
    '$xor'
];
