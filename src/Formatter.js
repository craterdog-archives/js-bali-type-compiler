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
 * This module defines a class that formats a list of instructions into a
 * into the canonical source code string representing the instructions.
 */
const bali = require('bali-component-framework').api();
const types = require('./Types');


// PUBLIC FUNCTIONS

/**
 * This class implements a formatter that formats an instruction list into its
 * corresponding source code in a canonical way.
 *
 * @param {Number} indentation The number of levels of indentation that should be inserted
 * to each formatted line. The default is zero.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Formatter} The new component formatter.
 */
function Formatter(indentation, debug) {
    debug = debug || false;

    // the indentation is a private attribute so methods that use it are defined in the constructor
    indentation = indentation || 0;
    if (typeof indentation !== 'number') {
        const exception = bali.exception({
            $module: '/bali/compiler/Formatter',
            $procedure: '$Formatter',
            $exception: '$invalidParameter',
            $indentation: indentation,
            $message: '"The indentation argument should be the number of levels to indent."'
        });
        if (debug) console.error(exception.toString());
        throw exception;
    }

    this.formatInstructions = function(instructions) {
        const visitor = new FormattingVisitor(indentation, debug);
        instructions.acceptVisitor(visitor);
        return visitor.source;
    };

    return this;
}
Formatter.prototype.constructor = Formatter;
exports.Formatter = Formatter;
exports.formatter = new Formatter();


// PRIVATE CLASSES

const EOL = '\n';  // POSIX end of line character


function FormattingVisitor(indentation, debug) {
    this.debug = debug || false;
    this.indentation = indentation;
    this.source = '';
    for (var i = 0; i < this.indentation; i++) {
        this.source += '    ';
    }
    return this;
}
FormattingVisitor.prototype.constructor = FormattingVisitor;


FormattingVisitor.prototype.appendNewline = function() {
    this.source += EOL;
    for (var i = 0; i < this.indentation; i++) {
        this.source += '    ';
    }
};


FormattingVisitor.prototype.visitCollection = function(collection) {
    if (collection.isType('/bali/collections/List')) {
        this.visitList(collection);
    } else {
        this.visitCatalog(collection);
    }
};


// document: EOL* instructions EOL* EOF
// instructions: (instruction EOL)*
FormattingVisitor.prototype.visitList = function(procedure) {
    const iterator = procedure.getIterator();
    while (iterator.hasNext()) {
        const instruction = iterator.getNext();
        instruction.acceptVisitor(this);
        this.appendNewline();
    }
};


// instruction: label? action
// label: EOL LABEL ':' EOL
FormattingVisitor.prototype.visitCatalog = function(instruction) {
    const label = instruction.getAttribute('$label');
    if (label) {
        this.appendNewline();
        this.source += label.getValue() + ':';
        this.appendNewline();
    }
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
            const exception = bali.exception({
                $module: '/bali/compiler/Formatter',
                $procedure: '$visitCatalog',
                $exception: '$invalidOperation',
                $expected: bali.range(0, 7),
                $actual: operation,
                $instruction: instruction,
                $message: 'An invalid operation was found in a procedure instruction.'
            });
            if (debug) console.error(exception.toString());
            throw exception;
    }
};


// note: COMMENT
FormattingVisitor.prototype.visitNote = function(instruction) {
    const note = instruction.getAttribute('$note');
    this.source += 'NOTE ' + note.getValue();
};


// jump:
//     'JUMP' 'TO' 'NEXT' 'INSTRUCTION' |
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
FormattingVisitor.prototype.visitJump = function(instruction) {
    var modifier = instruction.getAttribute('$modifier');
    if (!modifier) {
        this.source += 'JUMP TO NEXT INSTRUCTION';
    } else {
        this.source += 'JUMP TO ';
        const operand = instruction.getAttribute('$operand').getValue();
        this.source += operand;
        modifier = modifier.toNumber();
        if (modifier !== types.ON_ANY) {
            this.source += ' ';
            this.source += types.jumpModifierString(modifier);
        }
    }
};


// push:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'ARGUMENT' SYMBOL |
FormattingVisitor.prototype.visitPush = function(instruction) {
    this.source += 'PUSH ';
    const modifier = instruction.getAttribute('$modifier').toNumber();
    this.source += types.pushModifierString(modifier);
    this.source += ' ';
    var operand = instruction.getAttribute('$operand');
    switch (modifier) {
        case types.HANDLER:
            operand = operand.getValue();
            break;
        case types.LITERAL:
            operand = '`' + operand.toBDN(this.indentation) + '`';
            break;
        case types.CONSTANT:
        case types.ARGUMENT:
            // leave it as a symbol
            break;
    }
    this.source += operand;
};


// pull:
//     'PULL' 'HANDLER' |
//     'PULL' 'COMPONENT' |
//     'PULL' 'RESULT' |
//     'PULL' 'EXCEPTION'
FormattingVisitor.prototype.visitPull = function(instruction) {
    this.source += 'PULL ';
    const modifier = instruction.getAttribute('$modifier').toNumber();
    this.source += types.pullModifierString(modifier);
};


// load:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
FormattingVisitor.prototype.visitLoad = function(instruction) {
    this.source += 'LOAD ';
    const modifier = instruction.getAttribute('$modifier').toNumber();
    this.source += types.loadModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getAttribute('$operand').toString();
    this.source += operand;
};


// save:
//     'SAVE' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
FormattingVisitor.prototype.visitSave = function(instruction) {
    this.source += 'SAVE ';
    const modifier = instruction.getAttribute('$modifier').toNumber();
    this.source += types.saveModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getAttribute('$operand').toString();
    this.source += operand;
};


// drop:
//     'DROP' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
FormattingVisitor.prototype.visitDrop = function(instruction) {
    this.source += 'DROP ';
    const modifier = instruction.getAttribute('$modifier').toNumber();
    this.source += types.dropModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getAttribute('$operand').toString();
    this.source += operand;
};


// call:
//     'CALL' SYMBOL |
//     'CALL' SYMBOL 'WITH' '1' 'ARGUMENT' |
//     'CALL' SYMBOL 'WITH' NUMBER 'ARGUMENTS'
FormattingVisitor.prototype.visitCall = function(instruction) {
    this.source += 'CALL ';
    this.source += instruction.getAttribute('$operand');
    const modifier = instruction.getAttribute('$modifier').toNumber();
    if (modifier > 0) {
        this.source += ' WITH ';
        this.source += modifier;
        this.source += ' ARGUMENT';
        if (modifier !== 1) this.source += 'S';
    }
};


// send:
//     'SEND' SYMBOL 'TO' 'COMPONENT' |
//     'SEND' SYMBOL 'TO' 'COMPONENT' 'WITH' 'ARGUMENTS' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' 'WITH' 'ARGUMENTS'
FormattingVisitor.prototype.visitSend = function(instruction) {
    this.source += 'SEND ';
    this.source += instruction.getAttribute('$operand');
    const modifier = instruction.getAttribute('$modifier').toNumber();
    this.source += ' ';
    this.source += types.sendModifierString(modifier);
};
