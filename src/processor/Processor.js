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
 * This class implements the virtual machine for The Bali Nebula™.
 */
var bali = require('bali-component-framework');
var utilities = require('../utilities/Bytecode');
var intrinsics = require('../utilities/Intrinsics');

var ACTIVE = '$active';
var WAITING = '$waiting';
var DONE = '$done';


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new processor to execute the specified task.
 * 
 * @constructor
 * @param {Object} nebula An object that implements the Bali Nebula API™.
 * @param {Catalog} task The task for the new processor to execute.
 * @returns {Processor} The new processor loaded with the task.
 */
function Processor(nebula, task) {
    this.nebula = nebula;
    this.task = importTask(task);
    this.procedure = importProcedure(this.task.procedures.removeItem());
    return this;
}
Processor.prototype.constructor = Processor;
exports.Processor = Processor;


/**
 * This method executes the next instruction in the current task.
 * 
 * @returns {Boolean} Whether or not an instruction was executed.
 */
Processor.prototype.step = function() {
    var wasFetched = fetchInstruction(this);
    if (wasFetched) {
        executeInstruction(this);
    } else {
        finalizeProcessing(this);
    }
    return wasFetched;
};


/**
 * This method executes all of the instructions in the current task until one of the
 * following:
 * <pre>
 *  * the end of the instructions is reached,
 *  * an unhandled exception is thrown,
 *  * the account balance reaches zero,
 *  * or the task is waiting to receive a message from a queue.
 * </pre>
 */
Processor.prototype.run = function() {
    while (fetchInstruction(this)) {
        executeInstruction(this);
    }
    finalizeProcessing(this);
};


/**
 * This method returns a string representation of the current processor state using
 * Bali Document Notation™.
 * 
 * @returns {String} A string representation of the current processor state.
 */
Processor.prototype.toString = function() {
    var task = exportTask(this.task);
    task.getValue('$procedures').addItem(exportProcedure(this.procedure));
    var string = task.toString();
    return string;
};


// PRIVATE FUNCTIONS

/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
function isRunnable(processor) {
    var hasInstructions = processor.procedure &&
            processor.procedure.address <= processor.procedure.bytecode.length;
    var isActive = processor.task.status === ACTIVE;
    var hasTokens = processor.task.balance > 0;
    return hasInstructions && isActive && hasTokens;
}


/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
function fetchInstruction(processor) {
    if (isRunnable(processor)) {
        var address = processor.procedure.address;
        var instruction = processor.procedure.bytecode[address - 1];
        processor.procedure.instruction = instruction;
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
    var instruction = processor.procedure.instruction;
    var operation = utilities.decodeOperation(instruction);
    var modifier = utilities.decodeModifier(instruction);
    var operand = utilities.decodeOperand(instruction);

    // pass execution off to the correct operation handler
    var index = (operation << 2) | modifier;  // index: [0..31]
    instructionHandlers[index](processor, operand); // operand: [0..2047]

    // update the state of the task context
    processor.task.clock++;
    processor.task.balance--;
    processor.procedure.address++;
}


/*
 * This function finalizes the processing depending on the status of the task.
 */
function finalizeProcessing(processor) {
    switch (processor.task.status) {
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
        '    $tag: ' + processor.task.tag + '\n' +
        '    $account: ' + processor.task.account + '\n' +
        '    $balance: ' + processor.task.balance + '\n' +
        '    $clock: ' + processor.task.clock + '\n' +
        '    $result: ' + processor.task.result.toDocument('    ') + '\n' +
        ']';
    var event = bali.parser.parseDocument(source);
    var citation = processor.nebula.createDraft(event);
    var draft = processor.nebula.retrieveDraft(citation);
    processor.nebula.publishEvent(draft);
}


/*
 * This function publishes a task step event to the global event queue.
 */
function publishSuspensionEvent(processor) {
    var task = exportTask(processor.task);
    var source = '[\n' +
        '    $eventType: $suspension\n' +
        '    $tag: ' + task.tag + '\n' +
        '    $task: ' + task.toDocument('    ') + '\n' +
        ']';
    var event = bali.parser.parseDocument(source);
    var citation = processor.nebula.createDraft(event);
    var draft = processor.nebula.retrieveDraft(citation);
    processor.nebula.publishEvent(draft);
}


/*
 * This function places the current task context on the queue for tasks awaiting messages
 */
function queueTaskContext(processor) {
    // convert the task context into its corresponding Bali source document
    var task = exportTask(processor.task);
    var document = task.toString();
    // queue up the task for a new virtual machine
    var WAIT_QUEUE = '#3F8TVTX4SVG5Z12F3RMYZCTWHV2VPX4K';
    processor.nebula.queueMessage(WAIT_QUEUE, document);
}


/*
 * This function imports a virtual machine task context from a Bali catalog.
 */
function importTask(catalog) {
    var task = {};
    task.tag = catalog.getValue('$tag');
    task.account = catalog.getValue('$account');
    task.balance = catalog.getValue('$balance').toNumber();
    task.status = catalog.getValue('$status').toString();
    task.clock = catalog.getValue('$clock').toNumber();
    task.stack = catalog.getValue('$stack');
    task.procedures = catalog.getValue('$procedures');
    return task;
}


/*
 * This function exports a virtual machine task context to a Bali component.
 */
function exportTask(task) {
    var catalog = bali.Catalog.fromCollection(task);
    return catalog;
}


function extractProcedure(processor, target, type, parameters, index) {
    var name = processor.procedure.getValue('$symbols').getItem(index);
    var procedures = processor.nebula.retrieveType(type);
    var procedure = procedures.getValue(name);
    var bytes = procedure.getValue('$bytecode').getBuffer();
    var bytecode = utilities.bytesToBytecode(bytes);
    var symbols = procedure.getValue('$symbols');
    var literals = procedure.getValue('$literals');
    var variables = new bali.Catalog();
    var iterator = procedure.getValue('$variables').getIterator();
    while (iterator.hasNext()) {
        var variable = iterator.getNext();
        variables.setValue(variable, bali.Filter.NONE);
    }
    var handlers = new bali.Stack();
    procedure = {
        target: target,
        type: type,
        name: name,
        instruction: 0,
        address: 1,
        bytecode: bytecode,
        parameters: parameters,
        symbols: symbols,
        literals: literals,
        variables: variables,
        handlers: handlers
    };
    return procedure;
}


/*
 * This function imports a virtual machine procedure context from a Bali catalog.
 */
function importProcedure(catalog) {
    var bytes = catalog.getValue('$bytecode').getBuffer();
    var bytecode = utilities.bytesToBytecode(bytes);
    var procedure = {};
    procedure.target = catalog.getValue('$target');
    procedure.type = catalog.getValue('$type');
    procedure.name = catalog.getValue('$name');
    procedure.instruction = catalog.getValue('$instruction').toNumber();
    procedure.address = catalog.getValue('$address').toNumber();
    procedure.bytecode = bytecode;
    procedure.parameters = catalog.getValue('$parameters');
    procedure.symbols = catalog.getValue('$symbols');
    procedure.literals = catalog.getValue('$literals');
    procedure.variables = catalog.getValue('$variables');
    procedure.handlers = catalog.getValue('$handlers');
    return procedure;
}


/*
 * This function exports a virtual machine procedure context to a Bali component.
 */
function exportProcedure(procedure) {
    var bytes = utilities.bytecodeToBytes(procedure.bytecode);
    var base16 = bali.codex.base16Encode(bytes);
    var source = "'%bytecode'($base: 16, $mediatype: \"application/bcod\")";
    source = source.replace(/%bytecode/, base16);
    var bytecode = bali.parser.parseDocument(source);
    var catalog = new bali.Catalog();
    catalog.setValue('$target', procedure.target);
    catalog.setValue('$type', procedure.type);
    catalog.setValue('$name', procedure.name);
    catalog.setValue('$instruction', procedure.instruction);
    catalog.setValue('$address', procedure.address);
    catalog.setValue('$bytecode', bytecode);
    catalog.setValue('$parameters', procedure.parameters);
    catalog.setValue('$literals', procedure.literals);
    catalog.setValue('$variables', procedure.variables);
    catalog.setValue('$handlers', procedure.handlers);
    return catalog;
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
            processor.procedure.address = address - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON NONE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var address = operand;
        // pop the condition component off the component stack
        var condition = processor.task.stack.removeItem();
        // if the condition is 'none' then use the address as the next instruction to be executed
        if (bali.Filter.NONE.isEqualTo(condition)) {
            processor.procedure.address = address - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON TRUE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var address = operand;
        // pop the condition component off the component stack
        var condition = processor.task.stack.removeItem();
        // if the condition is 'true' then use the address as the next instruction to be executed
        if (bali.Probability.TRUE.isEqualTo(condition)) {
            processor.procedure.address = address - 1;  // account for auto-increment
        }
    },

    // JUMP TO label ON FALSE
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var address = operand;
        // pop the condition component off the component stack
        var condition = processor.task.stack.removeItem();
        // if the condition is 'false' then use the address as the next instruction to be executed
        if (bali.Probability.FALSE.isEqualTo(condition)) {
            processor.procedure.address = address - 1;  // account for auto-increment
        }
    },

    // PUSH HANDLER label
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero address operand.');
        var handlerAddress = operand;
        // push the address of the current exception handlers onto the handlers stack
        processor.procedure.handlers.addItem(new bali.Complex(handlerAddress.toString()));
    },

    // PUSH ELEMENT literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var literal = processor.procedure.literals.getItem(index);
        processor.task.stack.addItem(literal);
    },

    // PUSH SOURCE literal
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the literal associated with the index
        var source = processor.procedure.literals.getItem(index);
        processor.task.stack.addItem(source);
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
        processor.procedure.handlers.removeItem();
    },

    // POP COMPONENT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // remove the component that is on top of the component stack since it was not used
        processor.task.stack.removeItem();
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
        var variable = processor.procedure.variables.getItem(index).value;
        processor.task.stack.addItem(variable);
    },

    // LOAD MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the queue tag associated with the index
        var queue = processor.procedure.variables.getItem(index).value;
        // TODO: jump to exception handler if queue isn't a tag
        // attempt to receive a message from the queue in the nebula
        var message = processor.nebula.receiveMessage(queue);
        if (message) {
            processor.task.stack.addItem(message);
        } else {
            // set the task status to 'waiting'
            processor.task.status = WAITING;
            // make sure that the same instruction will be tried again
            processor.procedure.address--;
        }
    },

    // LOAD DRAFT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the citation associated with the index
        var citation = processor.procedure.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited draft from the nebula repository
        var draft = processor.nebula.retrieveDraft(citation);
        // push the draft on top of the component stack
        processor.task.stack.addItem(draft);
    },

    // LOAD DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // lookup the citation associated with the index
        var citation = processor.procedure.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited document from the nebula repository
        var document = processor.nebula.retrieveDocument(citation);
        // push the document on top of the component stack
        processor.task.stack.addItem(document);
    },

    // STORE VARIABLE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the component that is on top of the component stack off the stack
        var component = processor.task.stack.removeItem();
        // and store the component in the variable associated with the index
        processor.procedure.variables.getItem(index).setValue(component);
    },

    // STORE MESSAGE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the message that is on top of the component stack off the stack
        var message = processor.task.stack.removeItem();
        // lookup the queue tag associated with the index operand
        var queue = processor.procedure.variables.getItem(index).value;
        // TODO: jump to exception handler if queue isn't a tag
        // send the message to the queue in the nebula
        processor.nebula.queueMessage(queue, message);
    },

    // STORE DRAFT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the draft that is on top of the component stack off the stack
        var draft = processor.task.stack.removeItem();
        // lookup the citation associated with the index operand
        var citation = processor.procedure.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // write the cited draft to the nebula repository
        processor.nebula.saveDraft(citation, draft);
    },

    // STORE DOCUMENT symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the document that is on top of the component stack off the stack
        var document = processor.task.stack.removeItem();
        // lookup the citation associated with the index operand
        var citation = processor.procedure.variables.getItem(index).value;
        // TODO: jump to exception handler if the citation isn't a citation
        // write the cited document to the nebula repository
        citation = processor.nebula.commitDocument(citation, document);
        processor.procedure.variables.getItem(index).setValue(citation);
    },

    // INVOKE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // call the intrinsic function associated with the index operand
        var result = intrinsics.functions[index]();
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
    },

    // INVOKE symbol WITH PARAMETER
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the parameter off of the component stack
        var parameter = processor.task.stack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.functions[index](parameter);
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
    },

    // INVOKE symbol WITH 2 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the parameters off of the component stack (in reverse order)
        var parameter2 = processor.task.stack.removeItem();
        var parameter1 = processor.task.stack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.functions[index](parameter1, parameter2);
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
    },

    // INVOKE symbol WITH 3 PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        var index = operand;
        // pop the parameters call off of the component stack (in reverse order)
        var parameter3 = processor.task.stack.removeItem();
        var parameter2 = processor.task.stack.removeItem();
        var parameter1 = processor.task.stack.removeItem();
        // call the intrinsic function associated with the index operand
        var result = intrinsics.functions[index](parameter1, parameter2, parameter3);
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
    },

    // EXECUTE symbol
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.task.procedures.addItem(exportProcedure(processor.procedure));
        // setup the new procedure context
        var index = operand;
        var target = bali.Filter.NONE;
        var type = processor.task.stack.removeItem();
        var parameters = new bali.Catalog();
        var procedure = extractProcedure(processor, target, type, parameters, index);
        processor.procedure = procedure;
    },

    // EXECUTE symbol WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.task.procedures.addItem(exportProcedure(processor.procedure));
        // setup the new procedure context
        var index = operand;
        var target = bali.Filter.NONE;
        var type = processor.task.stack.removeItem();
        var parameters = processor.task.stack.removeItem();
        var procedure = extractProcedure(processor, target, type, parameters, index);
        processor.procedure = procedure;
    },

    // EXECUTE symbol ON TARGET
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.task.procedures.addItem(exportProcedure(processor.procedure));
        // setup the new procedure context
        var index = operand;
        var target = processor.task.stack.removeItem();
        var type = intrinsics.invokeByName('$getType', [target]);
        var parameters = new bali.Catalog();
        var procedure = extractProcedure(processor, target, type, parameters, index);
        processor.procedure = procedure;
    },

    // EXECUTE symbol ON TARGET WITH PARAMETERS
    function(processor, operand) {
        if (!operand) throw new Error('PROCESSOR: The current instruction has a zero index operand.');
        // push the current procedure context onto the stack
        processor.task.procedures.addItem(exportProcedure(processor.procedure));
        // setup the new procedure context
        var index = operand;
        var target = processor.task.stack.removeItem();
        var type = intrinsics.invokeByName('$getType', [target]);
        var parameters = processor.task.stack.removeItem();
        var procedure = extractProcedure(processor, target, type, parameters, index);
        processor.procedure = procedure;
    },

    // HANDLE EXCEPTION
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        // search up the stack for a handler
        while (processor.procedure) {
            if (processor.procedure.handlers.isEmpty()) {
                if (!processor.task.procedures.isEmpty()) {
                    // raise the exception up to the calling procedure
                    processor.procedure = importProcedure(processor.task.procedures.removeItem());
                } else {
                    // unhandled exception
                    processor.procedure = undefined;
                    var exception = processor.task.stack.removeItem();
                    processor.task.exception = exception;
                    processor.task.status = DONE;
                }
            }
            // retrieve the address of the next exception handler
            var handlerAddress = processor.procedure.handlers.removeItem().toNumber();
            // use that address as the next instruction to be executed
            processor.procedure.address = handlerAddress;
        }
    },

    // HANDLE RESULT
    function(processor, operand) {
        if (operand) throw new Error('PROCESSOR: The current instruction has a non-zero operand.');
        if (!processor.task.procedures.isEmpty()) {
            // return the result to the calling procedure
            processor.procedure = importProcedure(processor.task.procedures.removeItem());
        } else {
            // we're done
            processor.procedure = undefined;
            var result = processor.task.stack.removeItem();
            processor.task.result = result;
            processor.task.status = DONE;
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

