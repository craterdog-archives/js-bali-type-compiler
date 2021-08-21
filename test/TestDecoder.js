/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const debug = 0;
const pfs = require('fs').promises;
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework').api(debug);
const Decoder = require('../src/Decoder').Decoder;
const decoder = new Decoder(debug);

describe('Bali Method Compiler', function() {

    describe('Test bytecode utilities on bytecodes', function() {

        it('should perform round trip conversions from bytes to bytecodes', async function() {
            const generator = bali.generator();
            const bytes = generator.generateBytes(16);
            const bytecode = decoder.bytesToBytecode(bytes);
            const bytes2 = decoder.bytecodeToBytes(bytecode);
            expect(bytes2.toString('hex')).to.equal(bytes.toString('hex'));
            const bytecode2 = decoder.bytesToBytecode(bytes2);
            expect(JSON.stringify(bytecode2, null, 2)).to.equal(JSON.stringify(bytecode, null, 2));
        });

        it('should round trip conversions from bytecodes to bytes', async function() {
            const bytecode = [0, 10241, 6164];
            const bytes = decoder.bytecodeToBytes(bytecode);
            expect(bytes.toString('hex')).to.equal('000028011814');
        });

    });

    describe('Test bytecode utilities on instructions', function() {

        it('should construct and compare instructions', async function() {
            const bytecode = [];
            var operand;
            var operation;
            var modifier;
            var encoded;

            for (var i = 0; i < 32; i++) {
                // test with no operand
                var instruction = i << 11;
                operation = decoder.decodeOperation(instruction);
                modifier = decoder.decodeModifier(instruction);
                encoded = decoder.encodeInstruction(operation, modifier);
                if (decoder.instructionIsValid(instruction)) {
                    expect(instruction).to.equal(encoded);
                    bytecode.push(instruction);
                }
                // test with operand
                operand = i + 1;
                instruction = i << 11 | operand;
                operation = decoder.decodeOperation(instruction);
                modifier = decoder.decodeModifier(instruction);
                encoded = decoder.encodeInstruction(operation, modifier, operand);
                if (decoder.instructionIsValid(instruction)) {
                    expect(instruction).to.equal(encoded);
                    bytecode.push(instruction);
                }
            }

            const formattedInstructions = decoder.bytecodeToString(bytecode);
            //await pfs.writeFile('test/utilities/formatted.code', formattedInstructions, 'utf8');
            const expected = await pfs.readFile('test/utilities/formatted.code', 'utf8');
            expect(formattedInstructions).to.equal(expected);
        });

    });

});
