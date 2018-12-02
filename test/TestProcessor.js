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
[
    $protocol: v1
    $tag: #DB8M3B8N81H22ZBY6GZGLBN58SWAGQ6Z
    $version: v1
    $digest: '
        KWCJNLZZ3RA265YGRYB8KXPZX5HS0J2JBHQC8Q39T56T8Q5XQRH3QFHBL28X
        CZ8FNF9VSDW7L2X0HCRABFHV59BSHVRLNSLRBTMSYF8
    '
]
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
        '    $procedures: [\n' +
        '        [\n' +
        '            $type: none\n' +
        '            $name: $dummy\n' +
        '            $instruction: 0\n' +
        '            $address: 1\n' +
        '            $bytecode: %bytecode\n' +
        '            $parameters: %parameters\n' +
        '            $symbols: %symbols($type: $Set)\n' +
        '            $literals: %literals($type: $Set)\n' +
        '            $variables: %variables\n' +
        '            $handlers: []($type: $Stack)\n' +
        '        ]($type: $ProcedureContext)\n' +
        '    ]($type: $Stack)\n' +
        ']($type: $TaskContext)';

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
    var parameters = bali.Parameters.fromCollection(['$x', '$y']);
    var assemblerContext = assembler.analyzeInstructions(instructions, parameters);
    var symbols = assemblerContext.getValue('$symbols');
    var literals = assemblerContext.getValue('$literals');
    var variables = new bali.Catalog();
    var iterator = assemblerContext.getValue('$variables').getIterator();
    while (iterator.hasNext()) {
        var variable = iterator.getNext();
        variables.setValue(variable, bali.Filter.NONE);
    }
    variables.setValue('$target', bali.Filter.NONE);
    parameters = new bali.List();
    iterator = assemblerContext.getValue('$parameters').getIterator();
    while (iterator.hasNext()) {
        var parameter = iterator.getNext();
        parameters.addItem(parameter.key);
        variables.setValue(parameter.key, parameter.value);
    }
    variables.setValue('$queue', bali.parser.parseDocument(QUEUE));
    variables.setValue('$citation', bali.parser.parseDocument(CITATION));
    variables.setValue('$x', bali.parser.parseDocument(MESSAGE));
    variables.sortItems();
    var bytecode = assembler.assembleInstructions(instructions, assemblerContext);
    var bytes = utilities.bytecode.bytecodeToBytes(bytecode);
    var base16 = bali.codex.base16Encode(bytes, '            ');
    source = TASK_TEMPLATE;
    source = source.replace(/%symbols/, symbols.toDocument('            '));
    source = source.replace(/%literals/, literals.toDocument('            '));
    source = source.replace(/%parameters/, parameters.toDocument('            '));
    source = source.replace(/%variables/, variables.toDocument('            '));
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
            expect(processor.procedure.address).to.equal(1);

            // 1.IfStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedure.address).to.equal(2);

            // 1.1.ConditionClause:
            // PUSH ELEMENT `true`
            // JUMP TO 1.IfStatementDone ON FALSE
            processor.step();
            processor.step();
            expect(processor.procedure.address).to.equal(4);

            // 1.1.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedure.address).to.equal(5);

            // 1.2.ConditionClause:
            // PUSH ELEMENT `false`
            // JUMP TO 1.3.ConditionClause ON FALSE
            processor.step();
            processor.step();
            expect(processor.procedure.address).to.equal(8);

            // 1.2.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.3.ConditionClause:
            // PUSH ELEMENT `true`
            // JUMP TO 1.4.ConditionClause ON TRUE
            processor.step();
            processor.step();
            expect(processor.procedure.address).to.equal(11);

            // 1.3.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.4.ConditionClause:
            // PUSH ELEMENT `false`
            // JUMP TO 1.IfStatementDone ON TRUE
            processor.step();
            processor.step();
            expect(processor.procedure.address).to.equal(13);

            // 1.4.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedure.address).to.equal(14);

            // 1.5.ConditionClause:
            // PUSH ELEMENT `none`
            // JUMP TO 1.6.ConditionClause ON NONE
            processor.step();
            processor.step();
            expect(processor.procedure.address).to.equal(17);

            // 1.5.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.6.ConditionClause:
            // PUSH ELEMENT `true`
            // JUMP TO 1.IfStatementDone ON NONE
            processor.step();
            processor.step();
            expect(processor.procedure.address).to.equal(19);

            // 1.6.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone
            processor.step();
            expect(processor.procedure.address).to.equal(20);

            // 1.IfStatementDone:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedure.address).to.equal(21);

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
            expect(processor.procedure.address).to.equal(1);

            // 1.PushHandler:
            // PUSH HANDLER 3.PushSource
            processor.step();
            expect(processor.procedure.handlers.getSize()).to.equal(1);

            // 2.PushElement:
            // PUSH ELEMENT "five"
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);

            // 3.PushSource:
            // PUSH SOURCE `{return prefix + name + suffix}`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);

            // 4.PopHandler:
            // POP HANDLER
            processor.step();
            expect(processor.procedure.handlers.getSize()).to.equal(0);

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
            expect(processor.procedure.address).to.equal(1);

            // 1.LoadParameter:
            // LOAD VARIABLE $x
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().toString()).to.equal(MESSAGE);

            // 2.StoreVariable:
            // STORE VARIABLE $foo
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.procedure.variables.getItem(2).value.toString()).to.equal(MESSAGE);

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
            expect(processor.procedure.address).to.equal(1);

            // 1.Invoke:
            // INVOKE $random
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);

            // 2.InvokeWithParameter:
            // PUSH ELEMENT `3`
            processor.step();
            // INVOKE $factorial WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().toString()).to.equal('6');

            // 3.InvokeWith2Parameters:
            // PUSH ELEMENT `5`
            processor.step();
            // INVOKE $sum WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().toString()).to.equal('11');

            // 4.InvokeWith3Parameters:
            // PUSH ELEMENT `13`
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
            expect(processor.procedure.address).to.equal(1);

            // 1.Execute:
            // PUSH ELEMENT <bali:[$protocol:v1,$tag:#DB8M3B8N81H22ZBY6GZGLBN58SWAGQ6Z,$version:v1,$digest:'KWCJNLZZ3RA265YGRYB8KXPZX5HS0J2JBHQC8Q39T56T8Q5XQRH3QFHBL28XCZ8FNF9VSDW7L2X0HCRABFHV59BSHVRLNSLRBTMSYF8']>
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            // EXECUTE $function1
            processor.step();
            expect(processor.task.procedures.getSize()).to.equal(1);

            // 2.ExecuteWithParameters:
            // PUSH ELEMENT <bali:[$protocol:v1,$tag:#DB8M3B8N81H22ZBY6GZGLBN58SWAGQ6Z,$version:v1,$digest:'KWCJNLZZ3RA265YGRYB8KXPZX5HS0J2JBHQC8Q39T56T8Q5XQRH3QFHBL28XCZ8FNF9VSDW7L2X0HCRABFHV59BSHVRLNSLRBTMSYF8']>
            processor.step();
            // INVOKE $list
            processor.step();
            // PUSH ELEMENT `"parameter"`
            processor.step();
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            // EXECUTE $function2 WITH PARAMETERS
            processor.step();

            // 3.ExecuteWithTarget:
            // PUSH ELEMENT `"target"`
            processor.step();
            // EXECUTE $message1 ON TARGET
            processor.step();

            // 4.ExecuteWithTargetAndParameters:
            // PUSH ELEMENT `"target"`
            processor.step();
            // INVOKE $list
            processor.step();
            // PUSH ELEMENT `"parameter1"`
            processor.step();
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            // PUSH ELEMENT `"parameter2"`
            processor.step();
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            // EXECUTE $message2 ON TARGET WITH PARAMETERS
            processor.step();

        });

    });

});
