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
const crypto = require('crypto');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework').api();
const account = bali.component('#GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P');
const directory = 'test/config/';
const notary = require('bali-digital-notary').test(account, directory);
const local = require('bali-document-repository').local(notary, directory);
const cached = require('bali-document-repository').cached(local);
const repository = require('bali-document-repository').repository(notary, cached);
const compiler = require('../index').api(debug);


describe('Bali Nebula™ Type Compiler', function() {

    describe('Test the compiler and assembler.', function() {

        it('should compile methods into assembly instructions and bytecodes', async function() {
            const testFolder = 'test/compiler/';
            const files = await pfs.readdir(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;

                // read in the type source code
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var source = await pfs.readFile(baliFile, 'utf8');
                var type = bali.component(source);
                expect(type).to.exist;

                // clean the type
                compiler.cleanType(type);

                // compile the type
                await compiler.compileType(repository, type);

                // check for differences
                source = bali.document(type);
                //await pfs.writeFile(baliFile, source, 'utf8');
                var expected = await pfs.readFile(baliFile, 'utf8');
                expect(expected).to.exist;
                expect(source).to.equal(expected);
            }
        });

    });

});
