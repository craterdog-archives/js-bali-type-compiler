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
exports.EXECUTE = 6;
exports.HANDLE = 7;

exports.ON_ANY = 0;
exports.ON_NONE = 1;
exports.ON_TRUE = 2;
exports.ON_FALSE = 3;

exports.HANDLER = 0;
exports.ELEMENT = 1;
exports.COMPONENT = 1;
exports.SOURCE = 2;

exports.VARIABLE = 0;
exports.MESSAGE = 1;
exports.DRAFT = 2;
exports.DOCUMENT = 3;

exports.WITH_NOTHING = 0;
exports.WITH_PARAMETERS = 1;
exports.ON_TARGET = 2;
exports.ON_TARGET_WITH_PARAMETERS = 3;

exports.EXCEPTION = 0;
exports.RESULT = 1;


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


exports.executeModifierString = function(value) {
    return EXECUTE_MODIFIERS[value];
};

exports.executeModifierValue = function(string) {
    return EXECUTE_MODIFIERS.indexOf(string);
};


exports.handleModifierString = function(value) {
    return HANDLE_MODIFIERS[value];
};

exports.handleModifierValue = function(string) {
    return HANDLE_MODIFIERS.indexOf(string);
};


// PRIVATE ATTRIBUTES

var OPERATIONS = [
    'JUMP',
    'PUSH',
    'POP',
    'LOAD',
    'STORE',
    'INVOKE',
    'EXECUTE',
    'HANDLE'
];

var JUMP_MODIFIERS = [
    'ON ANY',
    'ON NONE',
    'ON TRUE',
    'ON FALSE'
];

var PUSH_MODIFIERS = [
    'HANDLER',
    'ELEMENT',
    'SOURCE'
];

var POP_MODIFIERS = [
    'HANDLER',
    'COMPONENT'
];

var LOAD_MODIFIERS = [
    'VARIABLE',
    'MESSAGE',
    'DRAFT',
    'DOCUMENT'
];

var STORE_MODIFIERS = [
    'VARIABLE',
    'MESSAGE',
    'DRAFT',
    'DOCUMENT'
];

var EXECUTE_MODIFIERS = [
    '',
    'WITH PARAMETERS',
    'ON TARGET',
    'ON TARGET WITH PARAMETERS'
];

var HANDLE_MODIFIERS = [
    'EXCEPTION',
    'RESULT'
];
