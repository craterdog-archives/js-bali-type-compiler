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
var notary = require('bali-digital-notary');
var nebula = require('bali-nebula-api');

var testDirectory = 'test/config/';
var notaryKey = notary.api(testDirectory);
var repository = nebula.local(testDirectory);
var api = nebula.api(notaryKey, repository);

var utilities = require('../src/utilities');
var assembler = require('../src/compiler/Assembler').assembler;
var Processor = require('../src/processor/Processor').Processor;


/*
<bali:[$protocol:v1,$tag:#VVY1M49XZ23D6KRMHP3M3BL178AMK28D,$version:v1,$digest:'WNHB5NQNH3HN5V0PMC1TFC93VCZ1CQF5KST2QHAYR8Q7NZFGML0Z88TVCTZTXNR40ZMKJL848PNV31BN7JJ01NLYD39DLA8AJBQ1G2R']>
 */

var TYPE_REFERENCE = "<bali:[$protocol:v1,$tag:#WAKWFXPMN7FCG8CF95N7L2P4JHJXH4SD,$version:v1,$digest:none]>";

var TYPE_SOURCE = 
        '[\n' +
        '    $procedures: [\n' +
        '        $functionWithException: [\n' +
        '            $source: {\n' +
        '                throw [$type: $test]\n' +
        '            }\n' +
        '        ]\n' +
        '        $functionWithParameters: [\n' +
        '            $source: {\n' +
        '                return param1 + param2\n' +
        '            }\n' +
        '        ]\n' +
        '        $message: [\n' +
        '            $source: {\n' +
        '                return "It worked."\n' +
        '            }\n' +
        '        ]\n' +
        '        $messageWithException: [\n' +
        '            $source: {\n' +
        '                throw [$parameter: param]\n' +
        '            }\n' +
        '        ]\n' +
        '    ]\n' +
        ']($type: $Class)';


var TASK_TEMPLATE =
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
        '            $literals: %literals($type: $Set)\n' +
        '            $constants: %constants\n' +
        '            $parameters: %parameters\n' +
        '            $variables: %variables\n' +
        '            $procedures: %procedures($type: $Set)\n' +
        '            $handlers: []($type: $Stack)\n' +
        '        ]\n' +
        '    ]($type: $Stack)\n' +
        ']';

var CITATION =
        '[\n' +
        '    $protocol: v1\n' +
        '    $tag: #LPDJ6VGTZQQ0N4Q4MG0ZDA46KBLF2WM2\n' +
        '    $version: v2.3\n' +
        '    $digest: none\n' +
        ']';

var MESSAGE = '[$foo: "bar"]';

var QUEUE = '#5ZZ7B985TKH2DZDTKBPPC9XLSNALS8L2';

function loadTask(filename) {
    var source = fs.readFileSync(filename, 'utf8');
    var instructions = utilities.parser.parseDocument(source, true);
    var context = new bali.Catalog();
    context.setValue('$constants', new bali.Set());
    context.setValue('$parameters', bali.List.fromCollection(['$x', '$y']));
    assembler.analyzeInstructions(context, instructions);

    var literals = context.getValue('$literals');

    var constants = new bali.Catalog();
    var iterator = context.getValue('$constants').getIterator();
    while (iterator.hasNext()) {
        var constant = iterator.getNext();
        constants.setValue(constant, bali.Filter.NONE);
    }

    var parameters = new bali.Catalog();
    iterator = context.getValue('$parameters').getIterator();
    while (iterator.hasNext()) {
        var parameter = iterator.getNext();
        parameters.setValue(parameter, bali.Filter.NONE);
    }
    parameters.setValue('$x', bali.parser.parseDocument(MESSAGE));
    parameters.sortItems();

    var variables = new bali.Catalog();
    iterator = context.getValue('$variables').getIterator();
    while (iterator.hasNext()) {
        var variable = iterator.getNext();
        variables.setValue(variable, bali.Filter.NONE);
    }
    variables.setValue('$target', bali.Filter.NONE);
    variables.setValue('$queue', bali.parser.parseDocument(QUEUE));
    variables.setValue('$citation', bali.parser.parseDocument(CITATION));
    variables.sortItems();

    var procedures = context.getValue('$procedures');

    var bytecode = assembler.assembleInstructions(context, instructions);
    var bytes = utilities.bytecode.bytecodeToBytes(bytecode);
    var base16 = bali.codex.base16Encode(bytes, '            ');
    source = TASK_TEMPLATE;
    source = source.replace(/%literals/, literals.toDocument('            '));
    source = source.replace(/%constants/, constants.toDocument('            '));
    source = source.replace(/%parameters/, parameters.toDocument('            '));
    source = source.replace(/%variables/, variables.toDocument('            '));
    source = source.replace(/%procedures/, procedures.toDocument('            '));
    source = source.replace(/%bytecode/, "'" + base16 + "'");
    var task = bali.parser.parseDocument(source);
    return task;
}


describe('Bali Virtual Machine™', function() {
    var task;

    describe('Test the JUMP instruction.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/JUMP.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.IfStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(2);

            // 1.1.ConditionClause:
            // PUSH LITERAL `true`
            // JUMP TO 1.IfStatementDone ON FALSE
            processor.step();
            processor.step();
            expect(processor.context.address).to.equal(4);

            // 1.1.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(5);

            // 1.2.ConditionClause:
            // PUSH LITERAL `false`
            // JUMP TO 1.3.ConditionClause ON FALSE
            processor.step();
            processor.step();
            expect(processor.context.address).to.equal(8);

            // 1.2.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.3.ConditionClause:
            // PUSH LITERAL `true`
            // JUMP TO 1.4.ConditionClause ON TRUE
            processor.step();
            processor.step();
            expect(processor.context.address).to.equal(11);

            // 1.3.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.4.ConditionClause:
            // PUSH LITERAL `false`
            // JUMP TO 1.IfStatementDone ON TRUE
            processor.step();
            processor.step();
            expect(processor.context.address).to.equal(13);

            // 1.4.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(14);

            // 1.5.ConditionClause:
            // PUSH LITERAL `none`
            // JUMP TO 1.6.ConditionClause ON NONE
            processor.step();
            processor.step();
            expect(processor.context.address).to.equal(17);

            // 1.5.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.6.ConditionClause:
            // PUSH LITERAL `true`
            // JUMP TO 1.IfStatementDone ON NONE
            processor.step();
            processor.step();
            expect(processor.context.address).to.equal(19);

            // 1.6.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone
            processor.step();
            expect(processor.context.address).to.equal(20);

            // 1.IfStatementDone:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(21);

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(17);
            expect(processor.task.balance).to.equal(983);
            expect(processor.task.status).to.equal('$active');
            expect(processor.task.stack.getSize()).to.equal(0);
        });

    });

    describe('Test the PUSH and POP instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/PUSH-POP.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.PushHandler:
            // PUSH HANDLER 3.PushSource
            processor.step();
            expect(processor.context.handlers.getSize()).to.equal(1);

            // 2.PushElement:
            // PUSH LITERAL "five"
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);

            // 3.PushSource:
            // PUSH LITERAL `{return prefix + name + suffix}`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);

            // 4.PopHandler:
            // POP HANDLER
            processor.step();
            expect(processor.context.handlers.getSize()).to.equal(0);

            // 5.PopComponent:
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(5);
            expect(processor.task.balance).to.equal(995);
            expect(processor.task.status).to.equal('$active');
        });

    });

    describe('Test the LOAD and STORE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/LOAD-STORE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.LoadParameter:
            // LOAD VARIABLE $x
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().toString()).to.equal(MESSAGE);

            // 2.StoreVariable:
            // STORE VARIABLE $foo
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.variables.getItem(2).value.toString()).to.equal(MESSAGE);

            // 3.LoadVariable:
            // LOAD VARIABLE $foo
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().toString()).to.equal(MESSAGE);

            // 4.StoreDraft:
            // STORE DRAFT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            // LOAD DRAFT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().toString()).to.equal(MESSAGE);

            // 5.StoreDocument:
            // STORE DOCUMENT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // 6.LoadDocument:
            // LOAD DOCUMENT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().toString()).to.equal(MESSAGE);

            // 7.StoreMessage:
            // STORE MESSAGE $queue
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // 8.LoadMessage:
            // LOAD MESSAGE $queue
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().getValue('$foo').toString()).to.equal('"bar"');

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(9);
            expect(processor.task.balance).to.equal(991);
            expect(processor.task.status).to.equal('$active');
        });

    });

    describe('Test the INVOKE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/INVOKE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.Invoke:
            // INVOKE $random
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);

            // 2.InvokeWithParameter:
            // PUSH LITERAL `3`
            processor.step();
            // INVOKE $factorial WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().toString()).to.equal('6');

            // 3.InvokeWith2Parameters:
            // PUSH LITERAL `5`
            processor.step();
            // INVOKE $sum WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().toString()).to.equal('11');

            // 4.InvokeWith3Parameters:
            // PUSH LITERAL `13`
            processor.step();
            // INVOKE $default WITH 3 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().toString()).to.equal('11');

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(7);
            expect(processor.task.balance).to.equal(993);
            expect(processor.task.status).to.equal('$active');
        });

    });

    describe('Test the EXECUTE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/EXECUTE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.Execute:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#TXGBQGFYQKCQY1ZAJY5J3S1Y8WV27XBZ,$version:v1,$digest:'XR24VNKN7G7D51T0LXLLNNNGVGJ0GDHBMFJSKKPBZD1DXX82AFA1S52NDAJYGHPQW16MWGHY3CGXQK6LCQ860HG9Q6NAHT2R421YJ4R']>`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            // EXECUTE $function1
            processor.step();
            expect(processor.task.contexts.getSize()).to.equal(1);
                // 1.ReturnStatement:
                // PUSH LITERAL `true`
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                // HANDLE RESULT
                processor.step();
                expect(processor.task.contexts.getSize()).to.equal(0);
                expect(processor.task.stack.topItem().isEqualTo(bali.Probability.TRUE)).to.equal(true);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // 2.ExecuteWithParameters:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#TXGBQGFYQKCQY1ZAJY5J3S1Y8WV27XBZ,$version:v1,$digest:'XR24VNKN7G7D51T0LXLLNNNGVGJ0GDHBMFJSKKPBZD1DXX82AFA1S52NDAJYGHPQW16MWGHY3CGXQK6LCQ860HG9Q6NAHT2R421YJ4R']>`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            // INVOKE $list
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // PUSH LITERAL `"parameter"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // INVOKE $parameters WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // EXECUTE $function2 WITH PARAMETERS
            processor.step();
            expect(processor.task.contexts.getSize()).to.equal(1);
                // 1.ReturnStatement:
                // LOAD VARIABLE $first
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                console.log('processor before: ' + processor);
                // HANDLE RESULT
                processor.step();
                console.log('processor after: ' + processor);
                expect(processor.task.contexts.getSize()).to.equal(0);
                expect(processor.task.stack.topItem().isEqualTo(new bali.Text('"parameter"'))).to.equal(true);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // 3.ExecuteOnTarget:
            // PUSH LITERAL `"target"`
            processor.step();
            // EXECUTE $message1 ON TARGET
            processor.step();

            // 4.ExecuteOnTargetWithParameters:
            // PUSH LITERAL `"target"`
            processor.step();
            // INVOKE $list
            processor.step();
            // PUSH LITERAL `"parameter1"`
            processor.step();
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            // PUSH LITERAL `"parameter2"`
            processor.step();
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            // EXECUTE $message2 ON TARGET WITH PARAMETERS
            processor.step();

        });

    });

});
