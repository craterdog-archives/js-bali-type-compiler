/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

var fs = require('fs');
var mocha = require('mocha');
var expect = require('chai').expect;
var utilities = require('../src/utilities');

describe('Bali Virtual Machine™', function() {

    describe('Test Parser and Formatter', function() {

        it('should parse and format the same instructions', function() {
            var file = 'test/source/instructions.basm';
            var source = fs.readFileSync(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            var procedure = utilities.parser.parseDocument(source);
            expect(procedure).to.exist;  // jshint ignore:line
            var formatted = utilities.formatter.formatInstructions(procedure);
            expect(formatted + '\n').to.equal(source);  // add POSIX compliant <EOL>
        });

        it('should parse and format the same instructions with indentation', function() {
            var file = 'test/source/instructions.basm';
            var source = fs.readFileSync(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            var procedure = utilities.parser.parseDocument(source);
            expect(procedure).to.exist;  // jshint ignore:line
            var formatter = new utilities.Formatter('    ');
            var formatted = formatter.formatInstructions(procedure);
            var expected = source.replace(/^/gm, '    ').replace(/    $/g, '');
            expect(formatted + '\n').to.equal(expected);  // add POSIX compliant <EOL>
        });

    });

});
