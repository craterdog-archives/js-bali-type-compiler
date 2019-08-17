/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const debug = true;  // set to true for error logging
const directory = 'test/config/';
const fs = require('fs');
const crypto = require('crypto');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework');
const repository = require('bali-document-repository').local(directory, debug);
const compiler = require('../index');


describe('Bali Nebula™ Procedure Compiler', function() {

    describe('Test the compiler and assembler.', function() {

        it('should compile procedures into assembly instructions and bytecodes', function() {
            const testFolder = 'test/compiler/';
            const files = fs.readdirSync(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;

                // read in the procedure source code
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var basmFile = testFolder + prefix + '.basm';
                var source = fs.readFileSync(baliFile, 'utf8');
                var procedure = bali.parse(source);
                expect(procedure).to.exist;  // jshint ignore:line

                // create the compilation type context
                var literals = bali.list();
                var constants = bali.catalog();
                var procedures = bali.catalog();
                var type = bali.catalog();
                type.setValue('$literals', literals);
                type.setValue('$constants', constants);
                type.setValue('$procedures', procedures);

                // compile the procedure
                var compiled = compiler.compile(type, procedure);
                expect(compiled).to.exist;  // jshint ignore:line

                // assemble the procedure into bytecode
                compiler.assemble(type, compiled);

                source = compiled.toString() + '\n';  // POSIX compliant <EOL>
                //fs.writeFileSync(basmFile, source, 'utf8');
                var expected = fs.readFileSync(basmFile, 'utf8');
                expect(expected).to.exist;  // jshint ignore:line
                expect(source).to.equal(expected);
            }
        });

    });

});
