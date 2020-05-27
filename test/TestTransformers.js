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
const Parser = require('../src/Parser').Parser;
const Formatter = require('../src/Formatter').Formatter;

describe('Bali Method Compiler', function() {

    describe('Test Parser and Formatter', function() {
        const parser = new Parser(true);

        it('should parse and format the same instructions', function() {
            const file = 'test/utilities/instructions.basm';
            const source = fs.readFileSync(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            const procedure = parser.parseInstructions(source);
            expect(procedure).to.exist;  // jshint ignore:line
            const formatter = new Formatter();
            const formatted = formatter.formatInstructions(procedure);
            expect(formatted).to.equal(source);  // add POSIX compliant <EOL>
        });

        it('should parse and format the same instructions with indentation', function() {
            const file = 'test/utilities/instructions.basm';
            const source = fs.readFileSync(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            const procedure = parser.parseInstructions(source);
            expect(procedure).to.exist;  // jshint ignore:line
            const formatter = new Formatter(1);
            const formatted = formatter.formatInstructions(procedure);
            const expected = source.replace(/^/gm, '    ').replace(/^    $/g, '');
            expect(formatted).to.equal(expected);  // add POSIX compliant <EOL>
        });

    });

});
