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
var cloud = require('bali-cloud-api');

var testDirectory = 'test/config/';
var notaryKey = notary.api(testDirectory);
var repository = cloud.local(testDirectory);
var api = cloud.api(notaryKey, repository);

var parser = require('../src/ProcedureParser');
var compiler = require('../src/TypeCompiler');
var assembler = require('../src/ProcedureAssembler');
var utilities = require('../src/BytecodeUtilities');
var VirtualMachine = require('../src/VirtualMachine');


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
        '    $taskTag: #Y29YH82BHG4SPTGWGFRYBL4RQ33GTX59\n' +
        '    $accountTag: #GTDHQ9B8ZGS7WCBJJJBFF6KDCCF55R2P\n' +
        '    $accountBalance: 1000\n' +
        '    $processorStatus: $active\n' +
        '    $clockCycles: 0\n' +
        '    $componentStack: []($type: $Stack)\n' +
        '    $handlerStack: []($type: $Stack)\n' +
        '    $procedureStack: [\n' +
        '        [\n' +
        '            $target: none\n' +
        '            $type: none\n' +
        '            $name: $dummy\n' +
        '            $parameters: [\n' +
        '                1: "This is a text string."\n' +
        '                2: 2\n' +
        '                3: 5\n' +
        '            ]($type: $Parameters)\n' +
        '            $literals: %literals($type: $Set)\n' +
        '            $variables: [\n' +
        '                $x: none\n' +
        '                $reference: <bali:[$protocol:v1,$tag:#LGLHW28KH99AXZZDTFXV14BX8CF2F68N,$version:v2.3,$digest:none]>\n' +
        '                $tag: #ZQMQ8BGN43Y146KCXX24ZASF0GDJ5YDZ\n' +
        '            ]\n' +
        '            $bytecode: %bytecode\n' +
        '            $instruction: 0\n' +
        '            $address: 1\n' +
        '        ]($type: $ProcedureContext)\n' +
        '    ]($type: $Stack)\n' +
        ']($type: $TaskContext)';


function generateTaskContext(filename) {
    var source = fs.readFileSync(filename, 'utf8');
    var procedure = parser.parseProcedure(source, true);
    var assemblerContext = assembler.analyzeProcedure(procedure);
    var literals = bali.List.fromCollection(assemblerContext.getValue('$literals'));
    var bytecode = assembler.assembleProcedure(procedure, assemblerContext);
    var bytes = utilities.bytecodeToBytes(bytecode);
    var base16 = bali.codex.base16Encode(bytes, '            ');
    source = TASK_TEMPLATE;
    source = source.replace(/%literals/, literals.toDocument('            '));
    source = source.replace(/%bytecode/, "'" + base16 + "'");
    var taskContext = bali.parser.parseDocument(source);
    return taskContext;
}


describe('Bali Virtual Machine™', function() {
    var taskContext;

    describe('Test the JUMP instruction.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/JUMP.basm';
            taskContext = generateTaskContext(testFile);
            expect(taskContext).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = VirtualMachine.fromTask(api, taskContext);
            expect(processor.procedureContext.address).to.equal(1);

            // 1.IfStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedureContext.address).to.equal(2);

            // 1.1.ConditionClause:
            // PUSH ELEMENT `true`
            // JUMP TO 1.IfStatementDone ON FALSE
            processor.step();
            processor.step();
            expect(processor.procedureContext.address).to.equal(4);

            // 1.1.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedureContext.address).to.equal(5);

            // 1.2.ConditionClause:
            // PUSH ELEMENT `false`
            // JUMP TO 1.3.ConditionClause ON FALSE
            processor.step();
            processor.step();
            expect(processor.procedureContext.address).to.equal(8);

            // 1.2.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.3.ConditionClause:
            // PUSH ELEMENT `true`
            // JUMP TO 1.4.ConditionClause ON TRUE
            processor.step();
            processor.step();
            expect(processor.procedureContext.address).to.equal(11);

            // 1.3.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.4.ConditionClause:
            // PUSH ELEMENT `false`
            // JUMP TO 1.IfStatementDone ON TRUE
            processor.step();
            processor.step();
            expect(processor.procedureContext.address).to.equal(13);

            // 1.4.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedureContext.address).to.equal(14);

            // 1.5.ConditionClause:
            // PUSH ELEMENT `none`
            // JUMP TO 1.6.ConditionClause ON NONE
            processor.step();
            processor.step();
            expect(processor.procedureContext.address).to.equal(17);

            // 1.5.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.6.ConditionClause:
            // PUSH ELEMENT `true`
            // JUMP TO 1.IfStatementDone ON NONE
            processor.step();
            processor.step();
            expect(processor.procedureContext.address).to.equal(19);

            // 1.6.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone
            processor.step();
            expect(processor.procedureContext.address).to.equal(20);

            // 1.IfStatementDone:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.procedureContext.address).to.equal(21);

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.taskContext.clockCycles).to.equal(17);
            expect(processor.taskContext.accountBalance).to.equal(983);
            expect(processor.taskContext.processorStatus).to.equal('$active');
            expect(processor.taskContext.componentStack.getSize()).to.equal(0);
        });

    });

    describe('Test the PUSH and POP instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/PUSH-POP.basm';
            taskContext = generateTaskContext(testFile);
            expect(taskContext).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = VirtualMachine.fromTask(api, taskContext);
            expect(processor.procedureContext.address).to.equal(1);

            // 1.PushHandler:
            // PUSH HANDLER 3.PushSource
            processor.step();
            expect(processor.taskContext.handlerStack.getSize()).to.equal(1);

            // 2.PushElement:
            // PUSH ELEMENT "five"
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);

            // 3.PushSource:
            // PUSH SOURCE `{return prefix + name + suffix}`
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(2);

            // 4.PopHandler:
            // POP HANDLER
            processor.step();
            expect(processor.taskContext.handlerStack.getSize()).to.equal(0);

            // 5.PopComponent:
            // POP COMPONENT
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.taskContext.clockCycles).to.equal(5);
            expect(processor.taskContext.accountBalance).to.equal(995);
            expect(processor.taskContext.processorStatus).to.equal('$active');
        });

    });

    describe('Test the LOAD and STORE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/LOAD-STORE.basm';
            taskContext = generateTaskContext(testFile);
            expect(taskContext).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = VirtualMachine.fromTask(api, taskContext);
            expect(processor.procedureContext.address).to.equal(1);

            // 1.LoadParameter:
            // LOAD PARAMETER $x
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);
            expect(processor.taskContext.componentStack.topItem().toString()).to.equal('"This is a text string."');

            // 2.StoreVariable:
            // STORE VARIABLE $foo
            console.log('processor: ' + processor);
            processor.step();
            console.log('processor: ' + processor);
            expect(processor.taskContext.componentStack.getSize()).to.equal(0);
            expect(processor.procedureContext.variables.getItem(1).value.toString()).to.equal('"This is a text string."');

            // 3.LoadVariable:
            // LOAD VARIABLE $foo
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);
            expect(processor.taskContext.componentStack.topItem().toString()).to.equal('"This is a text string."');

            // 4.StoreDraft:
            // STORE DRAFT $document
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(0);
            // LOAD DOCUMENT $document
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);
            expect(processor.taskContext.componentStack.topItem().getDocumentContent().toString()).to.equal('"This is a text string."');

            // 5.StoreDocument:
            // STORE DOCUMENT $document
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(0);

            // 6.LoadDocument:
            // LOAD DOCUMENT $document
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);
            expect(processor.taskContext.componentStack.topItem().getDocumentContent().toString()).to.equal('"This is a text string."');

            // 7.StoreMessage:
            // STORE MESSAGE $queue
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(0);

            // 8.LoadMessage:
            // LOAD MESSAGE $queue
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);
            expect(processor.taskContext.componentStack.topItem().getDocumentContent().toString()).to.equal('"This is a text string."');

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.taskContext.clockCycles).to.equal(9);
            expect(processor.taskContext.accountBalance).to.equal(991);
            expect(processor.taskContext.processorStatus).to.equal('$active');
        });

    });

    describe('Test the INVOKE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/INVOKE.basm';
            taskContext = generateTaskContext(testFile);
            expect(taskContext).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = VirtualMachine.fromTask(api, taskContext);
            expect(processor.procedureContext.address).to.equal(1);

            // 1.Invoke:
            // INVOKE $random
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);

            // 2.InvokeWithParameter:
            // PUSH ELEMENT `3`
            processor.step();
            // INVOKE $factorial WITH PARAMETER
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(2);
            expect(processor.taskContext.componentStack.topItem().toString()).to.equal('6');

            // 3.InvokeWith2Parameters:
            // PUSH ELEMENT `5`
            processor.step();
            // INVOKE $sum WITH 2 PARAMETERS
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(2);
            expect(processor.taskContext.componentStack.topItem().toString()).to.equal('11');

            // 4.InvokeWith3Parameters:
            // PUSH ELEMENT `13`
            processor.step();
            // INVOKE $default WITH 3 PARAMETERS
            processor.step();
            expect(processor.taskContext.componentStack.getSize()).to.equal(1);
            expect(processor.taskContext.componentStack.topItem().toString()).to.equal('11');

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.taskContext.clockCycles).to.equal(7);
            expect(processor.taskContext.accountBalance).to.equal(993);
            expect(processor.taskContext.processorStatus).to.equal('$active');
        });

    });

/*
    describe('Test the EXECUTE and HANDLE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/instructions/EXECUTE-HANDLE.basm';
            taskContext = generateTaskContext(testFile);
            expect(taskContext).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = VirtualMachine.fromTask(api, taskContext);
            expect(processor.procedureContext.address).to.equal(1);
            // TODO: add implementation
        });

    });
*/

});
