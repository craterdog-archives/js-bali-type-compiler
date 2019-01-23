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
const notary = require('bali-digital-notary');
const nebula = require('bali-nebula-api');
const notaryKey = notary.api(testDirectory);
const repository = nebula.local(testDirectory);
const api = nebula.api(notaryKey, repository);
const utilities = require('../src/utilities');
const vm = require('../src/processor');
const assembler = require('../src/compiler').assembler;

const EOL = '\n';  // POSIX end of line character


/*
    $tag: #K4A1J0ZPJP24R86HNWQKQA016WJSTLV5
    $digest: B024HXB94XN8HKNJNAFGTK8JGRDPQFKPST1BHNPTXHCHZBVQACRAD3WD0V2XTBAA9RKQLQ025944VZJQWK96V7JKD7KQJARCX0783MH
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
    var instructions = utilities.parser.parseDocument(source);
    var formatter = new utilities.Formatter('    ');
    instructions = formatter.formatInstructions(instructions);

    // create the compiled type context
    var literals = bali.List.fromSequential([
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
        "<bali:[$protocol:v1,$tag:#K4A1J0ZPJP24R86HNWQKQA016WJSTLV5,$version:v1,$digest:'B024HXB94XN8HKNJNAFGTK8JGRDPQFKPST1BHNPTXHCHZBVQACRAD3WD0V2XTBAA9RKQLQ025944VZJQWK96V7JKD7KQJARCX0783MH']>",
        bali.parse('[$foo: "bar"](\n' +
        "    <bali:[$protocol:v1,$tag:#K4A1J0ZPJP24R86HNWQKQA016WJSTLV5,$version:v1,$digest:'B024HXB94XN8HKNJNAFGTK8JGRDPQFKPST1BHNPTXHCHZBVQACRAD3WD0V2XTBAA9RKQLQ025944VZJQWK96V7JKD7KQJARCX0783MH']>\n" +
        ')'),
        '$foo',
        bali.parse('{return prefix + name}')
    ]);
    var constants = bali.Catalog.fromSequential({$constant: 5});
    var type = new bali.Catalog();
    type.setValue('$literals', literals);
    type.setValue('$constants', constants);


    // create the compiled procedure context
    var parameters = bali.List.fromSequential(['$y', '$x']);
    var variables = bali.List.fromSequential(['$citation', '$foo', '$queue', '$target']);
    var procedures = bali.List.fromSequential(['$function1', '$function2', '$message1', '$message2']);
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
        parameters.setValue(parameter, bali.Pattern.fromLiteral('none'));
    }
    parameters.setValue('$x', bali.parse(MESSAGE));

    // set variable values
    iterator = variables.getIterator();
    variables = new bali.Catalog();
    variables.setValue('$citation', bali.parse(CITATION));
    variables.setValue('$foo', bali.Pattern.fromLiteral('none'));
    variables.setValue('$queue', bali.parse(QUEUE));
    variables.setValue('$target', bali.Pattern.fromLiteral('none'));

    // construct the task context
    source = TASK_TEMPLATE;
    source = source.replace(/%bytecode/, bytecode.toDocument('            '));
    source = source.replace(/%literals/, literals.toDocument('            '));
    source = source.replace(/%constants/, constants.toDocument('            '));
    source = source.replace(/%parameters/, parameters.toDocument('            '));
    source = source.replace(/%variables/, variables.toDocument('            '));
    source = source.replace(/%procedures/, procedures.toDocument('            '));
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
            var processor = new vm.Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.IfStatement:
            // SKIP INSTRUCTION
            processor.step();
            expect(processor.context.address).to.equal(2);

            // 1.1.ConditionClause:
            // PUSH LITERAL `true`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Probability(true))).to.equal(true);
            expect(processor.context.address).to.equal(3);
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
            expect(processor.task.stack.getTop().isEqualTo(new bali.Probability(false))).to.equal(true);
            expect(processor.context.address).to.equal(6);
            // JUMP TO 1.3.ConditionClause ON FALSE
            processor.step();
            expect(processor.context.address).to.equal(8);

            // 1.2.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.3.ConditionClause:
            // PUSH LITERAL `true`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Probability(true))).to.equal(true);
            expect(processor.context.address).to.equal(9);
            // JUMP TO 1.4.ConditionClause ON TRUE
            processor.step();
            expect(processor.context.address).to.equal(11);

            // 1.3.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.4.ConditionClause:
            // PUSH LITERAL `false`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Probability(false))).to.equal(true);
            expect(processor.context.address).to.equal(12);
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
            expect(processor.task.stack.getTop().isEqualTo(bali.Pattern.fromLiteral('none'))).to.equal(true);
            expect(processor.context.address).to.equal(15);
            // JUMP TO 1.6.ConditionClause ON NONE
            processor.step();
            expect(processor.context.address).to.equal(17);

            // 1.5.1.EvaluateStatement:
            // JUMP TO 1.IfStatementDone

            // 1.6.ConditionClause:
            // PUSH LITERAL `true`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Probability(true))).to.equal(true);
            expect(processor.context.address).to.equal(18);
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
            var processor = new vm.Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.PushHandler:
            // PUSH HANDLER 3.PushLiteral
            processor.step();
            expect(processor.context.handlers.getSize()).to.equal(1);
            expect(processor.context.handlers.getTop().toNumber()).to.equal(3);
            expect(processor.context.address).to.equal(2);

            // 2.PushLiteral:
            // PUSH LITERAL `"five"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().isEqualTo(new bali.Text('five'))).to.equal(true);
            expect(processor.context.address).to.equal(3);

            // 3.PushLiteral:
            // PUSH LITERAL `{return prefix + name}`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.getTop().toString()).to.equal('{return prefix + name}');
            expect(processor.context.address).to.equal(4);

            // 4.PushConstant:
            // PUSH CONSTANT $constant
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.task.stack.getTop().toNumber()).to.equal(5);
            expect(processor.context.address).to.equal(5);

            // 5.PushParameter:
            // PUSH PARAMETER $y
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(4);
            expect(processor.task.stack.getTop().isEqualTo(bali.Pattern.fromLiteral('none'))).to.equal(true);
            expect(processor.context.address).to.equal(6);

            // 6.PopHandler:
            // POP HANDLER
            processor.step();
            expect(processor.context.handlers.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(7);

            // 7.PopComponent:
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.task.stack.getTop().toNumber()).to.equal(5);
            expect(processor.context.address).to.equal(8);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.getTop().toString()).to.equal('{return prefix + name}');
            expect(processor.context.address).to.equal(9);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().isEqualTo(new bali.Text('five'))).to.equal(true);
            expect(processor.context.address).to.equal(10);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(11);

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
            var processor = new vm.Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.LoadParameter:
            // PUSH PARAMETER $x
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(processor.context.address).to.equal(2);

            // 2.StoreVariable:
            // STORE VARIABLE $foo
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.variables.getItem(2).value.toString()).to.equal(MESSAGE);
            expect(processor.context.address).to.equal(3);

            // 3.LoadVariable:
            // LOAD VARIABLE $foo
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(processor.context.address).to.equal(4);

            // 4.StoreDraft:
            // STORE DRAFT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(5);
            // LOAD DRAFT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(processor.context.address).to.equal(6);

            // 5.StoreDocument:
            // STORE DOCUMENT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(7);

            // 6.LoadDocument:
            // LOAD DOCUMENT $citation
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().toString()).to.equal(MESSAGE);
            expect(processor.context.address).to.equal(8);

            // 7.StoreMessage:
            // STORE MESSAGE $queue
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(9);

            // 8.LoadMessage:
            // LOAD MESSAGE $queue
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().getValue('$foo').toString()).to.equal('"bar"');
            expect(processor.context.address).to.equal(10);

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
            var processor = new vm.Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.Invoke:
            // INVOKE $catalog
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.context.address).to.equal(2);

            // 2.InvokeWithParameter:
            // PUSH LITERAL `3`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Number(3))).to.equal(true);
            expect(processor.context.address).to.equal(3);
            // INVOKE $inverse WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.getTop().isEqualTo(new bali.Number(-3))).to.equal(true);
            expect(processor.context.address).to.equal(4);

            // 3.InvokeWith2Parameters:
            // PUSH LITERAL `5`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Number(5))).to.equal(true);
            expect(processor.context.address).to.equal(5);
            // INVOKE $sum WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.task.stack.getTop().isEqualTo(new bali.Number(2))).to.equal(true);
            expect(processor.context.address).to.equal(6);

            // 4.InvokeWith3Parameters:
            // PUSH LITERAL `"two"`
            processor.step();
            expect(processor.task.stack.getTop().isEqualTo(new bali.Text('two'))).to.equal(true);
            expect(processor.context.address).to.equal(7);
            // INVOKE $setValue WITH 3 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.task.stack.getTop().toString()).to.equal('[2: "two"]');
            expect(processor.context.address).to.equal(8);

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
            var processor = new vm.Processor(api, task);
            expect(processor.context.address).to.equal(1);

            // 1.Execute:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#...,$version:v1,$digest:'...']>`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.context.address).to.equal(2);
            // EXECUTE $function1
            processor.step();
                expect(processor.task.contexts.getSize()).to.equal(1);
                expect(processor.context.address).to.equal(1);
                // 1.ReturnStatement:
                // PUSH LITERAL `true`
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                expect(processor.context.address).to.equal(2);
                // HANDLE RESULT
                processor.step();
                expect(processor.task.contexts.getSize()).to.equal(0);
                expect(processor.task.stack.getTop().isEqualTo(new bali.Probability(true))).to.equal(true);
            expect(processor.context.address).to.equal(3);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(4);

            // 2.ExecuteWithParameters:
            // PUSH LITERAL `<bali:[$protocol:v1,$tag:#...,$version:v1,$digest:'...']>`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.context.address).to.equal(5);
            // INVOKE $list
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(6);
            // PUSH LITERAL `"parameter"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.context.address).to.equal(7);
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(8);
            // INVOKE $parameters WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(9);
            // EXECUTE $function2 WITH PARAMETERS
            processor.step();
                expect(processor.task.contexts.getSize()).to.equal(1);
                expect(processor.context.address).to.equal(1);
                // 1.ThrowStatement:
                // PUSH HANDLER 1.ThrowStatementHandlers
                processor.step();
                expect(processor.context.handlers.getSize()).to.equal(1);
                expect(processor.context.handlers.getTop().toString()).to.equal('6');
                expect(processor.context.address).to.equal(2);
                // PUSH LITERAL `none`
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                expect(processor.task.stack.getTop().toString()).to.equal('none');
                expect(processor.context.address).to.equal(3);
                // HANDLE EXCEPTION
                processor.step();
                expect(processor.context.handlers.isEmpty()).to.equal(true);
                expect(processor.context.address).to.equal(6);
                
                // 1.ThrowStatementDone:
                // POP HANDLER
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementHandlers:
                // SKIP INSTRUCTION
                processor.step();
                expect(processor.context.address).to.equal(7);
                
                // 1.1.HandleClause:
                // STORE VARIABLE $exception
                processor.step();
                expect(processor.context.address).to.equal(8);
                // LOAD VARIABLE $exception
                processor.step();
                expect(processor.context.address).to.equal(9);
                // LOAD VARIABLE $exception
                processor.step();
                expect(processor.context.address).to.equal(10);
                // PUSH LITERAL `"none"`
                processor.step();
                expect(processor.context.address).to.equal(11);
                // INVOKE $matches WITH 2 PARAMETERS
                processor.step();
                expect(processor.context.address).to.equal(12);
                // JUMP TO 1.ThrowStatementFailed ON FALSE
                processor.step();
                expect(processor.context.address).to.equal(13);
                // POP COMPONENT
                processor.step();
                expect(processor.context.address).to.equal(14);
                
                // 1.1.1.ReturnStatement:
                // PUSH PARAMETER $first
                processor.step();
                expect(processor.context.address).to.equal(15);
                // HANDLE RESULT
                processor.step();
                expect(processor.task.contexts.getSize()).to.equal(0);
                expect(processor.task.stack.getTop().toString()).to.equal('"parameter"');
                
                // 1.1.HandleClauseDone:
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementFailed:
                // HANDLE EXCEPTION
                
                // 1.ThrowStatementSucceeded:
                // SKIP INSTRUCTION
                
                // 2.ReturnStatement:
                // PUSH LITERAL `false`
                // HANDLE RESULT

            expect(processor.context.address).to.equal(10);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(11);

            // 3.ExecuteOnTarget:
            // PUSH LITERAL `[$foo: "bar"](<bali:[...]>)`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            var expected = processor.task.stack.getTop();
            expect(expected.toString().includes('[$foo: "bar"]')).to.equal(true);
            expect(processor.context.address).to.equal(12);
            // EXECUTE $message1 ON TARGET
            processor.step();
            expect(processor.task.contexts.getSize()).to.equal(1);
            expect(processor.task.stack.getSize()).to.equal(0);
                expect(processor.context.address).to.equal(1);
                // 1.ReturnStatement:
                // LOAD VARIABLE $target
                processor.step();
                expect(processor.task.stack.getSize()).to.equal(1);
                expect(processor.task.stack.getTop().isEqualTo(expected)).to.equal(true);
                expect(processor.context.address).to.equal(2);
                // HANDLE RESULT
                processor.step();
                expect(processor.task.contexts.getSize()).to.equal(0);
                expect(processor.task.stack.getTop().isEqualTo(expected)).to.equal(true);
            expect(processor.context.address).to.equal(13);
            // POP COMPONENT
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(0);
            expect(processor.context.address).to.equal(14);

            // 4.ExecuteOnTargetWithParameters:
            // PUSH LITERAL `[$foo: "bar"](<bali:[...]>)`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(1);
            expect(processor.context.address).to.equal(15);
            // INVOKE $list
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(16);
            // PUSH LITERAL `"parameter1"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.context.address).to.equal(17);
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(18);
            // PUSH LITERAL `"parameter2"`
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(3);
            expect(processor.context.address).to.equal(19);
            // INVOKE $addItem WITH 2 PARAMETERS
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(20);
            // INVOKE $parameters WITH PARAMETER
            processor.step();
            expect(processor.task.stack.getSize()).to.equal(2);
            expect(processor.context.address).to.equal(21);
            // EXECUTE $message2 ON TARGET WITH PARAMETERS
            processor.step();
            expect(processor.task.contexts.getSize()).to.equal(1);
            expect(processor.task.stack.getSize()).to.equal(0);
                expect(processor.context.address).to.equal(1);
                // 1.ThrowStatement:
                // PUSH HANDLER 1.ThrowStatementHandlers
                processor.step();
                expect(processor.context.address).to.equal(2);
                // PUSH PARAMETER $second
                processor.step();
                expect(processor.context.address).to.equal(3);
                // HANDLE EXCEPTION
                processor.step();
                expect(processor.context.address).to.equal(6);
                
                // 1.ThrowStatementDone:
                // POP HANDLER
                // JUMP TO 1.ThrowStatementSucceeded
                
                // 1.ThrowStatementHandlers:
                // SKIP INSTRUCTION
                processor.step();
                expect(processor.context.address).to.equal(7);
                
                // 1.1.HandleClause:
                // STORE VARIABLE $exception
                processor.step();
                expect(processor.context.address).to.equal(8);
                // LOAD VARIABLE $exception
                processor.step();
                expect(processor.context.address).to.equal(9);
                // LOAD VARIABLE $exception
                processor.step();
                expect(processor.context.address).to.equal(10);
                // PUSH LITERAL `"none"`
                processor.step();
                expect(processor.context.address).to.equal(11);
                // INVOKE $matches WITH 2 PARAMETERS
                processor.step();
                expect(processor.context.address).to.equal(12);
                // JUMP TO 1.ThrowStatementFailed ON FALSE
                processor.step();
                expect(processor.context.address).to.equal(17);
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

            // EOF
            expect(processor.step()).to.equal(false);
            expect(processor.task.clock).to.equal(49);
            expect(processor.task.balance).to.equal(951);
            expect(processor.task.status).to.equal('$done');
        });

    });

});
