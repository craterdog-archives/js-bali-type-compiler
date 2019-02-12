/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const testDirectory = 'test/config/';
const fs = require('fs');
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('bali-component-framework');
const notary = require('bali-digital-notary').api(testDirectory);
const nebula = require('bali-nebula-api');
const repository = nebula.repository(testDirectory);
const api = nebula.api(notary, repository);
const utilities = require('../src/utilities');
const vm = require('../');
const assembler = new vm.Assembler();

const EOL = '\n';  // POSIX end of line character


/*
    $tag: #F37WQ14F5SP73NQH5PJ6PAH2F87KZR6Z
    $digest: W15GGVWJPMHGHD9R8K8ACLMND5FK1MAZQ05TCA54615TNT6WR46JH7J3DN3WS3SPMLK8LXA2D8W2F2ALSYS9QXDMZ9C0FTDNB0FP0CH

    $tag: #S5XNQ2TT1P3CQXXWAQKB57V4Z2VY7W6Q
    $digest: 3M01PLZ82S7M8A2XJGHK02D7GXZB7X512DDP0VMCJTC8GJ4TBL6A63524CFJ2NL064Y11N22ZGLH1X4CRCJ98DALMB0F4X31SSTXT0R
 */

const TASK_TEMPLATE =
        '[\n' +
        '    $tag: #Y29YH82BHG4SPTGWGFRYBL4RQ33GTX59\n' +
        '    $account: #GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P\n' +
        '    $balance: 1000\n' +
        '    $status: $active\n' +
        '    $clock: 0\n' +
        '    $stack: []($type: $Stack)\n' +
        '    $contexts: [\n' +
        '        [\n' +
        '            $type: none\n' +
        '            $name: $dummy\n' +
        '            $instruction: 0\n' +
        '            $address: 1\n' +
        '            $bytecode: %bytecode\n' +
        '            $literals: %literals\n' +
        '            $constants: %constants\n' +
        '            $parameters: %parameters\n' +
        '            $variables: %variables\n' +
        '            $procedures: %procedures\n' +
        '            $handlers: []($type: $Stack)\n' +
        '        ]\n' +
        '    ]($type: $Stack)\n' +
        ']';

const CITATION =
        '[\n' +
        '    $protocol: v1\n' +
        '    $tag: #LPDJ6VGTZQQ0N4Q4MG0ZDA46KBLF2WM2\n' +
        '    $version: v2.3\n' +
        '    $digest: none\n' +
        ']';

const MESSAGE = '[$foo: "bar"]';

const QUEUE = '#5ZZ7B985TKH2DZDTKBPPC9XLSNALS8L2';

function loadTask(filename) {
    var source = fs.readFileSync(filename, 'utf8');
    const parser = new utilities.Parser(true);
    var instructions = parser.parseDocument(source);
    var formatter = new utilities.Formatter('    ');
    instructions = formatter.formatInstructions(instructions);

    // create the compiled type context
    var literals = bali.list([
        'true',
        'none',
        '"none"?',
        'false',
        '"five"',
        '"parameter"',
        '"parameter1"',
        '"parameter2"',
        '"two"',
        1,
        3,
        5,
        "<bali:[]>",
        "<bali:[$protocol:v1,$tag:#S5XNQ2TT1P3CQXXWAQKB57V4Z2VY7W6Q,$version:v1,$digest:'3M01PLZ82S7M8A2XJGHK02D7GXZB7X512DDP0VMCJTC8GJ4TBL6A63524CFJ2NL064Y11N22ZGLH1X4CRCJ98DALMB0F4X31SSTXT0R']>",
        bali.parse('[$foo: "bar"](\n' +
        "    <bali:[$protocol:v1,$tag:#S5XNQ2TT1P3CQXXWAQKB57V4Z2VY7W6Q,$version:v1,$digest:'3M01PLZ82S7M8A2XJGHK02D7GXZB7X512DDP0VMCJTC8GJ4TBL6A63524CFJ2NL064Y11N22ZGLH1X4CRCJ98DALMB0F4X31SSTXT0R']>\n" +
        ')'),
        '$foo',
        bali.parse('{return prefix + name}')
    ]);
    var constants = bali.catalog({$constant: 5});
    var type = bali.catalog();
    type.setValue('$literals', literals);
    type.setValue('$constants', constants);


    // create the compiled procedure context
    var parameters = bali.list(['$y', '$x']);
    var variables = bali.list(['$citation', '$foo', '$queue', '$target']);
    var procedures = bali.list(['$function1', '$function2', '$message1', '$message2']);
    var addresses = bali.catalog();
    addresses.setValue('"3.PushLiteral"', 3);
    addresses.setValue('"1.3.ConditionClause"', 8);
    addresses.setValue('"1.4.ConditionClause"', 11);
    addresses.setValue('"1.6.ConditionClause"', 17);
    addresses.setValue('"1.IfStatementDone"', 20);
    var procedure = bali.catalog();
    procedure.setValue('$parameters', parameters);
    procedure.setValue('$variables', variables);
    procedure.setValue('$procedures', procedures);
    procedure.setValue('$addresses', addresses);
    procedure.setValue('$instructions', '"' + EOL + instructions + EOL + '"');

    // assemble the procedure into bytecode
    assembler.assembleProcedure(type, procedure);

    // retrieve the bytecode
    var bytecode = procedure.getValue('$bytecode');

    // set parameter values
    var iterator = parameters.getIterator();
    parameters = bali.catalog();
    while (iterator.hasNext()) {
        var parameter = iterator.getNext();
        parameters.setValue(parameter, bali.NONE);
    }
    parameters.setValue('$x', bali.parse(MESSAGE));

    // set variable values
    variables = bali.catalog();
    variables.setValue('$citation', bali.parse(CITATION));
    variables.setValue('$foo', bali.NONE);
    variables.setValue('$queue', bali.parse(QUEUE));
    variables.setValue('$target', bali.NONE);

    // construct the task context
    source = TASK_TEMPLATE;
    source = source.replace(/%bytecode/, bali.format(bytecode, '            '));
    source = source.replace(/%literals/, bali.format(literals, '            '));
    source = source.replace(/%constants/, bali.format(constants, '            '));
    source = source.replace(/%parameters/, bali.format(parameters, '            '));
    source = source.replace(/%variables/, bali.format(variables, '            '));
    source = source.replace(/%procedures/, bali.format(procedures, '            '));
    var task = bali.parse(source);

    return task;
}


describe('Bali Virtual Machine™', function() {
    var task;

    describe('Test the JUMP instruction.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/JUMP.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var process = vm.process(api, task);
            expect(process.context.address).to.equal(1);

            // 1.IfStatement:
            // SKIP INSTRUCTION
            process.step();
            expect(process.context.address).to.equal(2);

            // 1.1.ConditionClause:
            // PUSH LITERAL `true`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.probability(true))).to.equal(true);
            expect(process.context.address).to.equal(3);
            // JUMP TO 1.IfStatementDone ON FALSE
            process.step();
            expect(process.context.address).to.equal(4);

            // 1.1.1.EvaluateStatement:
            // SKIP INSTRUCTION
            process.step();
            expect(process.context.address).to.equal(5);

            // 1.2.ConditionClause:
            // PUSH LITERAL `false`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.probability(false))).to.equal(true);
            expect(process.context.address).to.equal(6);
            // JUMP TO 1.3.ConditionClause ON FALSE
            process.step();
            expect(process.context.address).to.equal(8);

            // 1.2.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.3.ConditionClause:
            // PUSH LITERAL `true`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.probability(true))).to.equal(true);
            expect(process.context.address).to.equal(9);
            // JUMP TO 1.4.ConditionClause ON TRUE
            process.step();
            expect(process.context.address).to.equal(11);

            // 1.3.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.4.ConditionClause:
            // PUSH LITERAL `false`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.probability(false))).to.equal(true);
            expect(process.context.address).to.equal(12);
            // JUMP TO 1.IfStatementDone ON TRUE
            process.step();
            expect(process.context.address).to.equal(13);

            // 1.4.1.EvaluateStatement:
            // SKIP INSTRUCTION
            process.step();
            expect(process.context.address).to.equal(14);

            // 1.5.ConditionClause:
            // PUSH LITERAL `none`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.NONE)).to.equal(true);
            expect(process.context.address).to.equal(15);
            // JUMP TO 1.6.ConditionClause ON NONE
            process.step();
            expect(process.context.address).to.equal(17);

            // 1.5.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.6.ConditionClause:
            // PUSH LITERAL `true`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.probability(true))).to.equal(true);
            expect(process.context.address).to.equal(18);
            // JUMP TO 1.IfStatementDone ON NONE
            process.step();
            expect(process.context.address).to.equal(19);

            // 1.6.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone
            process.step();
            expect(process.context.address).to.equal(20);

            // 1.IfStatementDone:
            // SKIP INSTRUCTION
            process.step();
            expect(process.context.address).to.equal(21);

            // EOF
            expect(process.step()).to.equal(false);
            expect(process.task.clock).to.equal(17);
            expect(process.task.balance).to.equal(983);
            expect(process.task.status).to.equal('$active');
            expect(process.task.stack.getSize()).to.equal(0);
        });

    });

    describe('Test the PUSH and POP instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/PUSH-POP.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var process = new vm.Processor(api, task);
            expect(process.context.address).to.equal(1);

            // 1.PushHandler:
            // PUSH HANDLER 3.PushLiteral
            process.step();
            expect(process.context.handlers.getSize()).to.equal(1);
            expect(process.context.handlers.getTop().toNumber()).to.equal(3);
            expect(process.context.address).to.equal(2);

            // 2.PushLiteral:
            // PUSH LITERAL `"five"`
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().isEqualTo(bali.text('five'))).to.equal(true);
            expect(process.context.address).to.equal(3);

            // 3.PushLiteral:
            // PUSH LITERAL `{return prefix + name}`
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.task.stack.getTop().toString()).to.equal('{return prefix + name}');
            expect(process.context.address).to.equal(4);

            // 4.PushConstant:
            // PUSH CONSTANT $constant
            process.step();
            expect(process.task.stack.getSize()).to.equal(3);
            expect(process.task.stack.getTop().toNumber()).to.equal(5);
            expect(process.context.address).to.equal(5);

            // 5.PushParameter:
            // PUSH PARAMETER $y
            process.step();
            expect(process.task.stack.getSize()).to.equal(4);
            expect(process.task.stack.getTop().isEqualTo(bali.NONE)).to.equal(true);
            expect(process.context.address).to.equal(6);

            // 6.PopHandler:
            // POP HANDLER
            process.step();
            expect(process.context.handlers.getSize()).to.equal(0);
            expect(process.context.address).to.equal(7);

            // 7.PopComponent:
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(3);
            expect(process.task.stack.getTop().toNumber()).to.equal(5);
            expect(process.context.address).to.equal(8);
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.task.stack.getTop().toString()).to.equal('{return prefix + name}');
            expect(process.context.address).to.equal(9);
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().isEqualTo(bali.text('five'))).to.equal(true);
            expect(process.context.address).to.equal(10);
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(11);

            // EOF
            expect(process.step()).to.equal(false);
            expect(process.task.clock).to.equal(10);
            expect(process.task.balance).to.equal(990);
            expect(process.task.status).to.equal('$active');
        });

    });

    describe('Test the LOAD and STORE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/LOAD-STORE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var process = new vm.Processor(api, task);
            expect(process.context.address).to.equal(1);

            // 1.LoadParameter:
            // PUSH PARAMETER $x
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(process.context.address).to.equal(2);

            // 2.StoreVariable:
            // STORE VARIABLE $foo
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.variables.getItem(2).getValue().toString()).to.equal(MESSAGE);
            expect(process.context.address).to.equal(3);

            // 3.LoadVariable:
            // LOAD VARIABLE $foo
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(process.context.address).to.equal(4);

            // 4.StoreDraft:
            // STORE DRAFT $citation
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(5);
            // LOAD DRAFT $citation
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(process.context.address).to.equal(6);

            // 5.StoreDocument:
            // STORE DOCUMENT $citation
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(7);

            // 6.LoadDocument:
            // LOAD DOCUMENT $citation
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(process.context.address).to.equal(8);

            // 7.StoreMessage:
            // STORE MESSAGE $queue
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(9);

            // 8.LoadMessage:
            // LOAD MESSAGE $queue
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().getValue('$foo').toString()).to.equal('"bar"');
            expect(process.context.address).to.equal(10);

            // EOF
            expect(process.step()).to.equal(false);
            expect(process.task.clock).to.equal(9);
            expect(process.task.balance).to.equal(991);
            expect(process.task.status).to.equal('$active');
        });

    });

    describe('Test the INVOKE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/INVOKE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var process = new vm.Processor(api, task);
            expect(process.context.address).to.equal(1);

            // 1.Invoke:
            // INVOKE $catalog
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.context.address).to.equal(2);

            // 2.InvokeWithParameter:
            // PUSH LITERAL `3`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.number(3))).to.equal(true);
            expect(process.context.address).to.equal(3);
            // INVOKE $inverse WITH PARAMETER
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.task.stack.getTop().isEqualTo(bali.number(-3))).to.equal(true);
            expect(process.context.address).to.equal(4);

            // 3.InvokeWith2Parameters:
            // PUSH LITERAL `5`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.number(5))).to.equal(true);
            expect(process.context.address).to.equal(5);
            // INVOKE $sum WITH 2 PARAMETERS
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.task.stack.getTop().isEqualTo(bali.number(2))).to.equal(true);
            expect(process.context.address).to.equal(6);

            // 4.InvokeWith3Parameters:
            // PUSH LITERAL `"two"`
            process.step();
            expect(process.task.stack.getTop().isEqualTo(bali.text('two'))).to.equal(true);
            expect(process.context.address).to.equal(7);
            // INVOKE $setValue WITH 3 PARAMETERS
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.task.stack.getTop().toString()).to.equal('[2: "two"]');
            expect(process.context.address).to.equal(8);

            // EOF
            expect(process.step()).to.equal(false);
            expect(process.task.clock).to.equal(7);
            expect(process.task.balance).to.equal(993);
            expect(process.task.status).to.equal('$active');
        });

    });

    describe('Test the EXECUTE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/EXECUTE-HANDLE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var process = new vm.Processor(api, task);
            expect(process.context.address).to.equal(1);

            // 1.Execute:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#...,$version:v1,$digest:'...']>`
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.context.address).to.equal(2);
            // EXECUTE $function1
            process.step();
                expect(process.task.contexts.getSize()).to.equal(1);
                expect(process.context.address).to.equal(1);
                // 1.ReturnStatement:
                // PUSH LITERAL `true`
                process.step();
                expect(process.task.stack.getSize()).to.equal(1);
                expect(process.context.address).to.equal(2);
                // HANDLE RESULT
                process.step();
                expect(process.task.contexts.getSize()).to.equal(0);
                expect(process.task.stack.getTop().isEqualTo(bali.probability(true))).to.equal(true);
            expect(process.context.address).to.equal(3);
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(4);

            // 2.ExecuteWithParameters:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#...,$version:v1,$digest:'...']>`
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.context.address).to.equal(5);
            // INVOKE $list
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(6);
            // PUSH LITERAL `"parameter"`
            process.step();
            expect(process.task.stack.getSize()).to.equal(3);
            expect(process.context.address).to.equal(7);
            // INVOKE $addItem WITH 2 PARAMETERS
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(8);
            // INVOKE $parameters WITH PARAMETER
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(9);
            // EXECUTE $function2 WITH PARAMETERS
            process.step();
                expect(process.task.contexts.getSize()).to.equal(1);
                expect(process.context.address).to.equal(1);
                // 1.ThrowStatement:
                // PUSH HANDLER 1.ThrowStatementHandlers
                process.step();
                expect(process.context.handlers.getSize()).to.equal(1);
                expect(process.context.handlers.getTop().toString()).to.equal('6');
                expect(process.context.address).to.equal(2);
                // PUSH LITERAL `none`
                process.step();
                expect(process.task.stack.getSize()).to.equal(1);
                expect(process.task.stack.getTop().toString()).to.equal('none');
                expect(process.context.address).to.equal(3);
                // HANDLE EXCEPTION
                process.step();
                expect(process.context.handlers.isEmpty()).to.equal(true);
                expect(process.context.address).to.equal(6);
                
                // 1.ThrowStatementDone:
                // POP HANDLER
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementHandlers:
                // SKIP INSTRUCTION
                process.step();
                expect(process.context.address).to.equal(7);
                
                // 1.1.HandleClause:
                // STORE VARIABLE $exception
                process.step();
                expect(process.context.address).to.equal(8);
                // LOAD VARIABLE $exception
                process.step();
                expect(process.context.address).to.equal(9);
                // LOAD VARIABLE $exception
                process.step();
                expect(process.context.address).to.equal(10);
                // PUSH LITERAL `"none"`
                process.step();
                expect(process.context.address).to.equal(11);
                // INVOKE $isMatchedBy WITH 2 PARAMETERS
                process.step();
                expect(process.context.address).to.equal(12);
                // JUMP TO 1.ThrowStatementFailed ON FALSE
                process.step();
                expect(process.context.address).to.equal(13);
                // POP COMPONENT
                process.step();
                expect(process.context.address).to.equal(14);
                
                // 1.1.1.ReturnStatement:
                // PUSH PARAMETER $first
                process.step();
                expect(process.context.address).to.equal(15);
                // HANDLE RESULT
                process.step();
                expect(process.task.contexts.getSize()).to.equal(0);
                expect(process.task.stack.getTop().toString()).to.equal('"parameter"');
                
                // 1.1.HandleClauseDone:
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementFailed:
                // HANDLE EXCEPTION
                
                // 1.ThrowStatementSucceeded:
                // SKIP INSTRUCTION
                
                // 2.ReturnStatement:
                // PUSH LITERAL `false`
                // HANDLE RESULT

            expect(process.context.address).to.equal(10);
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(11);

            // 3.ExecuteOnTarget:
            // PUSH LITERAL `[$foo: "bar"](<bali:[...]>)`
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            var expected = process.task.stack.getTop();
            expect(expected.toString().includes('[$foo: "bar"]')).to.equal(true);
            expect(process.context.address).to.equal(12);
            // EXECUTE $message1 ON TARGET
            process.step();
            expect(process.task.contexts.getSize()).to.equal(1);
            expect(process.task.stack.getSize()).to.equal(0);
                expect(process.context.address).to.equal(1);
                // 1.ReturnStatement:
                // LOAD VARIABLE $target
                process.step();
                expect(process.task.stack.getSize()).to.equal(1);
                expect(process.task.stack.getTop().isEqualTo(expected)).to.equal(true);
                expect(process.context.address).to.equal(2);
                // HANDLE RESULT
                process.step();
                expect(process.task.contexts.getSize()).to.equal(0);
                expect(process.task.stack.getTop().isEqualTo(expected)).to.equal(true);
            expect(process.context.address).to.equal(13);
            // POP COMPONENT
            process.step();
            expect(process.task.stack.getSize()).to.equal(0);
            expect(process.context.address).to.equal(14);

            // 4.ExecuteOnTargetWithParameters:
            // PUSH LITERAL `[$foo: "bar"](<bali:[...]>)`
            process.step();
            expect(process.task.stack.getSize()).to.equal(1);
            expect(process.context.address).to.equal(15);
            // INVOKE $list
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(16);
            // PUSH LITERAL `"parameter1"`
            process.step();
            expect(process.task.stack.getSize()).to.equal(3);
            expect(process.context.address).to.equal(17);
            // INVOKE $addItem WITH 2 PARAMETERS
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(18);
            // PUSH LITERAL `"parameter2"`
            process.step();
            expect(process.task.stack.getSize()).to.equal(3);
            expect(process.context.address).to.equal(19);
            // INVOKE $addItem WITH 2 PARAMETERS
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(20);
            // INVOKE $parameters WITH PARAMETER
            process.step();
            expect(process.task.stack.getSize()).to.equal(2);
            expect(process.context.address).to.equal(21);
            // EXECUTE $message2 ON TARGET WITH PARAMETERS
            process.step();
            expect(process.task.contexts.getSize()).to.equal(1);
            expect(process.task.stack.getSize()).to.equal(0);
                expect(process.context.address).to.equal(1);
                // 1.ThrowStatement:
                // PUSH HANDLER 1.ThrowStatementHandlers
                process.step();
                expect(process.context.address).to.equal(2);
                // PUSH PARAMETER $second
                process.step();
                expect(process.context.address).to.equal(3);
                // HANDLE EXCEPTION
                process.step();
                expect(process.context.address).to.equal(6);
                
                // 1.ThrowStatementDone:
                // POP HANDLER
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementHandlers:
                // SKIP INSTRUCTION
                process.step();
                expect(process.context.address).to.equal(7);
                
                // 1.1.HandleClause:
                // STORE VARIABLE $exception
                process.step();
                expect(process.context.address).to.equal(8);
                // LOAD VARIABLE $exception
                process.step();
                expect(process.context.address).to.equal(9);
                // LOAD VARIABLE $exception
                process.step();
                expect(process.context.address).to.equal(10);
                // PUSH LITERAL `"none"`
                process.step();
                expect(process.context.address).to.equal(11);
                // INVOKE $isMatchedBy WITH 2 PARAMETERS
                process.step();
                expect(process.context.address).to.equal(12);
                // JUMP TO 1.ThrowStatementFailed ON FALSE
                process.step();
                expect(process.context.address).to.equal(17);
                // POP COMPONENT
                
                // 1.1.1.ReturnStatement:
                // PUSH LITERAL `true`
                // HANDLE RESULT
                
                // 1.1.HandleClauseDone:
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementFailed:
                // HANDLE EXCEPTION
                process.step();
                
                // 1.ThrowStatementSucceeded:
                // SKIP INSTRUCTION
                
                // 2.ReturnStatement:
                // PUSH LITERAL `false`
                // HANDLE RESULT

            // POP COMPONENT

            // EOF
            expect(process.step()).to.equal(false);
            expect(process.task.clock).to.equal(49);
            expect(process.task.balance).to.equal(951);
            expect(process.task.status).to.equal('$done');
        });

    });

});
