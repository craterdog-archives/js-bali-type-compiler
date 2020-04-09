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

const Decoder = require('./src/Decoder').Decoder;
const Parser = require('./src/Parser').Parser;
const Formatter = require('./src/Formatter').Formatter;
const Assembler = require('./src/Assembler').Assembler;
const Compiler = require('./src/Compiler').Compiler;


/**
 * This function returns an object that implements the Bali Nebula™ compiler interface.
 *
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Object} An object that implements the Bali Nebula™ compiler interface.
 */
exports.api = function(debug) {
    // validate the parameters
    debug = debug || false;
    const intrinsics = require('./src/Intrinsics').api(debug);
    const decoder = new Decoder(debug);

    return {

        /**
         * This function cleans removes all compilation attributes from a type definition.
         *
         * @param {Catalog} type The type definition to be cleaned.
         */
        cleanType: function(type) {
            const compiler = new Compiler(debug);
            compiler.cleanType(type);
        },

        /**
         * This function cleans removes all compilation attributes from a procedure definition.
         *
         * @param {Catalog} procedure The procedure being cleaned.
         */
        cleanProcedure: function(procedure) {
            const compiler = new Compiler(debug);
            compiler.cleanProcedure(procedure);
        },

        /**
         * This function compiles a type definition.
         *
         * @param {Catalog} type The type definition to be compiled.
         */
        compileType: function(type) {
            const compiler = new Compiler(debug);
            compiler.compileType(type);
        },

        /**
         * This function compiles the Bali Nebula™ source code for a procedure into a compilation
         * context containing the corresponding Bali Nebula™ virtual machine instructions.
         *
         * @param {Catalog} type A catalog containing the type context for the procedure being
         * compiled.
         * @param {Catalog} procedure The procedure being compiled.
         */
        compileProcedure: function(type, procedure) {
            const compiler = new Compiler(debug);
            compiler.compileProcedure(type, procedure);
        },

        /**
         * This function assembles the Bali Nebula™ virtual machine instructions contained in
         * a compiled procedure context into the corresponding bytecode which is added to the
         * compiled procedure context.
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
         * This function formats a list of Bali Nebula™ virtual machine instructions into a
         * JavaScript string containing the corresponding Bali Nebula™ assembly code. An optional
         * indentation level may be specified that causes the formatter to indent each line by
         * that many additional levels.  Each level is four spaces and the default is zero levels.
         *
         * @param {List} instructions The list of virtual machine instructions to be formatted.
         * @param {Number} indentation An optional number of levels to indent the output.
         * @returns {String} A string containing the corresponding assembly code.
         */
        formatInstructions: function(instructions, indentation) {
            const formatter = new Formatter(indentation, debug);
            return formatter.formatInstructions(instructions);
        },

        /**
         * This function parses a string containing Bali Nebula™ assembly code. It generates
         * the corresponding list of Bali Nebula™ virtual machine instructions.
         *
         * @param {String} assembly A string containing Bali Nebula™ assembly code.
         * @returns {List} A list containing the corresponding Bali Nebula™ virtual machine
         * instructions.
         */
        parseInstructions: function(assembly) {
            const parser = new Parser(debug);
            return parser.parseInstructions(assembly);
        },

        /**
         * This function converts a buffer of bytes into a bytecode array.
         *
         * @param {Buffer} bytes A buffer of bytes.
         * @returns {Array} An array containing the corresponding bytecode.
         */
        bytecode: function(bytes) {
            return decoder.bytesToBytecode(bytes);
        },

        /**
         * This function converts a bytecode array into a buffer of bytes.
         *
         * @param {Array} bytecode An array containing the bytecode.
         * @returns {Buffer} A buffer containing the corresponding bytes.
         */
        bytes: function(bytecode) {
            return decoder.bytecodeToBytes(bytecode);
        },

        /**
         * This function decodes the operation for a Bali Nebula™ virtual machine instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operation.
         */
        operation: function(instruction) {
            return decoder.decodeOperation(instruction);
        },

        /**
         * This function decodes the modifier for a Bali Nebula™ virtual machine instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded modifier.
         */
        modifier: function(instruction) {
            return decoder.decodeModifier(instruction);
        },

        /**
         * This function decodes the operand for a Bali Nebula™ virtual machine instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operand.
         */
        operand: function(instruction) {
            return decoder.decodeOperand(instruction);
        },

        /**
         * This function retrieves the index for the intrinsic function associated with the
         * specified name.
         *
         * @param {String} name The name of the intrinsic function.
         * @returns {Object} The index of the corresponding intrinsic function.
         */
        index: function(name) {
            return intrinsics.index(name);
        },

        /**
         * This function invokes the intrinsic function associated with the specified index using
         * the specified arguments.
         *
         * @param {Number} index The index of the intrinsic function to invoke.
         * @param {Array} args The arguments to be passed to the function invocation.
         * @returns {Object} The result of the intrinsic function invocation.
         */
        invoke: function(index, ...args) {
            return intrinsics.invoke(index, args);
        }

    };
};
