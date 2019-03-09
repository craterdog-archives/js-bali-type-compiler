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
const testDirectory = 'test/config/';
const fs = require('fs');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework');
const account = bali.tag('GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P');
const notary = require('bali-digital-notary').api(account, testDirectory, debug);
const nebula = require('bali-nebula-api');
const repository = nebula.local(testDirectory, debug);
const api = nebula.api(notary, repository, debug);
const vm = require('../');
const compiler = new vm.Compiler();
const assembler = new vm.Assembler();


describe('Bali Virtual Macine™', function() {

    describe('Initialize the environment', function() {

        it('should initialize the nebula API', async function() {
            await api.initializeAPI();
        });

        it('should generate a new key pair and store the certificate in the repository', async function() {
            const certificate = await notary.generateKeyPair();
            const citation = await notary.getCitation();
            const certificateId = '' + citation.getValue('$tag').getValue() + citation.getValue('$version');
            await repository.createCertificate(certificateId, certificate);
        });

    });

    describe('Test the compiler.', function() {

        it('should compile source documents into assembly instructions', function() {
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
                var compiled = compiler.compileProcedure(type, procedure);
                expect(compiled).to.exist;  // jshint ignore:line

                // assemble the procedure into bytecode
                assembler.assembleProcedure(type, compiled);

                source = compiled.toString() + '\n';  // POSIX compliant <EOL>
                //fs.writeFileSync(basmFile, source, 'utf8');
                var expected = fs.readFileSync(basmFile, 'utf8');
                expect(expected).to.exist;  // jshint ignore:line
                expect(source).to.equal(expected);
            }
        });

    });

    describe('Test the analysis and compilation of example types', function() {

        it('should compile example type documents into compiled type documents.', async function() {
            const testFolder = 'test/examples/';
            const files = fs.readdirSync(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var typeFile = testFolder + prefix + '.bali';
                var proceduresFile = testFolder + prefix + '.procedures';
                var source = fs.readFileSync(typeFile, 'utf8');
                expect(source).to.exist;  // jshint ignore:line
                var type = bali.parse(source);
                var typeCitation = await api.saveDraft(type);
                var draft = await api.retrieveDraft(typeCitation);
                typeCitation = await api.commitDocument(draft);
                typeCitation = await vm.compile(api, typeCitation);
                expect(typeCitation).to.exist;  // jshint ignore:line
                var procedures = await api.retrieveType(typeCitation);
                source = procedures.toString() + '\n';  // POSIX compliant <EOL>
                //fs.writeFileSync(proceduresFile, source, 'utf8');
                var expected = fs.readFileSync(proceduresFile, 'utf8');
                expect(source).to.equal(expected);
            }
        });

        it('should compile the Bali types.', async function() {
            const testFolder = 'test/types/';
            for (var i = 0; i < sources.length; i++) {
                var file = sources[i];
                console.log('      ' + file);
                var source = fs.readFileSync(testFolder + file, 'utf8');
                expect(source).to.exist;  // jshint ignore:line
                var type = bali.parse(source);
                var typeCitation = await api.saveDraft(type);
                var draft = await api.retrieveDraft(typeCitation);
                typeCitation = await api.commitDocument(draft);
                typeCitation = vm.compile(api, typeCitation);
                expect(typeCitation).to.exist;  // jshint ignore:line
            }
        });

    });

});

const sources = [
    'Component.bali',
    'Sequential.bali',
    'Element.bali',
    'Composite.bali',
    'Type.bali'
];

