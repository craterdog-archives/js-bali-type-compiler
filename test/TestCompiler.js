/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const debug = 2;
const directory = 'test/config/';
const pfs = require('fs').promises;
const crypto = require('crypto');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework').api();
const account = bali.component('#GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P');
const api = require('bali-digital-notary');
const securityModule = api.ssm(directory);
const notary = api.notary(securityModule, account, directory);
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

        it('should compile procedures into assembly instructions and bytecodes', async function() {
            const testFolder = 'test/compiler/';
            const files = await pfs.readdir(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;

                // read in the procedure source code
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var codeFile = testFolder + prefix + '.code';
                var source = await pfs.readFile(baliFile, 'utf8');
                var procedure = bali.component(source);
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
                //await pfs.writeFile(codeFile, source, 'utf8');
                var expected = await pfs.readFile(codeFile, 'utf8');
                expect(expected).to.exist;
                expect(source).to.equal(expected);
            }
        });

        it('should compile the Bali Nebula™ types', async function() {
            const testFolder = 'test';
            for (var i = 0; i < sources.length; i++) {
                const file = sources[i];
                console.log('      ' + file);
                var document = bali.component(await pfs.readFile(testFolder + file + '.bali', 'utf8'));
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
                const source = document.toString() + '\n';  // POSIX compliant <EOL>
                const filename = testFolder + file + '.type';
                await pfs.writeFile(filename, source, 'utf8');
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

