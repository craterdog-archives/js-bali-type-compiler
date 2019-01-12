/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const fs = require('fs');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework');
const utilities = require('../src/utilities');

describe('Bali Virtual Machine™', function() {

    describe('Test bytecode utilities on words', function() {

        it('should round trip conversions from bytes to bytecodes', function() {
            var bytes = bali.random.bytes(16);
            var bytecode = utilities.bytecode.bytesToBytecode(bytes);
            var bytes2 = utilities.bytecode.bytecodeToBytes(bytecode);
            expect(bytes2.toString('hex')).to.equal(bytes.toString('hex'));
            var bytecode2 = utilities.bytecode.bytesToBytecode(bytes2);
            expect(JSON.stringify(bytecode2, null, 2)).to.equal(JSON.stringify(bytecode, null, 2));
        });

        it('should round trip conversions from bytecodes to bytes', function() {
            var bytecode = [0, 10241, 6164];
            var bytes = utilities.bytecode.bytecodeToBytes(bytecode);
            expect(bytes.toString('hex')).to.equal('000028011814');
        });

    });

    describe('Test bytecode utilities on instructions', function() {

        it('should construct and compare instructions with and without operands', function() {
            var bytecode = [];
            var operand;
            var operation;
            var modifier;
            var encoded;

            for (var i = 0; i < 32; i++) {
                // test with no operand
                instruction = i << 11;
                operation = utilities.bytecode.decodeOperation(instruction);
                modifier = utilities.bytecode.decodeModifier(instruction);
                encoded = utilities.bytecode.encodeInstruction(operation, modifier);
                if (utilities.bytecode.instructionIsValid(instruction)) {
                    expect(instruction).to.equal(encoded);
                    bytecode.push(instruction);
                }
                // test with operand
                operand = i + 1;
                instruction = i << 11 | operand;
                operation = utilities.bytecode.decodeOperation(instruction);
                modifier = utilities.bytecode.decodeModifier(instruction);
                encoded = utilities.bytecode.encodeInstruction(operation, modifier, operand);
                if (utilities.bytecode.instructionIsValid(instruction)) {
                    expect(instruction).to.equal(encoded);
                    bytecode.push(instruction);
                }
            }

            var formattedInstructions = utilities.bytecode.bytecodeToString(bytecode);
            //fs.writeFileSync('test/utilities.bytecode/formatted.code', formattedInstructions, 'utf8');
            var expected = fs.readFileSync('test/utilities/formatted.code', 'utf8');
            expect(formattedInstructions).to.equal(expected);
        });

    });

});
