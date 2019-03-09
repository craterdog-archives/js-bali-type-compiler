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

const vm = require('./src/vm');
Object.keys(vm).forEach(function(key) {
    exports[key] = vm[key];
});


// FUNCTIONS

/**
 * This function parses a JavaScript string containing Bali Assembly Language™ and
 * returns the corresponding list of Bali Virtual Machine™ instructions. If the
 * <code>debug</code> flag is set, the parser will report possible ambiguities in
 * the input string.
 * 
 * @param {String} document A string containing Bali Assembly Language™ to be parsed.
 * @param {Boolean} debug An optional flag that when set will cause the parser to
 * report possible ambiguities in the input string.
 * @returns {List} The corresponding list of Bali Virtual Machine™ instructions.
 */
const parse = function(document, debug) {
    const parser = new utilities.Parser(debug);
    return parser.parseDocument(document);
};
exports.parse = parse;

/**
 * This function formats a list of Bali Virtual Machine™ instructions into a
 * JavaScript string containing Bali Assembly Language™. An optional indentation
 * level may be specified that causes the formatter to indent each line by that
 * many additional levels.  Each level is four spaces.
 * 
 * @param {List} instructions The list of Bali Virtual Machine™ instructions to be
 * formatted.
 * @param {Number} indentation An optional number of levels to indent the output.
 * @returns {String} The resulting string containing Bali Assembly Language™.
 */
const format = function(instructions, indentation) {
    const formatter = new utilities.Formatter(indentation);
    return formatter.formatInstructions(instructions);
};
exports.format = format;

/**
 * This function compiles a type definition residing in the Bali Nebula™ and returns
 * a document citation to the newly compiled type.  The type definition must be a
 * committed document in the Bali Nebula™.
 * 
 * @param {Object} nebula A JavaScript object that implements the Bali Nebula API™.
 * @param {Catalog} citation A Bali document citation to the type definition.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Catalog} A Bali document citation to the newly compiled type.
 */
const compile = function(nebula, citation, debug) {
    return compiler.compile(nebula, citation, debug);
};
exports.compile = compile;

/**
 * This function creates a new Bali Virtual Machine™ processor to handle the specified
 * task.
 * 
 * @param {Object} nebula A JavaScript object that implements the Bali Nebula API™.
 * @param {Catalog} task A Bali catalog defining the attributes of the task.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Processor} The resulting Bali Virtual Machine™ processor.
 */
const processor = function(nebula, task, debug) {
    return new vm.Processor(nebula, task, debug);
};
exports.processor = processor;
