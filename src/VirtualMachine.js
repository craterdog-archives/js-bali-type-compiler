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
var bali = require('bali-document-notation');
var component = require('bali-primitive-types');
var compiler = require('bali-type-compiler');
var intrinsics = require('./IntrinsicFunctions');

var ACTIVE = '$active';
var WAITING = '$waiting';
var DONE = '$done';


exports.fromTask = function(cloud, task) {
    var taskContext = importTask(task);
    var procedureContext = importProcedure(taskContext.procedureStack.popItem());

    return {

        cloud: cloud,
        taskContext: taskContext,
        procedureContext: procedureContext,

        /*
         * This method executes the next instruction in the current task.
         */
        step: function() {
            var wasFetched = fetchInstruction(this);
            if (wasFetched) executeInstruction(this);
            return wasFetched;
        },

        /*
         * This method executes all of the instructions in the current task until the end of the
         * instructions is reached, the account balance reaches zero, or the task is waiting
         * to receive a message from a queue.
         */
        run: function() {
            while (fetchInstruction(this)) executeInstruction(this);
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
    var operation = compiler.bytecode.decodeOperation(instruction);
    var modifier = compiler.bytecode.decodeModifier(instruction);
    var operand = compiler.bytecode.decodeOperand(instruction);

    // pass execution off to the correct operation handler
    var index = (operation << 2) | modifier;  // index: [0..31]
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
    var event = '[\n' +
        '    $eventType: $completion\n' +
        '    $taskTag: ' + processor.taskContext.taskTag + '\n' +
        '    $accountTag: ' + processor.taskContext.accountTag + '\n' +
        '    $accountBalance: ' + processor.taskContext.accountBalance + '\n' +
        '    $clockCycles: ' + processor.taskContext.clockCycles + '\n' +
        '    $result: ' + processor.taskContext.result.toSource('    ') + '\n' +
        ']';
    processor.cloud.publishEvent(event);
}


/*
 * This function publishes a task step event to the global event queue.
 */
function publishSuspensionEvent(processor) {
    var task = exportTask(processor.taskContext);
    var event = '[\n' +
        '    $eventType: $suspension\n' +
        '    $taskTag: ' + task.taskTag + '\n' +
        '    $taskContext: ' + task.toSource('    ') + '\n' +
        ']';
    processor.cloud.publishEvent(event);
}


/*
 * This function places the current task context on the queue for tasks awaiting messages
 */
function queueTaskContext(processor) {
    // convert the task context into its corresponding Bali source document
    var task = exportTask(processor.taskContext);
    var document = task.toSource();
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
    taskContext.processorStatus = task.getValue('$processorStatus').toSource();
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
    var task = component.Catalog.fromCollection(taskContext);
    return task;
}


/*
 * This function imports a virtual machine procedure context from a Bali component.
 */
function importProcedure(procedure) {
    var procedureContext = {};
    procedureContext.targetComponent = procedure.getValue('$targetComponent');
    procedureContext.typeReference = procedure.getValue('$typeReference');
    procedureContext.procedureName = procedure.getValue('$procedureName');
    procedureContext.parameterValues = procedure.getValue('$parameterValues');
    procedureContext.literalValues = procedure.getValue('$literalValues');
    procedureContext.variableValues = procedure.getValue('$variableValues');
    var bytes = procedure.getValue('$bytecodeInstructions').value;
    procedureContext.bytecodeInstructions = compiler.bytecode.bytesToBytecode(bytes);
    procedureContext.currentInstruction = procedure.getValue('$currentInstruction').toNumber();
    procedureContext.nextAddress = procedure.getValue('$nextAddress').toNumber();
    return procedureContext;
}


/*
 * This function exports a virtual machine procedure context to a Bali component.
 */
function exportProcedure(procedureContext) {
    var bytes = compiler.bytecode.bytecodeToBytes(procedureContext.bytecodeInstructions);
    var base16 = bali.codex.base16Encode(bytes);
    var source = "'%bytecodeInstructions'($base: 16, $mediatype: \"application/bcod\")";
    source = source.replace(/%bytecodeInstructions/, base16);
    var tree = bali.parser.parseComponent(source);
    var bytecodeInstructions = procedureContext.bytecodeInstructions;  // must save and restore!!!
    procedureContext.bytecodeInstructions = component.importer.fromTree(tree);
    var procedure = component.Catalog.fromCollection(procedureContext);
    procedureContext.bytecodeInstructions = bytecodeInstructions;
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
        var condition = processor.taskContext.componentStack.popItem();
        // if the condition is 'none' then use the address as the next instruction to be executed
        if (component.Template.NONE.equalTo(condition)) {
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON TRUE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var nextAddress = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.componentStack.popItem();
        // if the condition is 'true' then use the address as the next instruction to be executed
        if (component.Probability.TRUE.equalTo(condition)) {
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON FALSE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var nextAddress = operand;
        // pop the condition component off the component stack
        var condition = processor.taskContext.componentStack.popItem();
        // if the condition is 'false' then use the address as the next instruction to be executed
        if (component.Probability.FALSE.equalTo(condition)) {
            processor.procedureContext.nextAddress = nextAddress - 1;  // account for auto-increment
        }
    },

    // PUSH HANDLER label
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var handlerAddress = operand;
        // push the address of the current exception handlers onto the handlers stack
        processor.taskContext.handlerStack.pushItem(new component.Complex(handlerAddress.toString()));
    },

    // PUSH ELEMENT literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var literal = processor.procedureContext.literalValues.getItem(index);
        processor.taskContext.componentStack.pushItem(literal);
    },

    // PUSH CODE literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var code = processor.procedureContext.literalValues.getItem(index);
        processor.taskContext.componentStack.pushItem(code);
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
        processor.taskContext.handlerStack.popItem();
    },

    // POP COMPONENT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // remove the component that is on top of the component stack since it was not used
        processor.taskContext.componentStack.popItem();
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
        var variable = processor.procedureContext.variableValues.getItem(index);
        processor.taskContext.componentStack.pushItem(variable);
    },

    // LOAD PARAMETER symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the parameter associated with the index
        var parameter = processor.procedureContext.parameterValues.getItem(index);
        processor.taskContext.componentStack.pushItem(parameter);
    },

    // LOAD DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the reference associated with the index
        var reference = processor.procedureContext.variableValues.getItem(index).toString();
        // TODO: jump to exception handler if reference isn't a reference
        // retrieve the referenced document from the cloud repository
        var document;
        if (reference.includes('$digest:') && !reference.includes('$digest:none')) {
            document = processor.cloud.retrieveDocument(reference);
        } else {
            document = processor.cloud.retrieveDraft(reference);
        }
        // push the document on top of the component stack
        processor.taskContext.componentStack.pushItem(document);
    },

    // LOAD MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the queue tag associated with the index
        var queue = processor.procedureContext.variableValues.getItem(index);
        // TODO: jump to exception handler if queue isn't a tag
        // attempt to receive a message from the queue in the cloud
        var message = processor.cloud.receiveMessage(queue);
        if (message) {
            processor.taskContext.componentStack.pushItem(message);
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
        var component = processor.taskContext.componentStack.popItem();
        // and store the component in the variable associated with the index
        processor.procedureContext.variableValues.setItem(index, component);
    },

    // STORE DRAFT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the draft that is on top of the component stack off the stack
        var draft = processor.taskContext.componentStack.popItem();
        // lookup the reference associated with the index operand
        var reference = processor.procedureContext.variableValues.getItem(index);
        // TODO: jump to exception handler if reference isn't a reference
        // write the referenced draft to the cloud repository
        processor.cloud.saveDraft(reference, draft);
    },

    // STORE DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the document that is on top of the component stack off the stack
        var document = processor.taskContext.componentStack.popItem();
        // lookup the reference associated with the index operand
        var reference = processor.procedureContext.variableValues.getItem(index);
        // TODO: jump to exception handler if reference isn't a reference
        // write the referenced document to the cloud repository
        var citation = processor.cloud.commitDocument(reference, document);
        processor.procedureContext.variableValues.setItem(index, citation);
    },

    // STORE MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the message that is on top of the component stack off the stack
        var message = processor.taskContext.componentStack.popItem();
        // lookup the queue tag associated with the index operand
        var queue = processor.procedureContext.variableValues.getItem(index);
        // TODO: jump to exception handler if queue isn't a tag
        // send the message to the queue in the cloud
        processor.cloud.queueMessage(queue, message);
    },

    // INVOKE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // create an empty parameters list for the intrinsic function call
        var parameters = component.Parameters.fromCollection([]);
        // call the intrinsic function associated with the index operand
        var result = intrinsics.intrinsicFunctions[index].apply(processor, parameters);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.pushItem(result);
    },

    // INVOKE symbol WITH PARAMETER
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter = processor.taskContext.componentStack.popItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.intrinsicFunctions[index].apply(processor, [parameter]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.pushItem(result);
    },

    // INVOKE symbol WITH 2 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter1 = processor.taskContext.componentStack.popItem();
        var parameter2 = processor.taskContext.componentStack.popItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.intrinsicFunctions[index].apply(processor, [parameter1, parameter2]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.pushItem(result);
    },

    // INVOKE symbol WITH 3 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        // pop the parameters to the intrinsic function call off of the component stack
        var parameter1 = processor.taskContext.componentStack.popItem();
        var parameter2 = processor.taskContext.componentStack.popItem();
        var parameter3 = processor.taskContext.componentStack.popItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.intrinsicFunctions[index].apply(processor, [parameter1, parameter2, parameter3]);
        // push the result of the function call onto the top of the component stack
        processor.taskContext.componentStack.pushItem(result);
    },

    // EXECUTE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = component.Template.NONE;
        var typeReference = processor.taskContext.componentStack.popItem();
        var type = processor.cloud.retrieveDocument(typeReference);
        var context = bali.parser.analyzeType(type);
        var key = context.names[index];
        var procedures = type.getValue('$procedures');
        var association = procedures.getValue(key);
        var procedureName = association.key;
        var procedure = association.value;
        var parameterValues = component.List.fromScratch();
        var variableValues = component.List.fromScratch();
        var bytes = procedure.getValue('$bytecode').value;
        var bytecodeInstructions = compiler.bytecode.bytesToBytecode(bytes);
        var procedureContext = {
            targetComponent: targetComponent,
            typeReference: typeReference,
            procedureName: procedureName,
            parameterValues: parameterValues,
            literalValues: context.literals,
            variableValues: variableValues,
            bytecodeInstructions: bytecodeInstructions,
            currentInstruction: 0,
            nextAddress: 1
        };
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.pushItem(exportProcedure(procedureContext));
    },

    // EXECUTE symbol WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = component.Template.NONE;
        var typeReference = processor.taskContext.componentStack.popItem();
        var type = processor.cloud.retrieveDocument(typeReference);
        var context = bali.parser.analyzeType(type);
        var key = context.names[index];
        var procedures = type.getValue('$procedures');
        var association = procedures.getValue(key);
        var procedureName = association.key;
        var procedure = association.value;
        var parameterValues = processor.taskContext.componentStack.popItem();
        var variableValues = component.List.fromScratch();
        var bytes = procedure.getValue('$bytecode').value;
        var bytecodeInstructions = compiler.bytecode.bytesToBytecode(bytes);
        var procedureContext = {
            targetComponent: targetComponent,
            typeReference: typeReference,
            procedureName: procedureName,
            parameterValues: parameterValues,
            literalValues: context.literals,
            variableValues: variableValues,
            bytecodeInstructions: bytecodeInstructions,
            currentInstruction: 0,
            nextAddress: 1
        };
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.pushItem(exportProcedure(procedureContext));
    },

    // EXECUTE symbol ON TARGET
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = processor.taskContext.componentStack.popItem();
        var typeReference = processor.taskContext.componentStack.popItem();
        var type = processor.cloud.retrieveDocument(typeReference);
        var context = bali.parser.analyzeType(type);
        var key = context.names[index];
        var procedures = type.getValue('$procedures');
        var association = procedures.getValue(key);
        var procedureName = association.key;
        var procedure = association.value;
        var parameterValues = component.List.fromScratch();
        var variableValues = component.List.fromScratch();
        var bytes = procedure.getValue('$bytecode').value;
        var bytecodeInstructions = compiler.bytecode.bytesToBytecode(bytes);
        var procedureContext = {
            targetComponent: targetComponent,
            typeReference: typeReference,
            procedureName: procedureName,
            parameterValues: parameterValues,
            literalValues: context.literals,
            variableValues: variableValues,
            bytecodeInstructions: bytecodeInstructions,
            currentInstruction: 0,
            nextAddress: 1
        };
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.pushItem(exportProcedure(procedureContext));
    },

    // EXECUTE symbol ON TARGET WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand - 1;  // JS zero based indexing
        var targetComponent = processor.taskContext.componentStack.popItem();
        var typeReference = processor.taskContext.componentStack.popItem();
        var type = processor.cloud.retrieveDocument(typeReference);
        var context = bali.parser.analyzeType(type);
        var key = context.names[index];
        var procedures = type.getValue('$procedures');
        var association = procedures.getValue(key);
        var procedureName = association.key;
        var procedure = association.value;
        var parameterValues = processor.taskContext.componentStack.popItem();
        var variableValues = component.List.fromScratch();
        var bytes = procedure.getValue('$bytecode').value;
        var bytecodeInstructions = compiler.bytecode.bytesToBytecode(bytes);
        var procedureContext = {
            targetComponent: targetComponent,
            typeReference: typeReference,
            procedureName: procedureName,
            parameterValues: parameterValues,
            literalValues: context.literals,
            variableValues: variableValues,
            bytecodeInstructions: bytecodeInstructions,
            currentInstruction: 0,
            nextAddress: 1
        };
        processor.procedureContext = procedureContext;
        processor.taskContext.procedureStack.pushItem(exportProcedure(procedureContext));
    },

    // HANDLE EXCEPTION
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // search up the stack for a handler
        while (!processor.taskContext.procedureStack.isEmpty()) {
            while (!processor.taskContext.handlerStack.isEmpty()) {
                // retrieve the address of the current exception handlers
                var handlerAddress = processor.taskContext.handlerStack.popItem();
                // use that address as the next instruction to be executed
                processor.procedureContext.nextAddress = handlerAddress;
            }
            // pop the current exception off of the component stack
            var exception = processor.taskContext.componentStack.popItem();
            // pop the current procedure context off of the context stack since it has no handlers
            processor.taskContext.procedureStack.popItem();
            if (processor.taskContext.procedureStack.isEmpty()) {
                // we're done
                processor.taskContext.exception = exception;
                processor.taskContext.processorStatus = DONE;
            } else {
                processor.procedureContext = processor.taskContext.procedureStack.getTop();
                // push the result of the procedure call onto the top of the component stack
                processor.taskContext.componentStack.pushItem(exception);
            }
        }
    },

    // HANDLE RESULT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // pop the result of the procedure call off of the component stack
        var result = processor.taskContext.componentStack.popItem();
        // pop the current context off of the context stack since it is now out of scope
        processor.taskContext.procedureStack.popItem();
        if (processor.taskContext.procedureStack.isEmpty()) {
            // we're done
            processor.taskContext.result = result;
            processor.taskContext.processorStatus = DONE;
        } else {
            processor.procedureContext = processor.taskContext.procedureStack.getTop();
            // push the result of the procedure call onto the top of the component stack
            processor.taskContext.componentStack.pushItem(result);
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

