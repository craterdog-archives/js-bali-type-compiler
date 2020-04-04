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

exports.SKIP = 0;
exports.JUMP = 0;
exports.PUSH = 1;
exports.POP = 2;
exports.LOAD = 3;
exports.STORE = 4;
exports.INVOKE = 5;
exports.SEND = 6;
exports.HANDLE = 7;

exports.ON_ANY = 0;
exports.ON_NONE = 1;
exports.ON_TRUE = 2;
exports.ON_FALSE = 3;

exports.HANDLER = 0;
exports.COMPONENT = 1;
exports.LITERAL = 1;
exports.CONSTANT = 2;
exports.PARAMETER = 3;

exports.VARIABLE = 0;
exports.MESSAGE = 1;
exports.DRAFT = 2;
exports.DOCUMENT = 3;

exports.TO_COMPONENT = 0;
exports.TO_COMPONENT_WITH_ARGUMENTS = 1;
exports.TO_DOCUMENT = 2;
exports.TO_DOCUMENT_WITH_ARGUMENTS = 3;

exports.RESULT = 0;
exports.EXCEPTION = 1;


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


exports.popModifierString = function(value) {
    return POP_MODIFIERS[value];
};

exports.popModifierValue = function(string) {
    return POP_MODIFIERS.indexOf(string);
};


exports.loadModifierString = function(value) {
    return LOAD_MODIFIERS[value];
};

exports.loadModifierValue = function(string) {
    return LOAD_MODIFIERS.indexOf(string);
};


exports.storeModifierString = function(value) {
    return STORE_MODIFIERS[value];
};

exports.storeModifierValue = function(string) {
    return STORE_MODIFIERS.indexOf(string);
};


exports.sendModifierString = function(value) {
    return SEND_MODIFIERS[value];
};

exports.sendModifierValue = function(string) {
    return SEND_MODIFIERS.indexOf(string);
};


exports.handleModifierString = function(value) {
    return HANDLE_MODIFIERS[value];
};

exports.handleModifierValue = function(string) {
    return HANDLE_MODIFIERS.indexOf(string);
};


// PRIVATE ATTRIBUTES

const OPERATIONS = [
    'JUMP',
    'PUSH',
    'POP',
    'LOAD',
    'STORE',
    'INVOKE',
    'SEND',
    'HANDLE'
];

const JUMP_MODIFIERS = [
    'ON ANY',
    'ON NONE',
    'ON TRUE',
    'ON FALSE'
];

const PUSH_MODIFIERS = [
    'HANDLER',
    'LITERAL',
    'CONSTANT',
    'PARAMETER'
];

const POP_MODIFIERS = [
    'HANDLER',
    'COMPONENT'
];

const LOAD_MODIFIERS = [
    'VARIABLE',
    'MESSAGE',
    'DRAFT',
    'DOCUMENT'
];

const STORE_MODIFIERS = [
    'VARIABLE',
    'MESSAGE',
    'DRAFT',
    'DOCUMENT'
];

const SEND_MODIFIERS = [
    'TO COMPONENT',
    'TO COMPONENT WITH ARGUMENTS',
    'TO DOCUMENT',
    'TO DOCUMENT WITH ARGUMENTS'
];

const HANDLE_MODIFIERS = [
    'RESULT',
    'EXCEPTION'
];
