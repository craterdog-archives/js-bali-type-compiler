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
const compiler = require('../src/compiler');

var testDirectory = 'test/config/';
const notary = require('bali-digital-notary').api(testDirectory);
const nebula = require('bali-nebula-api');
var repository = nebula.local(testDirectory);
var api = nebula.api(notary, repository);

/*  uncomment to generate a new notary key and certificate
var certificate = notary.generateKeys();
var citation = notary.getNotaryCitation();
var certificateId = '' + citation.getValue('$tag') + citation.getValue('$version');
repository.storeCertificate(certificateId, certificate);
/*                                                          */


describe('Bali Virtual Macine™', function() {

    describe('Test the compiler.', function() {

        it('should compile source documents into assembly instructions', function() {
            var testFolder = 'test/compiler/';
            var files = fs.readdirSync(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;

                // read in the procedure source code
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var basmFile = testFolder + prefix + '.basm';
                var source = fs.readFileSync(baliFile, 'utf8');
                var procedure = bali.parser.parseDocument(source);
                expect(procedure).to.exist;  // jshint ignore:line

                // create the compilation type context
                var literals = new bali.List();
                var constants = new bali.Catalog();
                var procedures = new bali.Catalog();
                var type = new bali.Catalog();
                type.setValue('$literals', literals);
                type.setValue('$constants', constants);
                type.setValue('$procedures', procedures);

                // compile the procedure
                var compiled = compiler.compiler.compileProcedure(type, procedure);
                expect(compiled).to.exist;  // jshint ignore:line

                // assemble the procedure into bytecode
                compiler.assembler.assembleProcedure(type, compiled);

                source = compiled.toString() + '\n';  // POSIX compliant <EOL>
                //fs.writeFileSync(basmFile, source, 'utf8');
                var expected = fs.readFileSync(basmFile, 'utf8');
                expect(expected).to.exist;  // jshint ignore:line
                expect(source).to.equal(expected);
            }
        });

    });

    describe('Test the analysis and compilation of example types', function() {

        it('should compile example type documents into compiled type documents.', function() {
            var testFolder = 'test/examples/';
            var files = fs.readdirSync(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var typeFile = testFolder + prefix + '.bali';
                var proceduresFile = testFolder + prefix + '.procedures';
                var source = fs.readFileSync(typeFile, 'utf8');
                expect(source).to.exist;  // jshint ignore:line
                var type = bali.parser.parseDocument(source);
                var documentCitation = api.createDraft(type);
                var draft = api.retrieveDraft(documentCitation);
                documentCitation = api.commitDocument(documentCitation, draft);
                var typeCitation = compiler.compileType(api, documentCitation);
                expect(typeCitation).to.exist;  // jshint ignore:line
                //console.log('type citation: ' + typeCitation);
                var procedures = api.retrieveType(typeCitation);
                source = procedures.toString() + '\n';  // POSIX compliant <EOL>
                //fs.writeFileSync(proceduresFile, source, 'utf8');
                var expected = fs.readFileSync(proceduresFile, 'utf8');
                expect(source).to.equal(expected);
            }
        });

    });

});
