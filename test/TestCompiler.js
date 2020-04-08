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
const bali = require('bali-component-framework').api(1);
const account = bali.component('#GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P');
const compiler = require('../index').api(debug);


describe('Bali Nebula™ Procedure Compiler', function() {

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
                var codeFile = testFolder + prefix + '.proc';
                var source = await pfs.readFile(baliFile, 'utf8');
                var procedure = bali.component(source);
                expect(procedure).to.exist;
                procedure = bali.catalog({$source: procedure});

                // create the type context
                var literals = bali.list();
                var constants = bali.catalog();
                var type = bali.catalog();
                type.setValue('$literals', literals);
                type.setValue('$constants', constants);

                // compile the procedure
                compiler.compileProcedure(type, procedure);

                // assemble the procedure into bytecode
                compiler.assembleProcedure(type, procedure);

                source = procedure.toString() + '\n';  // POSIX compliant <EOL>
                await pfs.writeFile(codeFile, source, 'utf8');
                var expected = await pfs.readFile(codeFile, 'utf8');
                expect(expected).to.exist;
                expect(source).to.equal(expected);
            }
        });

        it('should compile the Bali Nebula™ types', async function() {
            const testFolder = 'test';
            for (var i = 0; i < sources.length; i++) {
                const file = sources[i];
                console.log('      ' + file + '.bali');
                const type = bali.component(await pfs.readFile(testFolder + file + '.bali', 'utf8'));
                expect(type).to.exist;
                await compiler.compileType(type);
                const source = type.toString() + '\n';  // POSIX compliant <EOL>
                const filename = testFolder + file + '.comp';
                await pfs.writeFile(filename, source, 'utf8');
                var expected = await pfs.readFile(filename, 'utf8');
                expect(expected).to.exist;
                expect(source).to.equal(expected);
            }
        });

    });

});

const sources = [
    '/bali/abstractions/Component',
    '/bali/libraries/Components',
    '/bali/abstractions/Type',
    '/bali/libraries/Types',
    '/bali/interfaces/Sequential',
    '/bali/abstractions/Element',
    '/bali/abstractions/Composite',
    '/bali/abstractions/Iterator',
    '/bali/abstractions/Collection'
];

