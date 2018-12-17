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
var assembler = require('../src/compiler').assembler;
var Processor = require('../src/processor/Processor').Processor;

var EOL = '\n';  // POSIX end of line character


/*
<bali:[$protocol:v1,$tag:#H41VMPRJN3VPV1KG8FZPYD7KPXQLCPFY,$version:v1,$digest:'768D55GZ51HC1371HRZBDNZ8HRBR0PMZ4V70SZA3BAW05Q5YWWJK3LMLXHQ88Y8RR468LJTG6A7AJ642PS1MTXAF1BYWJ40M4891X70']>
 */

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
        '            $literals: %literals\n' +
        '            $constants: %constants\n' +
        '            $parameters: %parameters\n' +
        '            $variables: %variables\n' +
        '            $procedures: %procedures\n' +
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
    var formatter = new utilities.Formatter('    ');
    instructions = formatter.formatInstructions(instructions);

    // create the compiled type context
    var literals = bali.List.fromCollection([
        'true',
        'none',
        'false',
        '"five"',
        '"parameter"',
        '"parameter1"',
        '"parameter2"',
        13,
        1,
        3,
        5,
        "<bali:[]>",
        "<bali:[$protocol:v1,$tag:#H41VMPRJN3VPV1KG8FZPYD7KPXQLCPFY,$version:v1,$digest:'768D55GZ51HC1371HRZBDNZ8HRBR0PMZ4V70SZA3BAW05Q5YWWJK3LMLXHQ88Y8RR468LJTG6A7AJ642PS1MTXAF1BYWJ40M4891X70']>",
        bali.parser.parseDocument('[$foo: "bar"](\n' +
        "    <bali:[$protocol:v1,$tag:#H41VMPRJN3VPV1KG8FZPYD7KPXQLCPFY,$version:v1,$digest:'768D55GZ51HC1371HRZBDNZ8HRBR0PMZ4V70SZA3BAW05Q5YWWJK3LMLXHQ88Y8RR468LJTG6A7AJ642PS1MTXAF1BYWJ40M4891X70']>\n" +
        ')'),
        '$foo',
        bali.parser.parseDocument('{return prefix + name}')
    ]);
    var constants = bali.Catalog.fromCollection({constant: 5});
    var type = new bali.Catalog();
    type.setValue('$literals', literals);
    type.setValue('$constants', constants);


    // create the compiled procedure context
    var parameters = bali.List.fromCollection(['$y', '$x']);
    var variables = bali.List.fromCollection(['$citation', '$foo', '$queue', '$target']);
    var procedures = bali.List.fromCollection(['$function1', '$function2', '$message1', '$message2']);
    var addresses = new bali.Catalog();
    addresses.setValue('"3.PushLiteral"', 3);
    addresses.setValue('"1.3.ConditionClause"', 8);
    addresses.setValue('"1.4.ConditionClause"', 11);
    addresses.setValue('"1.6.ConditionClause"', 17);
    addresses.setValue('"1.IfStatementDone"', 20);
    var procedure = new bali.Catalog();
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
    parameters = new bali.Catalog();
    while (iterator.hasNext()) {
        var parameter = iterator.getNext();
        parameters.setValue(parameter, bali.Filter.NONE);
    }
    parameters.setValue('$x', bali.parser.parseDocument(MESSAGE));

    // set variable values
    iterator = variables.getIterator();
    variables = new bali.Catalog();
    variables.setValue('$citation', bali.parser.parseDocument(CITATION));
    variables.setValue('$foo', bali.Filter.NONE);
    variables.setValue('$queue', bali.parser.parseDocument(QUEUE));
    variables.setValue('$target', bali.Filter.NONE);

    // construct the task context
    source = TASK_TEMPLATE;
    source = source.replace(/%bytecode/, bytecode.toDocument('            '));
    source = source.replace(/%literals/, literals.toDocument('            '));
    source = source.replace(/%constants/, constants.toDocument('            '));
    source = source.replace(/%parameters/, parameters.toDocument('            '));
    source = source.replace(/%variables/, variables.toDocument('            '));
    source = source.replace(/%procedures/, procedures.toDocument('            '));
    var task = bali.parser.parseDocument(source);

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
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.IfStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(2);

            // 1.1.ConditionClause:
            // PUSH LITERAL `true`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(bali.Probability.TRUE)).to.equal(true);
            // JUMP TO 1.IfStatementDone ON FALSE
            processor.step();
            expect(processor.context.address).to.equal(4);

            // 1.1.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(5);

            // 1.2.ConditionClause:
            // PUSH LITERAL `false`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(bali.Probability.FALSE)).to.equal(true);
            // JUMP TO 1.3.ConditionClause ON FALSE
            processor.step();
            expect(processor.context.address).to.equal(8);

            // 1.2.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.3.ConditionClause:
            // PUSH LITERAL `true`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(bali.Probability.TRUE)).to.equal(true);
            // JUMP TO 1.4.ConditionClause ON TRUE
            processor.step();
            expect(processor.context.address).to.equal(11);

            // 1.3.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.4.ConditionClause:
            // PUSH LITERAL `false`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(bali.Probability.FALSE)).to.equal(true);
            // JUMP TO 1.IfStatementDone ON TRUE
            processor.step();
            expect(processor.context.address).to.equal(13);

            // 1.4.1.EvaluateStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(14);

            // 1.5.ConditionClause:
            // PUSH LITERAL `none`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(bali.Filter.NONE)).to.equal(true);
            // JUMP TO 1.6.ConditionClause ON NONE
            processor.step();
            expect(processor.context.address).to.equal(17);

            // 1.5.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.6.ConditionClause:
            // PUSH LITERAL `true`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(bali.Probability.TRUE)).to.equal(true);
            // JUMP TO 1.IfStatementDone ON NONE
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
            var testFile = 'test/processor/PUSH-POP.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.PushHandler:
            // PUSH HANDLER 3.PushLiteral
            processor.step();
            expect(processor.context.handlers.getSize()).to.equal(1);
            expect(processor.context.handlers.topItem().toNumber()).to.equal(3);

            // 2.PushLiteral:
            // PUSH LITERAL "five"
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().isEqualTo(new bali.Text('"five"'))).to.equal(true);

            // 3.PushLiteral:
            // PUSH LITERAL `{return prefix + name}`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().toString()).to.equal('{return prefix + name}');

            // 4.PushConstant:
            // PUSH CONSTANT $constant
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.task.stack.topItem().toNumber()).to.equal(5);

            // 5.PushParameter:
            // PUSH PARAMETER $y
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(4);
            expect(processor.task.stack.topItem().isEqualTo(bali.Filter.NONE)).to.equal(true);

            // 6.PopHandler:
            // POP HANDLER
            processor.step();
            expect(processor.context.handlers.getSize()).to.equal(0);

            // 7.PopComponent:
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.task.stack.topItem().toNumber()).to.equal(5);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().toString()).to.equal('{return prefix + name}');
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().isEqualTo(new bali.Text('"five"'))).to.equal(true);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(10);
            expect(processor.task.balance).to.equal(990);
            expect(processor.task.status).to.equal('$active');
        });

    });

    describe('Test the LOAD and STORE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/LOAD-STORE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.LoadParameter:
            // PUSH PARAMETER $x
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
            var testFile = 'test/processor/INVOKE.basm';
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
            expect(processor.task.stack.topItem().isEqualTo(new bali.Complex(3))).to.equal(true);
            // INVOKE $factorial WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().isEqualTo(new bali.Complex(6))).to.equal(true);

            // 3.InvokeWith2Parameters:
            // PUSH LITERAL `5`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(new bali.Complex(5))).to.equal(true);
            // INVOKE $sum WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.topItem().isEqualTo(new bali.Complex(11))).to.equal(true);

            // 4.InvokeWith3Parameters:
            // PUSH LITERAL `13`
            processor.step();
            expect(processor.task.stack.topItem().isEqualTo(new bali.Complex(13))).to.equal(true);
            // INVOKE $default WITH 3 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.topItem().isEqualTo(new bali.Complex(11))).to.equal(true);

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(7);
            expect(processor.task.balance).to.equal(993);
            expect(processor.task.status).to.equal('$active');
        });

    });

    describe('Test the EXECUTE instructions.', function() {

        it('should create the initial task context', function() {
            var testFile = 'test/processor/EXECUTE-HANDLE.basm';
            task = loadTask(testFile);
            expect(task).to.exist;  // jshint ignore:line
        });

        it('should execute the test instructions', function() {
            var processor = new Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.Execute:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#...,$version:v1,$digest:'...']>`
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
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#...,$version:v1,$digest:'...']>`
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
                // 1.ThrowStatement:
                // PUSH HANDLER 1.ThrowStatementHandlers
                processor.step();
                expect(processor.context.handlers.getSize()).to.equal(1);
                // PUSH LITERAL `none`
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                // HANDLE EXCEPTION
                processor.step();
                
                // 1.ThrowStatementDone:
                // POP HANDLER
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementHandlers:
                // SKIP INSTRUCTION
                processor.step();
                
                // 1.1.HandleClause:
                // STORE VARIABLE $exception
                processor.step();
                // LOAD VARIABLE $exception
                processor.step();
                // LOAD VARIABLE $exception
                processor.step();
                // PUSH LITERAL `none`
                processor.step();
                // INVOKE $matches WITH 2 PARAMETERS
                processor.step();
                // JUMP TO 1.ThrowStatementFailed ON FALSE
                processor.step();
                // POP COMPONENT
                processor.step();
                
                // 1.1.1.ReturnStatement:
                // PUSH PARAMETER $first
                processor.step();
                // HANDLE RESULT
                processor.step();
                
                // 1.1.HandleClauseDone:
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementFailed:
                // HANDLE EXCEPTION
                
                // 1.ThrowStatementSucceeded:
                // SKIP INSTRUCTION
                
                // 2.ReturnStatement:
                // PUSH LITERAL `false`
                // HANDLE RESULT

            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // 3.ExecuteOnTarget:
            // PUSH LITERAL `[$foo: "bar"](<bali:[...]>)`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            var expected = processor.task.stack.topItem();
            expect(expected.toString().includes('[$foo: "bar"]')).to.equal(true);
            // EXECUTE $message1 ON TARGET
            processor.step();
            expect(processor.task.contexts.getSize()).to.equal(1);
            expect(processor.task.stack.getSize()).to.equal(0);
                // 1.ReturnStatement:
                // LOAD VARIABLE $target
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                expect(processor.task.stack.topItem().isEqualTo(expected)).to.equal(true);
                // HANDLE RESULT
                processor.step();
                expect(processor.task.contexts.getSize()).to.equal(0);
                expect(processor.task.stack.topItem().isEqualTo(expected)).to.equal(true);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

            // 4.ExecuteOnTargetWithParameters:
            // PUSH LITERAL `[$foo: "bar"](<bali:[...]>)`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            // INVOKE $list
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // PUSH LITERAL `"parameter1"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // PUSH LITERAL `"parameter2"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // INVOKE $parameters WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            // EXECUTE $message2 ON TARGET WITH PARAMETERS
            processor.step();
            expect(processor.task.contexts.getSize()).to.equal(1);
            expect(processor.task.stack.getSize()).to.equal(0);
                // 1.ThrowStatement:
                // PUSH HANDLER 1.ThrowStatementHandlers
                processor.step();
                // PUSH PARAMETER $second
                processor.step();
                // HANDLE EXCEPTION
                processor.step();
                
                // 1.ThrowStatementDone:
                // POP HANDLER
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementHandlers:
                // SKIP INSTRUCTION
                processor.step();
                
                // 1.1.HandleClause:
                // STORE VARIABLE $exception
                processor.step();
                // LOAD VARIABLE $exception
                processor.step();
                // LOAD VARIABLE $exception
                processor.step();
                // PUSH LITERAL `none`
                processor.step();
                // INVOKE $matches WITH 2 PARAMETERS
                processor.step();
                // JUMP TO 1.ThrowStatementFailed ON FALSE
                processor.step();
                // POP COMPONENT
                
                // 1.1.1.ReturnStatement:
                // PUSH LITERAL `true`
                // HANDLE RESULT
                
                // 1.1.HandleClauseDone:
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementFailed:
                // HANDLE EXCEPTION
                processor.step();
                
                // 1.ThrowStatementSucceeded:
                // SKIP INSTRUCTION
                
                // 2.ReturnStatement:
                // PUSH LITERAL `false`
                // HANDLE RESULT

            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);

        });

    });

});
