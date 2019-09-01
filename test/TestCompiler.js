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
const account = bali.parse('#GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P');
const securityModule = require('bali-digital-notary').ssm(directory + account.getValue() + '.keys', debug);
const notary = require('bali-digital-notary').api(securityModule, account, directory, debug);
const repository = require('bali-document-repository').local(directory, debug);
const compiler = require('../index').api(notary, repository, debug);


describe('Bali Nebula™ Procedure Compiler', function() {

    describe('Initialize the environment', function() {

        it('should generate the notary key and publish its certificate', async function() {
            const certificate = await notary.generateKey();
            expect(certificate).to.exist;
            const document = await notary.notarizeDocument(certificate);
            expect(document).to.exist;
            const citation = await notary.activateKey(document);
            expect(citation).to.exist;
            const documentId = citation.getValue('$tag').getValue() + citation.getValue('$version');
            await repository.createDocument(documentId, document);
        });

    });

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
                expect(procedure).to.exist;

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
                expect(compiled).to.exist;

                // assemble the procedure into bytecode
                compiler.assembleProcedure(type, compiled);

                source = compiled.toString() + '\n';  // POSIX compliant <EOL>
                //fs.writeFileSync(basmFile, source, 'utf8');
                var expected = fs.readFileSync(basmFile, 'utf8');
                expect(expected).to.exist;
                expect(source).to.equal(expected);
            }
        });

        it('should compile the Bali Nebula™ types', async function() {
            const testFolder = 'test';
            for (var i = 0; i < sources.length; i++) {
                const file = sources[i];
                console.log('      ' + file);
                var document = bali.parse(fs.readFileSync(testFolder + file + '.bali', 'utf8'));
                expect(document).to.exist;
                document = await notary.notarizeDocument(document);
                expect(document).to.exist;
                const citation = await notary.citeDocument(document);
                expect(citation).to.exist;
                await repository.createCitation(file + '/v1', citation);
                const documentId = citation.getValue('$tag').getValue() + citation.getValue('$version');
                expect(documentId).to.exist;
                await repository.createDocument(documentId, document);
                const type = await compiler.compileType(document);
                expect(type).to.exist;
                document = await notary.notarizeDocument(type);
                expect(document).to.exist;
                await repository.createType(documentId, document);
                fs.writeFileSync(testFolder + file + '.code', document, 'utf8');
                const expected = bali.parse(fs.readFileSync(testFolder + file + '.code', 'utf8'));
                expect(expected).to.exist;
                expect(document.isEqualTo(expected)).to.equal(true);
            }
        });

    });

});

const sources = [
    '/bali/abstractions/Component',
    '/bali/interfaces/Sequential',
    '/bali/abstractions/Element',
    '/bali/abstractions/Composite',
    '/bali/abstractions/Type'
];

