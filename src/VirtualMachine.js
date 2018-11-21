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
    var procedureContext = importProcedure(taskContext.procedureStack.topItem());

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
            processor.procedureContext.nextAddress <=
            processor.procedureContext.bytecodeInstructions.length;
    var isActive = processor.taskContext.processorStatus === ACTIVE;
    var hasTokens = processor.taskContext.accountBalance > 0;
    return hasInstructions && isActive && hasTokens;
}


/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
function fetchInstruction(processor) {
    if (isRunnable(processor)) {
        var nextAddress = processor.procedureContext.nextAddress;
        var currentInstruction = processor.procedureContext.bytecodeInstructions[nextAddress - 1];
        processor.procedureContext.currentInstruction = currentInstruction;
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
    var instruction = processor.procedureContext.currentInstruction;
    var operation = utilities.decodeOperation(instruction);
    var modifier = utilities.decodeModifier(instruction);
    var operand = utilities.decodeOperand(instruction);

    // pass execution off to the correct operation handler
    var index = (operation << 2) | modifier;  // index: [0..31]
    console.log('executing instruction ' + index.toString(16));
    instructionHandlers[index](processor, operand); // operand: [0..2047]

    // update the state of the task context
    processor.taskContext.clockCycles++;
    processor.taskContext.accountBalance--;
    processor.procedureContext.nextAddress++;
}


/*
 * This function finalizes the processing depending on the status of the task.
 */
function finalizeProcessing(processor) {
    console.log('finalizing processing...');
    switch (processor.taskContext.processorStatus) {
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
        '    $taskTag: ' + processor.taskContext.taskTag + '\n' +
        '    $accountTag: ' + processor.taskContext.accountTag + '\n' +
        '    $accountBalance: ' + processor.taskContext.accountBalance + '\n' +
        '    $clockCycles: ' + processor.taskContext.clockCycles + '\n' +
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
        '    $taskTag: ' + task.taskTag + '\n' +
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
    taskContext.taskTag = task.getValue('$taskTag');
    taskContext.accountTag = task.getValue('$accountTag');
    taskContext.accountBalance = task.getValue('$accountBalance').toNumber();
    taskContext.processorStatus = task.getValue('$processorStatus').toString();
    taskContext.clockCycles = task.getValue('$clockCycles').toNumber();
    taskContext.componentStack = task.getValue('$componentStack');
    taskContext.handlerStack = task.getValue('$handlerStack');
    taskContext.procedureStack = task.getValue('$procedureStack');
    return taskContext;
}


/*
 * This function exports a virtual machine task context to a Bali component.
 */
function exportTask(taskContext) {
    var task = bali.Catalog.fromCollection(taskContext);
    return task;
}


function extractProcedure(processor, targetComponent, typeReference, parameters, index) {
    var type = processor.cloud.retrieveType(typeReference);
    var key = type.getValue('$names').getString[index];
    var procedures = type.getValue('$procedures');
    var association = procedures.getValue(key);
    var procedureName = association.key;
    var procedure = association.value;

    // extract the literals from the type
    var iterator = type.getValue('$literals').getIterator();
    var literals = new bali.Set();
    while (iterator.hasNext()) {
        var literal = iterator.getNext();
        literals.addItem(literal);
    }

    var variables = new bali.Catalog();
    var bytes = procedure.getValue('$bytecode').getBuffer();
    var bytecodeInstructions = utilities.bytesToBytecode(bytes);
    var procedureContext = {
        targetComponent: targetComponent,
        typeReference: typeReference,
        procedureName: procedureName,
        parameters: parameters,
        literals: literals,
        variables: variables,
        bytecodeInstructions: bytecodeInstructions,
        currentInstruction: 0,
        nextAddress: 1
    };
    return procedureContext;
}


/*
 * This function imports a virtual machine procedure context from a Bali component.
 */
function importProcedure(procedure) {
    var bytes = procedure.getValue('$bytecodeInstructions').getBuffer();
    var bytecodeInstructions = utilities.bytesToBytecode(bytes);
    var procedureContext = {};
    procedureContext.targetComponent = procedure.getValue('$targetComponent');
    procedureContext.typeReference = procedure.getValue('$typeReference');
    procedureContext.procedureName = procedure.getValue('$procedureName');
    procedureContext.parameters = procedure.getValue('$parameters');
    procedureContext.literals = procedure.getValue('$literals');
    procedureContext.variables = procedure.getValue('$variables');
    procedureContext.bytecodeInstructions = bytecodeInstructions;
    procedureContext.currentInstruction = procedure.getValue('$currentInstruction').toNumber();
    procedureContext.nextAddress = procedure.getValue('$nextAddress').toNumber();
    return procedureContext;
}


/*
 * This function exports a virtual machine procedure context to a Bali component.
 */
function exportProcedure(procedureContext) {
    var bytes = utilities.bytecodeToBytes(procedureContext.bytecodeInstructions);
    var base16 = bali.codex.base16Encode(bytes);
    var source = "'%bytecodeInstructions'($base: 16, $mediatype: \"application/bcod\")";
    source = source.replace(/%bytecodeInstructions/, base16);
    var bytecodeInstructions = bali.parser.parseDocument(source);
    var procedure = new bali.Catalog();
    procedure.setValue('$targetComponent', procedureContext.targetComponent);
    procedure.setValue('$typeReference', procedureContext.typeReference);
    procedure.setValue('$procedureName', procedureContext.procedureName);
    procedure.setValue('$parameters', procedureContext.parameters);
    procedure.setValue('$literals', procedureContext.literals);
    procedure.setValue('$variables', procedureContext.variables);
    procedure.setValue('$bytecodeInstructions', bytecodeInstructions);
    procedure.setValue('$currentInstruction', procedureContext.currentInstruction);
    procedure.setValue('$nextAddress', procedureContext.nextAddress);
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
            var nextAddress = operand;
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON NONE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var nextAddress = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.componentStack.removeItem();
        // if the condition is 'none' then use the address as the next instruction to be executed
        if (bali.Template.NONE.isEqualTo(condition)) {
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON TRUE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var nextAddress = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.componentStack.removeItem();
        // if the condition is 'true' then use the address as the next instruction to be executed
        if (bali.Probability.TRUE.isEqualTo(condition)) {
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON FALSE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var nextAddress = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.componentStack.removeItem();
        // if the condition is 'false' then use the address as the next instruction to be executed
        if (bali.Probability.FALSE.isEqualTo(condition)) {
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // PUSH HANDLER label
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var handlerAddress = operand;
        // push the address of the current exception handlers onto the handlers stack
        processor.taskContext.handlerStack.addItem(new bali.Complex(handlerAddress.toString()));
    },

    // PUSH ELEMENT literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var literal = processor.procedureContext.literals.getItem(index);
        processor.taskContext.componentStack.addItem(literal);
    },

    // PUSH SOURCE literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var source = processor.procedureContext.literals.getItem(index);
        processor.taskContext.componentStack.addItem(source);
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
        processor.taskContext.handlerStack.removeItem();
    },

    // POP COMPONENT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // remove the component that is on top of the component stack since it was not used
        processor.taskContext.componentStack.removeItem();
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
        processor.taskContext.componentStack.addItem(variable);
    },

    // LOAD PARAMETER symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the parameter associated with the index
        var parameter = processor.procedureContext.parameters.getValue(index);
        processor.taskContext.componentStack.addItem(parameter);
    },

    // LOAD DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the reference associated with the index
        var reference = processor.procedureContext.variables.getItem(index).value.toString();
        // TODO: jump to exception handler if reference isn't a reference
        // retrieve the referenced document from the cloud repository
        var document;
        if (reference.includes('$digest:') && !reference.includes('$digest:none')) {
            document = processor.cloud.retrieveDocument(reference);
        } else {
            document = processor.cloud.retrieveDraft(reference);
        }
        // push the document on top of the component stack
        processor.taskContext.componentStack.addItem(document);
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
            processor.taskContext.componentStack.addItem(message);
        } else {
            // set the task status to 'waiting'
            processor.taskContext.processorStatus = WAITING;
            // make sure that the same instruction will be tried again
            processor.procedureContext.nextAddress--;
        }
    },

    // STORE VARIABLE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the component that is on top of the component stack off the stack
        var component = processor.taskContext.componentStack.removeItem();
        // and store the component in the variable associated with the index
        processor.procedureContext.variables.getItem(index).setValue(component);
    },

    // STORE DRAFT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the draft that is on top of the component stack off the stack
        var draft = processor.taskContext.componentStack.removeItem();
        // lookup the reference associated with the index operand
        var reference = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if reference isn't a reference
        // write the referenced draft to the cloud repository
        processor.cloud.saveDraft(reference, draft);
    },

    // STORE DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the document that is on top of the component stack off the stack
        var document = processor.taskContext.componentStack.removeItem();
        // lookup the reference associated with the index operand
        var reference = processor.procedureContext.variables.getItem(index).value;
        // TODO: jump to exception handler if reference isn't a reference
        // write the referenced document to the cloud repository
        var citation = processor.cloud.commitDocument(reference, document);
        processor.procedureContext.variables.getItem(index).setValue(citation);
    },

    // STORE MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the message that is on top of the component stack off the stack
        var message = processor.taskContext.componentStack.removeItem();
        // lookup the queue tag associated with the index operand
        var queue = processor.procedureContext.variables.getItem(index);
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
        processor.taskContext.componentStack.addItem(result);
    },

    // INVOKE symbol WITH PARAMETER
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter = processor.taskContext.componentStack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, [parameter]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.addItem(result);
    },

    // INVOKE symbol WITH 2 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter1 = processor.taskContext.componentStack.removeItem();
        var parameter2 = processor.taskContext.componentStack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, [parameter1, parameter2]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.addItem(result);
    },

    // INVOKE symbol WITH 3 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter1 = processor.taskContext.componentStack.removeItem();
        var parameter2 = processor.taskContext.componentStack.removeItem();
        var parameter3 = processor.taskContext.componentStack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.invokeByIndex(processor, index, [parameter1, parameter2, parameter3]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.addItem(result);
    },

    // EXECUTE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = bali.Template.NONE;
        var typeReference = processor.taskContext.componentStack.removeItem();
        var parameters = new bali.Parameters();
        var procedureContext = extractProcedure(processor, targetComponent, typeReference, parameters, index);
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.addItem(exportProcedure(procedureContext));
    },

    // EXECUTE symbol WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = bali.Template.NONE;
        var typeReference = processor.taskContext.componentStack.removeItem();
        var parameters = processor.taskContext.componentStack.removeItem();
        var procedureContext = extractProcedure(processor, targetComponent, typeReference, parameters, index);
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.addItem(exportProcedure(procedureContext));
    },

    // EXECUTE symbol ON TARGET
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = processor.taskContext.componentStack.removeItem();
        var typeReference = intrinsics.invokeByName(processor, '$getType', [targetComponent]);
        var parameters = new bali.Parameters();
        var procedureContext = extractProcedure(processor, targetComponent, typeReference, parameters, index);
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.addItem(exportProcedure(procedureContext));
    },

    // EXECUTE symbol ON TARGET WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = processor.taskContext.componentStack.removeItem();
        var typeReference = intrinsics.invokeByName(processor, '$getType', [targetComponent]);
        var parameters = processor.taskContext.componentStack.removeItem();
        var procedureContext = extractProcedure(processor, targetComponent, typeReference, parameters, index);
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.addItem(exportProcedure(procedureContext));
    },

    // HANDLE EXCEPTION
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // search up the stack for a handler
        while (!processor.taskContext.procedureStack.isEmpty()) {
            while (!processor.taskContext.handlerStack.isEmpty()) {
                // retrieve the address of the current exception handlers
                var handlerAddress = processor.taskContext.handlerStack.removeItem();
                // use that address as the next instruction to be executed
                processor.procedureContext.nextAddress = handlerAddress;
            }
            // pop the current exception off of the component stack
            var exception = processor.taskContext.componentStack.removeItem();
            // pop the current procedure context off of the context stack since it has no handlers
            processor.taskContext.procedureStack.removeItem();
            if (processor.taskContext.procedureStack.isEmpty()) {
                // we're done
                processor.taskContext.exception = exception;
                processor.taskContext.processorStatus = DONE;
            } else {
                processor.procedureContext = processor.taskContext.procedureStack.topItem();
                // push the result of the procedure call onto the top of the component stack
                processor.taskContext.componentStack.addItem(exception);
            }
        }
    },

    // HANDLE RESULT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // pop the result of the procedure call off of the component stack
        var result = processor.taskContext.componentStack.removeItem();
        // pop the current context off of the context stack since it is now out of scope
        processor.taskContext.procedureStack.removeItem();
        if (processor.taskContext.procedureStack.isEmpty()) {
            // we're done
            processor.taskContext.result = result;
            processor.taskContext.processorStatus = DONE;
        } else {
            processor.procedureContext = processor.taskContext.procedureStack.topItem();
            // push the result of the procedure call onto the top of the component stack
            processor.taskContext.componentStack.addItem(result);
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

