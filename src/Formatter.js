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
// instructions: (step EOL)*
FormattingVisitor.prototype.visitList = function(procedure) {
    const iterator = procedure.getIterator();
    while (iterator.hasNext()) {
        const step = iterator.getNext();
        step.acceptVisitor(this);
        this.appendNewline();
    }
};


// step: label? instruction
// label: EOL LABEL ':' EOL
FormattingVisitor.prototype.visitCatalog = function(step) {
    const label = step.getValue('$label');
    if (label) {
        this.appendNewline();
        this.source += label.getValue() + ':';
        this.appendNewline();
    }
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
            const exception = bali.exception({
                $module: '/bali/compiler/Formatter',
                $procedure: '$visitCatalog',
                $exception: '$invalidOperation',
                $expected: bali.range(0, 7),
                $actual: operation,
                $step: step,
                $message: 'An invalid operation was found in a procedure step.'
            });
            if (debug) console.error(exception.toString());
            throw exception;
    }
};


// comment: COMMENT
FormattingVisitor.prototype.visitComment = function(instruction) {
    const comment = instruction.getValue('$comment');
    this.source += comment.getValue();
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
FormattingVisitor.prototype.visitJumpInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier');
    if (!modifier) {
        this.source += 'SKIP INSTRUCTION';
    } else {
        this.source += 'JUMP TO ';
        const operand = instruction.getValue('$operand').getValue();
        this.source += operand;
        modifier = modifier.toNumber();
        if (modifier !== types.ON_ANY) {
            this.source += ' ';
            this.source += types.jumpModifierString(modifier);
        }
    }
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'ARGUMENT' SYMBOL |
FormattingVisitor.prototype.visitPushInstruction = function(instruction) {
    this.source += 'PUSH ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.pushModifierString(modifier);
    this.source += ' ';
    var operand = instruction.getValue('$operand');
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


// pullInstruction:
//     'PULL' 'HANDLER' |
//     'PULL' 'COMPONENT' |
//     'PULL' 'RESULT' |
//     'PULL' 'EXCEPTION'
FormattingVisitor.prototype.visitPullInstruction = function(instruction) {
    this.source += 'PULL ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.pullModifierString(modifier);
};


// loadInstruction:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL |
//     'LOAD' 'DRAFT' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL
FormattingVisitor.prototype.visitLoadInstruction = function(instruction) {
    this.source += 'LOAD ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.loadModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getValue('$operand').toString();
    this.source += operand;
};


// saveInstruction:
//     'SAVE' 'VARIABLE' SYMBOL |
//     'SAVE' 'MESSAGE' SYMBOL |
//     'SAVE' 'DRAFT' SYMBOL |
//     'SAVE' 'DOCUMENT' SYMBOL
FormattingVisitor.prototype.visitSaveInstruction = function(instruction) {
    this.source += 'SAVE ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.saveModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getValue('$operand').toString();
    this.source += operand;
};


// dropInstruction:
//     'DROP' 'VARIABLE' SYMBOL |
//     'DROP' 'MESSAGE' SYMBOL |
//     'DROP' 'DRAFT' SYMBOL |
//     'DROP' 'DOCUMENT' SYMBOL
FormattingVisitor.prototype.visitDropInstruction = function(instruction) {
    this.source += 'DROP ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.dropModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getValue('$operand').toString();
    this.source += operand;
};


// callInstruction:
//     'CALL' SYMBOL |
//     'CALL' SYMBOL 'WITH' '1' 'ARGUMENT' |
//     'CALL' SYMBOL 'WITH' NUMBER 'ARGUMENTS'
FormattingVisitor.prototype.visitCallInstruction = function(instruction) {
    this.source += 'CALL ';
    this.source += instruction.getValue('$operand');
    const modifier = instruction.getValue('$modifier').toNumber();
    if (modifier > 0) {
        this.source += ' WITH ';
        this.source += modifier;
        this.source += ' ARGUMENT';
        if (modifier !== 1) this.source += 'S';
    }
};


// sendInstruction:
//     'SEND' SYMBOL 'TO' 'COMPONENT' |
//     'SEND' SYMBOL 'TO' 'COMPONENT' 'WITH' 'ARGUMENTS' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' 'WITH' 'ARGUMENTS'
FormattingVisitor.prototype.visitSendInstruction = function(instruction) {
    this.source += 'SEND ';
    this.source += instruction.getValue('$operand');
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += ' ';
    this.source += types.sendModifierString(modifier);
};
