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

const Compiler = require('./src/Compiler').Compiler;
const Assembler = require('./src/Assembler').Assembler;

exports.bytecode = require('./src/utilities').bytecode;
exports.intrinsics = require('./src/utilities').intrinsics;


/**
 * This function compiles the source code for a procedure into a compilation context
 * containing the corresponding assembly instructions for the Nebula Virtual Processor.
 * 
 * @param {Catalog} type The type context for the document being compiled.
 * @param {Source} procedure The source code for the procedure.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Catalog} The compiled context for the procedure.
 */
exports.compile = function(type, procedure, debug) {
    const compiler = new Compiler(debug);
    const context = compiler.compileProcedure(type, procedure);
    return context;
};


/**
 * This function assembles the instructions in a compiled procedure into the corresponding
 * bytecode to be run on the Nebula Virual Processor.
 * 
 * @param {Catalog} type The type context for the document being compiled and assembled.
 * @param {Catalog} context The compilation context for the procedure being assembled.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 */
exports.assemble = function(type, context, debug) {
    const assembler = new Assembler(debug);
    assembler.assembleProcedure(type, context);
};
