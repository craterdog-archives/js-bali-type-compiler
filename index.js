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

const bali = require('bali-component-framework');


// EXPORTS

const utilities = require('./src/utilities');
Object.keys(utilities).forEach(function(key) {
    exports[key] = utilities[key];
});

const compiler = require('./src/compiler');
Object.keys(compiler).forEach(function(key) {
    exports[key] = compiler[key];
});

const processor = require('./src/processor');
Object.keys(processor).forEach(function(key) {
    exports[key] = processor[key];
});


// FUNCTIONS

const parse = function(document, debug) {
    const parser = new utilities.Parser(debug);
    return parser.parseDocument(document);
};
exports.parse = parse;

const format = function(instructions, indentation) {
    const formatter = new utilities.Formatter(indentation);
    return formatter.formatInstructions(instructions);
};
exports.format = format;

const compile = function(nebula, citation, debug) {
    return compiler.compile(nebula, citation, debug);
};
exports.compile = compile;

const process = function(nebula, task, debug) {
    return new processor.Processor(nebula, task, debug);
};
exports.process = process;
