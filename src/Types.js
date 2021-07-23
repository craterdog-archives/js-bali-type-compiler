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


/*
 * This module captures the type information associated with the parse tree instructions.
 */


// PUBLIC CONSTANTS

exports.NOTE = -1;
exports.JUMP = 0;
exports.PUSH = 1;
exports.PULL = 2;
exports.LOAD = 3;
exports.SAVE = 4;
exports.DROP = 5;
exports.CALL = 6;
exports.SEND = 7;

exports.ON_ANY = 0;
exports.ON_EMPTY = 1;
exports.ON_TRUE = 2;
exports.ON_FALSE = 3;

exports.HANDLER = 0;
exports.LITERAL = 1;
exports.CONSTANT = 2;
exports.ARGUMENT = 3;

exports.COMPONENT = 1;
exports.RESULT = 2;
exports.EXCEPTION = 3;

exports.VARIABLE = 0;
exports.DOCUMENT = 1;
exports.CONTRACT = 2;
exports.MESSAGE = 3;

exports.TO_COMPONENT = 0;
exports.TO_COMPONENT_WITH_ARGUMENTS = 1;
exports.TO_DOCUMENT = 2;
exports.TO_DOCUMENT_WITH_ARGUMENTS = 3;


// PUBLIC FUNCTIONS

exports.operationString = function(value) {
    return OPERATIONS[value];
};

exports.operationValue = function(string) {
    return OPERATIONS.indexOf(string);
};


exports.jumpModifierString = function(value) {
    return JUMP_MODIFIERS[value];
};

exports.jumpModifierValue = function(string) {
    return JUMP_MODIFIERS.indexOf(string);
};


exports.pushModifierString = function(value) {
    return PUSH_MODIFIERS[value];
};

exports.pushModifierValue = function(string) {
    return PUSH_MODIFIERS.indexOf(string);
};


exports.pullModifierString = function(value) {
    return PULL_MODIFIERS[value];
};

exports.pullModifierValue = function(string) {
    return PULL_MODIFIERS.indexOf(string);
};


exports.loadModifierString = function(value) {
    return LOAD_MODIFIERS[value];
};

exports.loadModifierValue = function(string) {
    return LOAD_MODIFIERS.indexOf(string);
};


exports.saveModifierString = function(value) {
    return SAVE_MODIFIERS[value];
};

exports.saveModifierValue = function(string) {
    return SAVE_MODIFIERS.indexOf(string);
};


exports.dropModifierString = function(value) {
    return DROP_MODIFIERS[value];
};

exports.dropModifierValue = function(string) {
    return DROP_MODIFIERS.indexOf(string);
};


exports.sendModifierString = function(value) {
    return SEND_MODIFIERS[value];
};

exports.sendModifierValue = function(string) {
    return SEND_MODIFIERS.indexOf(string);
};


// PRIVATE ATTRIBUTES

const OPERATIONS = [
    'JUMP',
    'PUSH',
    'PULL',
    'LOAD',
    'SAVE',
    'DROP',
    'CALL',
    'SEND'
];

const JUMP_MODIFIERS = [
    'ON ANY',
    'ON EMPTY',
    'ON TRUE',
    'ON FALSE'
];

const PUSH_MODIFIERS = [
    'HANDLER',
    'LITERAL',
    'CONSTANT',
    'ARGUMENT'
];

const PULL_MODIFIERS = [
    'HANDLER',
    'COMPONENT',
    'RESULT',
    'EXCEPTION'
];

const LOAD_MODIFIERS = [
    'VARIABLE',
    'DOCUMENT',
    'CONTRACT',
    'MESSAGE'
];

const SAVE_MODIFIERS = [
    'VARIABLE',
    'DOCUMENT',
    'CONTRACT',
    'MESSAGE'
];

const DROP_MODIFIERS = [
    'VARIABLE',
    'DOCUMENT',
    'CONTRACT',
    'MESSAGE'
];

const SEND_MODIFIERS = [
    'TO COMPONENT',
    'TO COMPONENT WITH ARGUMENTS',
    'TO DOCUMENT',
    'TO DOCUMENT WITH ARGUMENTS'
];
