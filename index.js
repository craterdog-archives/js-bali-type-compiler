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
const bytecode = require('./src/utilities').bytecode;


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

    return {

        /**
         * This function compiles the source code for a procedure into a compilation context
         * containing the corresponding assembly instructions for the Nebula Virtual Processor.
         * 
         * @param {Catalog} type The type context for the document being compiled.
         * @param {Source} procedure The source code for the procedure.
         * @returns {Catalog} The compiled context for the procedure.
         */
        compile: function(type, procedure) {
            const compiler = new Compiler(debug);
            const context = compiler.compileProcedure(type, procedure);
            return context;
        },

        /**
         * This function assembles the instructions in a compiled procedure into the corresponding
         * bytecode to be run on the Nebula Virual Processor.
         * 
         * @param {Catalog} type The type context for the document being compiled and assembled.
         * @param {Catalog} context The compilation context for the procedure being assembled.
         */
        assemble: function(type, context) {
            const assembler = new Assembler(debug);
            assembler.assembleProcedure(type, context);
        },

        bytecode: function(bytes) {
            return bytecode.bytesToBytecode(bytes);
        },

        bytes: function(bytecode) {
            return bytecode.bytecodeToBytes(bytecode);
        },

        /**
         * This function decodes the operation for an instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operation.
         */
        operation: function(instruction) {
            return bytecode.decodeOperation(instruction);
        },

        /**
         * This function decodes the modifier for an instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded modifier.
         */
        modifier: function(instruction) {
            return bytecode.decodeModifier(instruction);
        },

        /**
         * This function decodes the operand for an instruction.
         *
         * @param {Number} instruction The instruction to be decoded.
         * @return {Number} The decoded operand.
         */
        operand: function(instruction) {
            return bytecode.decodeOperand(instruction);
        }

    };
};
