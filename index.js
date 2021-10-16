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
const Analyzer = require('./src/Analyzer').Analyzer;


/**
 * This function returns an object that implements the Bali Nebula™ compiler interface.
 *
 * An optional debug argument may be specified that controls the level of debugging that
 * should be applied during execution. The allowed levels are as follows:
 * <pre>
 *   0: no debugging is applied (this is the default value and has the best performance)
 *   1: log any exceptions to console.error before throwing them
 *   2: perform argument validation checks on each call (poor performance)
 *   3: log interesting arguments, states and results to console.log
 * </pre>
 *
 * @returns {Object} An object that implements the Bali Nebula™ compiler interface.
 */
exports.api = function(debug) {
    // validate the parameters
    this.debug = debug || 0;  // default is off
    const parser = new Parser(this.debug);
    const decoder = new Decoder(this.debug);
    const compiler = new Compiler(this.debug);
    const assembler = new Assembler(this.debug);
    const analyzer = new Analyzer(this.debug);

    return {

        /**
         * This function cleans removes all compilation attributes from a type definition.
         *
         * @param {Catalog} type The type definition to be cleaned.
         */
        cleanType: function(type) {
            compiler.cleanType(type);
        },

        /**
         * This function cleans removes all compilation attributes from a method definition.
         *
         * @param {Catalog} method The method being cleaned.
         */
        cleanMethod: function(method) {
            compiler.cleanMethod(method);
        },

        /**
         * This function compiles a type definition.
         *
         * @param {DocumentRepository} repository The document repository from which to retrieve
         * ancestral type definitions.
         * @param {Catalog} type The type definition to be compiled.
         */
        compileType: async function(repository, type) {
            await compiler.compileType(repository, type);
        },

        /**
         * This function compiles the Bali Nebula™ source code for a method into a compilation
         * context containing the corresponding Bali Virtual Machine™ instructions.
         *
         * @param {DocumentRepository} repository The document repository from which to retrieve
         * ancestral type definitions.
         * @param {Catalog} type A catalog containing the type context for the method being
         * compiled.
         * @param {Symbol} symbol The symbol associated with the method.
         * @param {Catalog} method The method being compiled.
         */
        compileMethod: async function(repository, type, symbol, method) {
            await compiler.compileMethod(repository, type, symbol, method);
        },

        /**
         * This function assembles the Bali Virtual Machine™ instructions contained in
         * a compiled method context into the corresponding bytecode which is added to the
         * compiled method context.
         *
         * @param {Catalog} type A catalog containing the type context for the method being
         * assembled.
         * @param {Catalog} method A catalog containing the compiled method context.
         */
        assembleMethod: function(type, method) {
            assembler.assembleMethod(type, method);
        },

        /**
         * This function formats a list of Bali Virtual Machine™ instructions into a
         * JavaScript string containing the corresponding Bali Nebula™ assembly code. An optional
         * indentation level may be specified that causes the formatter to indent each line by
         * that many additional levels.  Each level is four spaces and the default is zero levels.
         *
         * @param {List} instructions The list of virtual machine instructions to be formatted.
         * @param {Number} indentation An optional number of levels to indent the output.
         * @returns {String} A string containing the corresponding assembly code.
         */
        formatInstructions: function(instructions, indentation) {
            const formatter = new Formatter(this.debug);
            return formatter.formatInstructions(instructions, indentation);
        },

        /**
         * This function parses a string containing Bali Nebula™ assembly code. It generates
         * the corresponding list of Bali Virtual Machine™ instructions.
         *
         * @param {String} assembly A string containing Bali Nebula™ assembly code.
         * @returns {List} A list containing the corresponding Bali Virtual Machine™
         * instructions.
         */
        parseInstructions: function(assembly) {
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
         * This function determines whether or not the specified Bali Virtual Machine™ instruction
         * is valid.
         *
         * @param {Number} instruction The instruction to be validated.
         * @return {Boolean} Whether or not the instruction is valid.
         */
        isValid: function(instruction) {
            return decoder.instructionIsValid(instruction);
        },

        /**
         * This function decodes the operation for a Bali Virtual Machine™ instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operation.
         */
        operation: function(instruction) {
            return decoder.decodeOperation(instruction);
        },

        /**
         * This function decodes the modifier for a Bali Virtual Machine™ instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded modifier.
         */
        modifier: function(instruction) {
            return decoder.decodeModifier(instruction);
        },

        /**
         * This function decodes the operand for a Bali Virtual Machine™ instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operand.
         */
        operand: function(instruction) {
            return decoder.decodeOperand(instruction);
        },

        /**
         * This function takes an operation, a modifier and an operand associated with a
         * Bali Virtual Machine™ instruction and encodes them into the corresponding
         * instruction as a two byte number.
         *
         * @param {Number} operation The operation for the instruction.
         * @param {Number} modifier The modifier for the instruction.
         * @param {Number} operand The optional operand associated with the instruction.
         * @return {Number} The resulting bytecode for the instruction.
         */
        instruction: function(operation, modifier, operand) {
            return decoder.encodeInstruction(operation, modifier, operand);
        },

        /**
         * This function returns a string version of the specified Bali Virtual Machine™ instruction.
         *
         * @param {Number} instruction The instruction.
         * @return {String} A string version of the instruction.
         */
        string: function(instruction) {
            return decoder.instructionToString(instruction);
        }
    };
};
