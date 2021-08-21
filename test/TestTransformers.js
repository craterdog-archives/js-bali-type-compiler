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
const Parser = require('../src/Parser').Parser;
const Formatter = require('../src/Formatter').Formatter;

describe('Bali Method Compiler', function() {

    describe('Test Parser and Formatter', function() {
        const parser = new Parser(debug);

        it('should parse and format the same instructions', async function() {
            const file = 'test/utilities/instructions.basm';
            const source = await pfs.readFile(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            const procedure = parser.parseInstructions(source);
            expect(procedure).to.exist;  // jshint ignore:line
            const formatter = new Formatter(0, debug);
            const formatted = formatter.formatInstructions(procedure);
            expect(formatted).to.equal(source);  // add POSIX compliant <EOL>
        });

        it('should parse and format the same instructions with indentation', async function() {
            const file = 'test/utilities/instructions.basm';
            const source = await pfs.readFile(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            const procedure = parser.parseInstructions(source);
            expect(procedure).to.exist;  // jshint ignore:line
            const formatter = new Formatter(1, debug);
            const formatted = formatter.formatInstructions(procedure);
            const expected = source.replace(/^/gm, '    ').replace(/^    $/g, '');
            expect(formatted).to.equal(expected);  // add POSIX compliant <EOL>
        });

    });

});
