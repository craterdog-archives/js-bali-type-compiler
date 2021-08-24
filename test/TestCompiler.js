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
const directory = 'test/config/';
const pfs = require('fs').promises;
const crypto = require('crypto');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework').api(debug);
const account = bali.component('#GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P');
const compiler = require('../index').api(debug);


describe('Bali Nebula™ Type Compiler', function() {

    describe('Test the compiler and assembler.', function() {

        it('should compile methods into assembly instructions and bytecodes', async function() {
            const testFolder = 'test/compiler/';
            const files = await pfs.readdir(testFolder);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.endsWith('.bali')) continue;

                // read in the method source code
                console.log('      ' + file);
                var prefix = file.split('.').slice(0, 1);
                var baliFile = testFolder + prefix + '.bali';
                var source = await pfs.readFile(baliFile, 'utf8');
                var method = bali.component(source);
                expect(method).to.exist;

                // create the type context
                var literals = bali.list();
                var constants = bali.catalog();
                var type = bali.catalog();
                type.setAttribute('$literals', literals);
                type.setAttribute('$constants', constants);

                // clean the method
                compiler.cleanMethod(method);

                // compile the method
                compiler.compileMethod(type, method);

                // assemble the method into bytecode
                compiler.assembleMethod(type, method);

                // check for differences
                source = method.toDocument();
                //await pfs.writeFile(baliFile, source, 'utf8');
                var expected = await pfs.readFile(baliFile, 'utf8');
                expect(expected).to.exist;
                expect(source).to.equal(expected);
            }
        });

    });

});
