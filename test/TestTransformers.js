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
var formatter = require('../src/ProcedureFormatter');
var parser = require('../src/ProcedureParser');

describe('Bali Instruction Set', function() {

    describe('Test Parser and Formatter', function() {

        it('should parse and format the same instructions', function() {
            var file = 'test/source/instructions.basm';
            var source = fs.readFileSync(file, 'utf8');
            expect(source).to.exist;  // jshint ignore:line
            var procedure = parser.parseProcedure(source);
            expect(procedure).to.exist;  // jshint ignore:line
            var formatted = formatter.formatProcedure(procedure);
            expect(formatted + '\n').to.equal(source);  // add POSIX compliant <EOL>
        });

    });

});
