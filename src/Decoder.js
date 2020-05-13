/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM). All Rights Reserved.    *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.       *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative.(See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This library encapsulates the byte encoding for the Bali Nebula™ virtual machine.
 * Each bytecode instruction is made up of two bytes containing three parts:
 * a three bit opcode that encodes the operation, a two bit modcode that
 * encodes the modifier, and an 11 bit operand that may be an index or
 * instruction address.  The structure of a bytecode instruction is
 * as follows:
 * <pre>
 * | opcode (3 bits) | modcode (2 bits) | operand (11 bits)
 * </pre>
 * An operand is an unsigned 11 bit number [0..2047] representing a unit
 * based index or address. The value zero is reserved for specifying an
 * invalid index or address.
 */
const bali = require('bali-component-framework').api();
const types = require('./Types');
const EOL = '\n';  // POSIX end of line character


/**
 * This function returns a decoder object that can perform bytecode encoding and decoding.
 *
 * @param {Number} debug A number in the range [0..3].
 * @returns {Decoder} The new decoder.
 */
const Decoder = function(debug) {
    debug = debug || 0;

    // PRIVATE CONSTANTS

    const OPCODE_MASK = 0xE000;
    const MODCODE_MASK = 0x1800;
    const OPERAND_MASK = 0x07FF;


    // PRIVATE FUNCTIONS

    const operandIsAddress = function(operation, modifier, operand) {
        switch (operation) {
            case types.JUMP:
                return operand > 0;
            case types.PUSH:
                return modifier === types.HANDLER;
            default:
                return false;
        }
    };

    /**
     * This function returns the canonical string format for a Bali virtual
     * machine address in hexidecimal [000..3FF].
     *
     * @param {Number} address The virtual machine address.
     * @returns {String} The canonical string representation of the address.
     */
    const addressToString = function(address) {
        var string = address.toString(16).toUpperCase();
        while (string.length < 3) string = '0' + string;
        string = '[' + string + ']';
        return string;
    };

    const operandToString = function(operation, modifier, operand) {
        if (operandIsAddress(operation, modifier, operand)) {
            return addressToString(operand);
        } else {
            return operand.toString();
        }
    };


    // PUBLIC FUNCTIONS

    this.instructionToString = function(operation, modifier, operand) {
        if (!operation && !modifier && !operand) return 'SKIP INSTRUCTION';
        const operandString = operandToString(operation, modifier, operand);
        var string = types.operationString(operation) + ' ';
        switch (operation) {
            case types.JUMP:
                string += 'TO ' + operandString;
                if (modifier > 0) string += ' ' + types.jumpModifierString(modifier);
                break;
            case types.PUSH:
                string += types.pushModifierString(modifier) + ' ' + operandString;
                break;
            case types.POP:
                string += types.popModifierString(modifier);
                break;
            case types.LOAD:
                string += types.loadModifierString(modifier) + ' ' + operandString;
                break;
            case types.STORE:
                string += types.storeModifierString(modifier) + ' ' + operandString;
                break;
            case types.INVOKE:
                string += operandString;
                if (modifier > 0) string += ' WITH ' + modifier + ' ARGUMENT';
                if (modifier > 1) string += 'S';
                break;
            case types.SEND:
                string += operandString + ' ' + types.sendModifierString(modifier);
                break;
            case types.HANDLE:
                string += types.handleModifierString(modifier);
                break;
        }
        return string;
    };

    /**
     * This function takes an operation, a modifier and an operand and
     * encodes them into the corresponding instruction as a two byte number.
     *
     * @param {Number} operation The operation for the bytecode.
     * @param {Number} modifier The modifier for the bytecode.
     * @param {Number} optionalOperand The optional operand associated with the operation.
     * @return {Number} The bytecode for the instruction.
     */
    this.encodeInstruction = function(operation, modifier, optionalOperand) {
        const opcode = (operation << 13) & OPCODE_MASK;
        const modcode = (modifier << 11) & MODCODE_MASK;
        const operand = optionalOperand === undefined ? 0 : optionalOperand;
        const instruction = opcode | modcode | operand;
        return instruction;
    };

    /**
     * This function decodes the operation for an instruction.
     *
     * @param {Number} instruction The instruction to be decoded.
     * @return {Number} The decoded operation.
     */
    this.decodeOperation = function(instruction) {
        const operation = (instruction & OPCODE_MASK) >>> 13;
        return operation;
    };

    /**
     * This function decodes the modifier for an instruction.
     *
     * @param {Number} instruction The instruction to be decoded.
     * @return {Number} The decoded modifier.
     */
    this.decodeModifier = function(instruction) {
        const modifier = (instruction & MODCODE_MASK) >>> 11;
        return modifier;
    };

    /**
     * This function decodes the operand for an instruction.
     *
     * @param {Number} instruction The instruction to be decoded.
     * @return {Number} The decoded operand.
     */
    this.decodeOperand = function(instruction) {
        const operand = instruction & OPERAND_MASK;
        return operand;
    };

    /**
     * This function determines whether or not an instruction
     * is valid.
     *
     * @param {Number} instruction The instruction to be decoded.
     * @return {Boolean} Whether or not the instruction is valid.
     */
    this.instructionIsValid = function(instruction) {
        const operation = this.decodeOperation(instruction);
        const modifier = this.decodeModifier(instruction);
        const operand = this.decodeOperand(instruction);
        switch (operation) {
            case types.JUMP:
                // the SKIP INSTRUCTION is the only one allowed to have a zero operand
                // and only if the modifier is also zero
                return operand > 0 || modifier === 0;
            case types.PUSH:
                switch (modifier) {
                    case types.HANDLER:
                    case types.LITERAL:
                    case types.CONSTANT:
                    case types.ARGUMENT:
                        return operand > 0;
                    default:
                        return false;
                }
                break;
            case types.POP:
                switch (modifier) {
                    case types.HANDLER:
                    case types.COMPONENT:
                        return operand === 0;
                    default:
                        return false;
                }
                break;
            case types.LOAD:
            case types.STORE:
            case types.INVOKE:
            case types.SEND:
                return operand > 0;
            case types.HANDLE:
                switch (modifier) {
                    case types.EXCEPTION:
                    case types.RESULT:
                        return operand === 0;
                    default:
                        return false;
                }
                break;
            default:
                return false;
        }
    };

    /**
     * This function converts a base 16 encoded byte string into a bytecode array.
     *
     * @param {Buffer} bytes The byte byffer containing the bytecode to be converted.
     * @returns {Array} The corresponding bytecode array.
     */
    this.bytesToBytecode = function(bytes) {
        const bytecode = [];
        for (var i = 0; i < bytes.length; i += 2) {
            var instruction = bytes[i] << 8;
            instruction |= bytes[i + 1] & 0xFF;
            bytecode.push(instruction);
        }
        return bytecode;
    };

    /**
     * This function converts a bytecode array into a buffer containing a byte string.
     *
     * @param {Array} bytecode The bytecode array to be converted.
     * @returns {Buffer} A buffer containing the byte string for the bytecode.
     */
    this.bytecodeToBytes = function(bytecode) {
        const bytes = Buffer.alloc(bytecode.length * 2);
        for (var i = 0; i < bytecode.length; i++) {
            bytes[2 * i] = bytecode[i] >> 8 & 0xFF;
            bytes[2 * i + 1] = bytecode[i] & 0xFF;
        }
        return bytes;
    };

    /**
     * This function returns a human readable version of Bali virtual machine bytecode.
     *
     * @param {Array} bytecode An array of the bytecode instructions.
     * @returns {String} The human readable form of the bytecode.
     */
    this.bytecodeToString = function(bytecode) {
        var string = ' Addr     Bytes   Bytecode                 Instruction\n';
        string += '-------------------------------------------------------------------\n';
        bytecode.forEach(function(instruction, index) {
            // format the address
            var address = index + 1;  // Bali ordinal based indexing
            address = addressToString(address);

            // format the instruction as hexadecimal bytes
            var bytes = instruction.toString(16).toUpperCase();
            while (bytes.length < 4) bytes = '0' + bytes;

            // format the description
            const operation = this.decodeOperation(instruction);
            const modifier = this.decodeModifier(instruction);
            const operand = this.decodeOperand(instruction);
            const description = this.instructionToString(operation, modifier, operand);

            // format the bytecode (must happen last)
            var operandString = operandToString(operation, modifier, operand);
            while (operandString.length < 4) operandString = ' ' + operandString;  // pad an index operand with leading spaces
            if (operandString.length < 5) operandString += ' ';  // pad an index operand with a single trailing space
            const bytecode = '' + operation + modifier + ' ' + operandString;

            // put them all together
            string += address + ':    ' + bytes + '    ' + bytecode + '    ' + description + EOL;

        }, this);
        return string;
    };

    return this;

};
Decoder.prototype.constructor = Decoder;
exports.Decoder = Decoder;
