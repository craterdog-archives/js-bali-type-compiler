/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/*
 * This class defines the Bali Virtual Machine™.
 */
var bali = require('bali-component-framework');
var utilities = require('./BytecodeUtilities');
var intrinsics = require('./IntrinsicFunctions');

var ACTIVE = '$active';
var WAITING = '$waiting';
var DONE = '$done';


exports.fromTask = function(cloud, task) {
    var taskContext = importTask(task);
    var procedureContext = importProcedure(taskContext.procedures.removeItem());

    return {

        cloud: cloud,
        taskContext: taskContext,
        procedureContext: procedureContext,

        /*
         * This method executes the next instruction in the current task.
         */
        step: function() {
            var wasFetched = fetchInstruction(this);
            if (wasFetched) {
                executeInstruction(this);
            } else {
                finalizeProcessing(this);
            }
            return wasFetched;
        },

        /*
         * This method executes all of the instructions in the current task until the end of the
         * instructions is reached, the account balance reaches zero, or the task is waiting
         * to receive a message from a queue.
         */
        run: function() {
            while (fetchInstruction(this)) {
                executeInstruction(this);
            }
            finalizeProcessing(this);
        },

        toString: function() {
            var task = exportTask(taskContext);
            var procedure = exportProcedure(procedureContext);
            var string = '$task: ' + task + '\n$procedure: ' + procedure;
            return string;
        }
    };
};


/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
function isRunnable(processor) {
    var hasInstructions = processor.procedureContext &&
            processor.procedureContext.address <= processor.procedureContext.bytecode.length;
    var isActive = processor.taskContext.status === ACTIVE;
    var hasTokens = processor.taskContext.balance > 0;
    return hasInstructions && isActive && hasTokens;
}


/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
function fetchInstruction(processor) {
    if (isRunnable(processor)) {
        var address = processor.procedureContext.address;
        var instruction = processor.procedureContext.bytecode[address - 1];
        processor.procedureContext.instruction = instruction;
        return true;
    } else {
        return false;
    }
}


/*
 * This function executes the next 16 bit bytecode instruction.
 */
function executeInstruction(processor) {
    // decode the bytecode instruction
    var instruction = processor.procedureContext.instruction;
    var operation = utilities.decodeOperation(instruction);
    var modifier = utilities.decodeModifier(instruction);
    var operand = utilities.decodeOperand(instruction);

    // pass execution off to the correct operation handler
    var index = (operation << 2) | modifier;  // index: [0..31]
    instructionHandlers[index](processor, operand); // operand: [0..2047]

    // update the state of the task context
    processor.taskContext.clock++;
    processor.taskContext.balance--;
    processor.procedureContext.address++;
}


/*
 * This function finalizes the processing depending on the status of the task.
 */
function finalizeProcessing(processor) {
    switch (processor.taskContext.status) {
        case ACTIVE:
            // the task hit a break point or the account balance is zero so notify any interested parties
            publishSuspensionEvent(processor);
            break;
        case WAITING:
            // the task is waiting on a message so requeue the task context
            queueTaskContext(processor);
            break;
        case DONE:
            // the task completed successfully or with an exception so notify any interested parties
            publishCompletionEvent(processor);
            break;
        default:
    }
}


/*
 * This function publishes a task completion event to the global event queue.
 */
function publishCompletionEvent(processor) {
    var source = '[\n' +
        '    $eventType: $completion\n' +
        '    $tag: ' + processor.taskContext.tag + '\n' +
        '    $account: ' + processor.taskContext.account + '\n' +
        '    $balance: ' + processor.taskContext.balance + '\n' +
        '    $clock: ' + processor.taskContext.clock + '\n' +
        '    $result: ' + processor.taskContext.result.toDocument('    ') + '\n' +
        ']';
    var event = bali.parser.parseDocument(source);
    var citation = processor.cloud.createDraft(event);
    var draft = processor.cloud.retrieveDraft(citation);
    processor.cloud.publishEvent(draft);
}


/*
 * This function publishes a task step event to the global event queue.
 */
function publishSuspensionEvent(processor) {
    var task = exportTask(processor.taskContext);
    var source = '[\n' +
        '    $eventType: $suspension\n' +
        '    $tag: ' + task.tag + '\n' +
        '    $taskContext: ' + task.toDocument('    ') + '\n' +
        ']';
    var event = bali.parser.parseDocument(source);
    var citation = processor.cloud.createDraft(event);
    var draft = processor.cloud.retrieveDraft(citation);
    processor.cloud.publishEvent(draft);
}


/*
 * This function places the current task context on the queue for tasks awaiting messages
 */
function queueTaskContext(processor) {
    // convert the task context into its corresponding Bali source document
    var task = exportTask(processor.taskContext);
    var document = task.toString();
    // queue up the task for a new virtual machine
    var WAIT_QUEUE = '#3F8TVTX4SVG5Z12F3RMYZCTWHV2VPX4K';
    processor.cloud.queueMessage(WAIT_QUEUE, document);
}


/*
 * This function imports a virtual machine task context from a Bali component.
 */
function importTask(task) {
    var taskContext = {};
    taskContext.tag = task.getValue('$tag');
    taskContext.account = task.getValue('$account');
    taskContext.balance = task.getValue('$balance').toNumber();
    taskContext.status = task.getValue('$status').toString();
    taskContext.clock = task.getValue('$clock').toNumber();
    taskContext.stack = task.getValue('$stack');
    taskContext.procedures = task.getValue('$procedures');
    return taskContext;
}


/*
 * This function exports a virtual machine task context to a Bali component.
 */
function exportTask(taskContext) {
    var task = bali.Catalog.fromCollection(taskContext);
    return task;
}


function extractProcedure(processor, target, type, parameters, index) {
    var document = processor.cloud.retrieveType(type);
    var key = document.getValue('$names').getString[index];
    var procedures = document.getValue('$procedures');
    var association = procedures.getValue(key);
    var procedure = association.value;
    var name = association.key;
    var bytes = procedure.getValue('$bytecode').getBuffer();
    var bytecode = utilities.bytesToBytecode(bytes);
    var iterator = document.getValue('$literals').getIterator();
    var literals = new bali.Set();
    while (iterator.hasNext()) {
        var literal = iterator.getNext();
        literals.addItem(literal);
    }
    var variables = new bali.Catalog();
    var handlers = new bali.Stack();
    var procedureContext = {
        target: target,
        type: type,
        name: name,
        instruction: 0,
        address: 1,
        bytecode: bytecode,
        parameters: parameters,
        literals: literals,
        variables: variables,
        handlers: handlers
    };
    return procedureContext;
}


/*
 * This function imports a virtual machine procedure context from a Bali component.
 */
function importProcedure(procedure) {
    var bytes = procedure.getValue('$bytecode').getBuffer();
    var bytecode = utilities.bytesToBytecode(bytes);
    var procedureContext = {};
    procedureContext.target = procedure.getValue('$target');
    procedureContext.type = procedure.getValue('$type');
    procedureContext.name = procedure.getValue('$name');
    procedureContext.instruction = procedure.getValue('$instruction').toNumber();
    procedureContext.address = procedure.getValue('$address').toNumber();
    procedureContext.bytecode = bytecode;
    procedureContext.parameters = procedure.getValue('$parameters');
    procedureContext.literals = procedure.getValue('$literals');
    procedureContext.variables = procedure.getValue('$variables');
    procedureContext.handlers = procedure.getValue('$handlers');
    return procedureContext;
}


/*
 * This function exports a virtual machine procedure context to a Bali component.
 */
function exportProcedure(procedureContext) {
    var bytes = utilities.bytecodeToBytes(procedureContext.bytecode);
    var base16 = bali.codex.base16Encode(bytes);
    var source = "'%bytecode'($base: 16, $mediatype: \"application/bcod\")";
    source = source.replace(/%bytecode/, base16);
    var bytecode = bali.parser.parseDocument(source);
    var procedure = new bali.Catalog();
    procedure.setValue('$target', procedureContext.target);
    procedure.setValue('$type', procedureContext.type);
    procedure.setValue('$name', procedureContext.name);
    procedure.setValue('$instruction', procedureContext.instruction);
    procedure.setValue('$address', procedureContext.address);
    procedure.setValue('$bytecode', bytecode);
    procedure.setValue('$parameters', procedureContext.parameters);
    procedure.setValue('$literals', procedureContext.literals);
    procedure.setValue('$variables', procedureContext.variables);
    procedure.setValue('$handlers', procedureContext.handlers);
    return procedure;
}


/*
 * This list contains the instruction handlers for each type of machine instruction.
 */
var instructionHandlers = [
    // JUMP TO label
    function(processor, operand) {
        // if the operand is not zero then use it as the next instruction to be executed,
        // otherwise it is a SKIP INSTRUCTION (aka NOOP)
        if (operand) {
            var address = operand;
            processor.procedureContext.address = address - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON NONE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var address = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.stack.removeItem();
        // if the condition is 'none' then use the address as the next instruction to be executed
        if (bali.Template.NONE.isEqualTo(condition)) {
            processor.procedureContext.address = address - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON TRUE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var address = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.stack.removeItem();
        // if the condition is 'true' then use the address as the next instruction to be executed
        if (bali.Probability.TRUE.isEqualTo(condition)) {
            processor.procedureContext.address = address - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON FALSE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var address = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.stack.removeItem();
        // if the condition is 'false' then use the address as the next instruction to be executed
        if (bali.Probability.FALSE.isEqualTo(condition)) {
            processor.procedureContext.address = address - 1;  // account for auto-increment
        }
    },

    // PUSH HANDLER label
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var handlerAddress = operand;
        // push the address of the current exception handlers onto the handlers stack
        processor.procedureContext.handlers.addItem(new bali.Complex(handlerAddress.toString()));
    },

    // PUSH ELEMENT literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var literal = processor.procedureContext.literals.getItem(index);
        processor.taskContext.stack.addItem(literal);
    },

    // PUSH SOURCE literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var source = processor.procedureContext.literals.getItem(index);
        processor.taskContext.stack.addItem(source);
    },

    // UNIMPLEMENTED PUSH OPERATION
    function(processor, operand) {
        throw new Error('An unimplemented PUSH operation was attempted: 13');
    },

    // POP HANDLER
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // remove the current exception handler address from the top of the handlers stack
        // since it is no longer in scope
        processor.procedureContext.handlers.removeItem();
    },

    // POP COMPONENT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // remove the component that is on top of the component stack since it was not used
        processor.taskContext.stack.removeItem();
    },

    // UNIMPLEMENTED POP OPERATION
    function(processor, operand) {
        throw new Error('An unimplemented POP operation was attempted: 22');
    },

    // UNIMPLEMENTED POP OPERATION
    function(processor, operand) {
        throw new Error('An unimplemented POP operation was attempted: 23');
    },

    // LOAD VARIABLE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the variable associated with the index
        var variable = processor.procedureContext.variables.getItem(index).value;
        processor.taskContext.stack.addItem(variable);
    },

    // LOAD PARAMETER symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the parameter associated with the index
        var parameter = processor.procedureContext.parameters.getItem(index).value;
        processor.taskContext.stack.addItem(parameter);
    },

    // LOAD DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the citation associated with the index
        var citation = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited document from the cloud repository
        var document;
        if (citation.getValue('$digest').isEqualTo(bali.Template.NONE)) {
            document = processor.cloud.retrieveDraft(citation);
        } else {
            document = processor.cloud.retrieveDocument(citation);
        }
        // push the document on top of the component stack
        processor.taskContext.stack.addItem(document);
    },

    // LOAD MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the queue tag associated with the index
        var queue = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if queue isn't a tag
        // attempt to receive a message from the queue in the cloud
        var message = processor.cloud.receiveMessage(queue);
        if (message) {
            processor.taskContext.stack.addItem(message);
        } else {
            // set the task status to 'waiting'
            processor.taskContext.status = WAITING;
            // make sure that the same instruction will be tried again
            processor.procedureContext.address--;
        }
    },

    // STORE VARIABLE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the component that is on top of the component stack off the stack
        var component = processor.taskContext.stack.removeItem();
        // and store the component in the variable associated with the index
        processor.procedureContext.variables.getItem(index).setValue(component);
    },

    // STORE DRAFT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the draft that is on top of the component stack off the stack
        var draft = processor.taskContext.stack.removeItem();
        // lookup the citation associated with the index operand
        var citation = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // write the cited draft to the cloud repository
        processor.cloud.saveDraft(citation, draft);
    },

    // STORE DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the document that is on top of the component stack off the stack
        var document = processor.taskContext.stack.removeItem();
        // lookup the citation associated with the index operand
        var citation = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // write the cited document to the cloud repository
        citation = processor.cloud.commitDocument(citation, document);
        processor.procedureContext.variables.getItem(index).setValue(citation);
    },

    // STORE MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the message that is on top of the component stack off the stack
        var message = processor.taskContext.stack.removeItem();
        // lookup the queue tag associated with the index operand
        var queue = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if queue isn't a tag
        // send the message to the queue in the cloud
        processor.cloud.queueMessage(queue, message);
    },

    // INVOKE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, []);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.stack.addItem(result);
    },

    // INVOKE symbol WITH PARAMETER
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter = processor.taskContext.stack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, [parameter]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.stack.addItem(result);
    },

    // INVOKE symbol WITH 2 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter1 = processor.taskContext.stack.removeItem();
        var parameter2 = processor.taskContext.stack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, [parameter1, parameter2]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.stack.addItem(result);
    },

    // INVOKE symbol WITH 3 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter1 = processor.taskContext.stack.removeItem();
        var parameter2 = processor.taskContext.stack.removeItem();
        var parameter3 = processor.taskContext.stack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, [parameter1, parameter2, parameter3]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.stack.addItem(result);
    },

    // EXECUTE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.taskContext.procedures.addItem(exportProcedure(processor.procedureContext));
        // setup the new procedure context
        var index = operand - 1;  // JS zero based indexing
        var target = bali.Template.NONE;
        var type = processor.taskContext.stack.removeItem();
        var parameters = new bali.Catalog();
        var procedureContext = extractProcedure(processor, target, type, parameters, index);
        processor.procedureContext = procedureContext;
    },

    // EXECUTE symbol WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.taskContext.procedures.addItem(exportProcedure(processor.procedureContext));
        // setup the new procedure context
        var index = operand - 1;  // JS zero based indexing
        var target = bali.Template.NONE;
        var type = processor.taskContext.stack.removeItem();
        var parameters = processor.taskContext.stack.removeItem();
        var procedureContext = extractProcedure(processor, target, type, parameters, index);
        processor.procedureContext = procedureContext;
    },

    // EXECUTE symbol ON TARGET
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.taskContext.procedures.addItem(exportProcedure(processor.procedureContext));
        // setup the new procedure context
        var index = operand - 1;  // JS zero based indexing
        var target = processor.taskContext.stack.removeItem();
        var type = intrinsics.invokeByName(processor, '$getType', [target]);
        var parameters = new bali.Catalog();
        var procedureContext = extractProcedure(processor, target, type, parameters, index);
        processor.procedureContext = procedureContext;
    },

    // EXECUTE symbol ON TARGET WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.taskContext.procedures.addItem(exportProcedure(processor.procedureContext));
        // setup the new procedure context
        var index = operand - 1;  // JS zero based indexing
        var target = processor.taskContext.stack.removeItem();
        var type = intrinsics.invokeByName(processor, '$getType', [target]);
        var parameters = processor.taskContext.stack.removeItem();
        var procedureContext = extractProcedure(processor, target, type, parameters, index);
        processor.procedureContext = procedureContext;
    },

    // HANDLE EXCEPTION
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // search up the stack for a handler
        while (processor.procedureContext) {
            if (processor.procedureContext.handlers.isEmpty()) {
                if (!processor.taskContext.procedures.isEmpty()) {
                    // raise the exception up to the calling procedure
                    processor.procedureContext = importProcedure(processor.taskContext.procedures.removeItem());
                } else {
                    // unhandled exception
                    processor.procedureContext = undefined;
                    var exception = processor.taskContext.stack.removeItem();
                    processor.taskContext.exception = exception;
                    processor.taskContext.status = DONE;
                }
            }
            // retrieve the address of the next exception handler
            var handlerAddress = processor.procedureContext.handlers.removeItem().toNumber();
            // use that address as the next instruction to be executed
            processor.procedureContext.address = handlerAddress;
        }
    },

    // HANDLE RESULT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        if (!processor.taskContext.procedures.isEmpty()) {
            // return the result to the calling procedure
            processor.procedureContext = importProcedure(processor.taskContext.procedures.removeItem());
        } else {
            // we're done
            processor.procedureContext = undefined;
            var result = processor.taskContext.stack.removeItem();
            processor.taskContext.result = result;
            processor.taskContext.status = DONE;
        }
    },

    // UNIMPLEMENTED HANDLE OPERATION
    function(processor, operand) {
        throw new Error('An unimplemented HANDLE operation was attempted: 72');
    },

    // UNIMPLEMENTED HANDLE OPERATION
    function(processor, operand) {
        throw new Error('An unimplemented HANDLE operation was attempted: 73');
    }

];

