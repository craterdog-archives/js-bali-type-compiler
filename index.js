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
const utilities = require('./src/utilities');


/**
 * This function returns an object that implements the Bali Nebula™ compiler interface.
 * 
 * @param {Object} notary An object that implements the Bali Nebula™ digital notary interface.
 * @param {Object} repository An object that implements the Bali Nebula™ document repository interface.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Object} An object that implements the Bali Nebula™ compiler interface.
 */
exports.api = function(notary, repository, debug) {
    // validate the parameters
    debug = debug || false;

    return {

        /**
         * This function compiles a type definition residing in the Bali Nebula™ and returns
         * a document citation to the newly compiled type.  The type definition must be a
         * committed document in the Bali Nebula™.
         * 
         * @param {Catalog} document A document containing the type definition to be compiled.
         * @returns {Catalog} A catalog containing the newly compiled type.
         */
        compileType: function(document) {
            const compiler = new Compiler(notary, repository, debug);
            const context = compiler.compileType(document);
            return context;
        },

        /**
         * This function compiles the Bali Nebula™ source code for a procedure into a compilation
         * context containing the corresponding Bali Nebula™ machines instructions.
         * 
         * @param {Catalog} type A catalog containing the type context for the procedure being
         * compiled.
         * @param {Source} procedure The source code for the procedure being compiled.
         * @returns {Catalog} A catalog containing the compiled procedure context.
         */
        compileProcedure: function(type, procedure) {
            const compiler = new Compiler(notary, repository, debug);
            const context = compiler.compileProcedure(type, procedure);
            return context;
        },

        /**
         * This function assembles the Bali Nebula™ machine instructions contained in a compiled
         * procedure context into the corresponding bytecode which is added to the compiled
         * procedure context.
         * 
         * @param {Catalog} type A catalog containing the type context for the procedure being
         * assembled.
         * @param {Catalog} procedure A catalog containing the compiled procedure context.
         */
        assembleProcedure: function(type, procedure) {
            const assembler = new Assembler(debug);
            assembler.assembleProcedure(type, procedure);
        },

        /**
         * This function formats a list of Bali Nebula™ machine instructions into a JavaScript
         * string containing the corresponding Bali Nebula™ assembly code. An optional
         * indentation level may be specified that causes the formatter to indent each line by
         * that many additional levels.  Each level is four spaces and the default is zero levels.
         * 
         * @param {List} instructions The list of machine instructions to be formatted.
         * @param {Number} indentation An optional number of levels to indent the output.
         * @returns {String} A string containing the corresponding assembly code.
         */
        formatInstructions: function(instructions, indentation) {
            const formatter = new utilities.Formatter(indentation, debug);
            return formatter.formatInstructions(instructions);
        },

        /**
         * This function parses a string containing Bali Nebula™ assembly code. It generates
         * the corresponding list of Bali Nebula™ machine instructions.
         * 
         * @param {String} assembly A string containing Bali Nebula™ assembly code.
         * @returns {List} A list containing the corresponding Bali Nebula™ machine instructions.
         */
        parseInstructions: function(assembly) {
            const parser = new utilities.Parser(debug);
            return parser.parseInstructions(assembly);
        },

        /**
         * This function converts a buffer of bytes into a bytecode array.
         * 
         * @param {Buffer} bytes A buffer of bytes.
         * @returns {Array} An array containing the corresponding bytecode.
         */
        bytecode: function(bytes) {
            return utilities.bytecode.bytesToBytecode(bytes);
        },

        /**
         * This function converts a bytecode array into a buffer of bytes.
         * 
         * @param {Array} bytecode An array containing the bytecode.
         * @returns {Buffer} A buffer containing the corresponding bytes.
         */
        bytes: function(bytecode) {
            return utilities.bytecode.bytecodeToBytes(bytecode);
        },

        /**
         * This function decodes the operation for a Bali Nebula™ machine instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operation.
         */
        operation: function(instruction) {
            return utilities.bytecode.decodeOperation(instruction);
        },

        /**
         * This function decodes the modifier for a Bali Nebula™ machine instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded modifier.
         */
        modifier: function(instruction) {
            return utilities.bytecode.decodeModifier(instruction);
        },

        /**
         * This function decodes the operand for a Bali Nebula™ machine instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operand.
         */
        operand: function(instruction) {
            return utilities.bytecode.decodeOperand(instruction);
        }

    };
};
