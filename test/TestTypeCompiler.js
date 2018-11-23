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
var bali = require('bali-component-framework');
var compiler = require('../src/TypeCompiler');

var testDirectory = 'test/config/';
var notary = require('bali-digital-notary').api(testDirectory);
var cloud = require('bali-cloud-api');
var repository = cloud.local(testDirectory);
var api = cloud.api(notary, repository);

/*  uncomment to generate a new notary key and certificate
var certificate = notary.generateKeys();
var citation = notary.getNotaryCitation();
var certificateId = '' + citation.getValue('$tag') + citation.getValue('$version');
repository.storeCertificate(certificateId, certificate);
/*                                                          */


describe('Bali Cloud Environment™', function() {

    describe('Test the compiler.', function() {

        it('should compile source documents into assembly instructions.', function() {
            var testFolder = 'test/compiler/';
            var files = fs.readdirSync(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var basmFile = testFolder + prefix + '.basm';
                var source = fs.readFileSync(baliFile, 'utf8');
                expect(source).to.exist;  // jshint ignore:line
                var procedure = bali.parser.parseDocument(source).procedure;
                expect(procedure).to.exist;  // jshint ignore:line
                var context = compiler.analyzeProcedure(procedure);
                var instructions = compiler.compileProcedure(procedure, context);
                expect(instructions).to.exist;  // jshint ignore:line
                //fs.writeFileSync(basmFile, instructions, 'utf8');
                var expected = fs.readFileSync(basmFile, 'utf8');
                expect(expected).to.exist;  // jshint ignore:line
                expect(instructions).to.equal(expected);
            }
        });

    });

    describe('Test the analysis and compilation of example types.', function() {

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
                var typeCitation = api.createDraft(type);
                var draft = api.retrieveDraft(typeCitation);
                typeCitation = api.commitDocument(typeCitation, draft);
                var compiledCitation = compiler.compileType(api, typeCitation);
                expect(compiledCitation).to.exist;  // jshint ignore:line
                var compiled = api.retrieveType(compiledCitation);
                var procedures = compiled.getValue('$procedures');
                //fs.writeFileSync(proceduresFile, procedures.toString(), 'utf8');
                var expected = fs.readFileSync(proceduresFile, 'utf8');
                expect(procedures.toString()).to.equal(expected);
            }
        });

    });

});
