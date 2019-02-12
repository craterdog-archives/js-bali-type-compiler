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
const bali = require('bali-component-framework');
const formatter = bali.Formatter('    ');
const utilities = require('../utilities');

const ACTIVE = '$active';
const WAITING = '$waiting';
const DONE = '$done';


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
    this.context = importContext(this.task.contexts.removeItem());
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
    const wasFetched = fetchInstruction(this);
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
    const task = exportTask(this.task);
    const contexts = task.getValue('$contexts');
    if (this.context) contexts.addItem(exportContext(this.context));  // this is affecting the live stack!
    const string = task.toString();
    if (this.context) contexts.removeItem();  // so we must remove it again afterward!  TODO: fix this!!!
    return string;
};


// PRIVATE FUNCTIONS

/*
 * This function determines whether or not the task assigned to the specified processor is runnable.
 */
function isRunnable(processor) {
    const hasInstructions = processor.context && processor.context.address <= processor.context.bytecode.length;
    const isActive = processor.task.status === ACTIVE;
    const hasTokens = processor.task.balance > 0;
    return hasInstructions && isActive && hasTokens;
}


/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
function fetchInstruction(processor) {
    if (isRunnable(processor)) {
        const address = processor.context.address;
        const instruction = processor.context.bytecode[address - 1];
        processor.context.instruction = instruction;
        return true;
    } else {
        return false;
    }
}


/*
 * This function executes the current 16 bit bytecode instruction.
 */
function executeInstruction(processor) {
    // decode the bytecode instruction
    const instruction = processor.context.instruction;
    const operation = utilities.bytecode.decodeOperation(instruction);
    const modifier = utilities.bytecode.decodeModifier(instruction);
    const operand = utilities.bytecode.decodeOperand(instruction);

    // pass execution off to the correct operation handler
    const index = (operation << 2) | modifier;  // index: [0..31]
    try {
        instructionHandlers[index](processor, operand); // operand: [0..2047]
    } catch (e) {
        handleException(processor, e);
    }

    // update the state of the task context
    processor.task.clock++;
    processor.task.balance--;
}


function handleException(processor, exception) {
    if (!(exception instanceof bali.Exception)) {
        // it's a bug in the compiler or processor
        const stack = exception.stack.split('\n').slice(1);
        stack.forEach(function(line, index) {
            line = '  ' + line;
            if (line.length > 80) {
                line = line.slice(0, 44) + '..' + line.slice(-35, -1);
            }
            stack[index] = line;
        });
        exception = bali.catalog({
            $exception: '$bug',
            $type: '"' + exception.constructor.name + '"',
            $message: '"' + exception + '"',
            $trace: '"\n' + stack.join('\n') + '"'
        });
        console.log('BUG: ' + exception);
    }
    processor.task.stack.addItem(exception);
    instructionHandlers[29](processor);  // HANDLE EXCEPTION instruction
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
        '    $clock: ' + processor.task.clock + '\n';
    if (processor.task.result) {
        source += '    $result: ' + formatter.formatComponent(processor.task.result) + '\n';
    } else {
        source += '    $exception: ' + formatter.formatComponent(processor.task.exception) + '\n';
    }
        source += ']';
    const event = bali.parse(source);
    const citation = processor.nebula.createDraft(event);
    const draft = processor.nebula.retrieveDraft(citation);
    processor.nebula.publishEvent(draft);
}


/*
 * This function publishes a task step event to the global event queue.
 */
function publishSuspensionEvent(processor) {
    const task = exportTask(processor.task);
    const source = '[\n' +
        '    $eventType: $suspension\n' +
        '    $tag: ' + task.tag + '\n' +
        '    $task: ' + formatter.formatComponent(task) + '\n' +
        ']';
    const event = bali.parse(source);
    const citation = processor.nebula.createDraft(event);
    const draft = processor.nebula.retrieveDraft(citation);
    processor.nebula.publishEvent(draft);
}


/*
 * This function places the current task context on the queue for tasks awaiting messages
 */
function queueTaskContext(processor) {
    // convert the task context into its corresponding source document
    const task = exportTask(processor.task);
    const document = task.toString();
    // queue up the task for a new virtual machine
    const WAIT_QUEUE = '#3F8TVTX4SVG5Z12F3RMYZCTWHV2VPX4K';
    processor.nebula.queueMessage(WAIT_QUEUE, document);
}


function importTask(catalog) {
    const task = {
        tag: catalog.getValue('$tag'),
        account: catalog.getValue('$account'),
        balance: catalog.getValue('$balance').toNumber(),
        status: catalog.getValue('$status').toString(),
        clock: catalog.getValue('$clock').toNumber(),
        stack: catalog.getValue('$stack'),
        contexts: catalog.getValue('$contexts')
    };
    return task;
}


function exportTask(task) {
    const catalog = bali.catalog();
    catalog.setValue('$tag', task.tag);
    catalog.setValue('$account', task.account);
    catalog.setValue('$balance', task.balance);
    catalog.setValue('$status', task.status);
    catalog.setValue('$clock', task.clock);
    catalog.setValue('$stack', task.stack);
    catalog.setValue('$contexts', task.contexts);
    return catalog;
}


function importContext(catalog) {
    const bytes = catalog.getValue('$bytecode').getValue();
    const bytecode = utilities.bytecode.bytesToBytecode(bytes);
    const procedure = {
        type: catalog.getValue('$type'),
        name: catalog.getValue('$name'),
        instruction: catalog.getValue('$instruction').toNumber(),
        address: catalog.getValue('$address').toNumber(),
        bytecode: bytecode,
        literals: catalog.getValue('$literals'),
        constants: catalog.getValue('$constants'),
        parameters: catalog.getValue('$parameters'),
        variables: catalog.getValue('$variables'),
        procedures: catalog.getValue('$procedures'),
        handlers: catalog.getValue('$handlers')
    };
    return procedure;
}


function exportContext(procedure) {
    const bytes = utilities.bytecode.bytecodeToBytes(procedure.bytecode);
    const base16 = bali.codex.base16Encode(bytes);
    var source = "'%bytecode'($encoding: $base16, $mediatype: \"application/bcod\")";
    source = source.replace(/%bytecode/, base16);
    const bytecode = bali.parse(source);
    const catalog = bali.catalog();
    catalog.setValue('$type', procedure.type);
    catalog.setValue('$name', procedure.name);
    catalog.setValue('$instruction', procedure.instruction);
    catalog.setValue('$address', procedure.address);
    catalog.setValue('$bytecode', bytecode);
    catalog.setValue('$literals', procedure.literals);
    catalog.setValue('$constants', procedure.constants);
    catalog.setValue('$parameters', procedure.parameters);
    catalog.setValue('$variables', procedure.variables);
    catalog.setValue('$procedures', procedure.procedures);
    catalog.setValue('$handlers', procedure.handlers);
    return catalog;
}


function pushContext(processor, target, citation, passedParameters, index) {

    // save the current procedure context
    const currentContext = processor.context;

    // retrieve the type and procedure to be executed
    const name = currentContext.procedures.getItem(index);
    const type = processor.nebula.retrieveType(citation);
    var procedures = type.getValue('$procedures');
    const procedure = procedures.getValue(name);

    // retrieve the bytecode from the compiled procedure
    const bytes = procedure.getValue('$bytecode').getValue();
    const bytecode = utilities.bytecode.bytesToBytecode(bytes);

    // retrieve the literals and constants from the compiled type
    const literals = type.getValue('$literals');
    const constants = type.getValue('$constants');

    // set the parameter values
    var counter = 1;
    const parameters = bali.catalog();
    var iterator = procedure.getValue('$parameters').getIterator();
    while (iterator.hasNext()) {
        var key = iterator.getNext();
        var value = passedParameters.getParameter(key, counter++);
        value = value || bali.NONE;
        parameters.setValue(key, value);
    }

    // set the initial values of the variables to 'none' except for the 'target' variable
    const variables = bali.catalog();
    iterator = procedure.getValue('$variables').getIterator();
    while (iterator.hasNext()) {
        var variable = iterator.getNext();
        variables.setValue(variable, bali.NONE);
    }
    variables.setValue('$target', target);

    // retrieve the called procedure names from the procedure
    procedures = procedure.getValue('$procedures');

    // create an empty exception handler stack
    const handlers = bali.stack();

    // construct the next procedure context
    const nextContext = {
        type: citation,
        name: name,
        instruction: 0,
        address: 0,  // this will be incremented before the next instruction is executed
        bytecode: bytecode,
        literals: literals,
        constants: constants,
        parameters: parameters,
        variables: variables,
        procedures: procedures,
        handlers: handlers
    };

    // push the current procedure context onto the stack
    processor.task.contexts.addItem(exportContext(currentContext));

    // set the next procedure as the current procedure
    processor.context = nextContext;
}


/*
 * This list contains the instruction handlers for each type of machine instruction.
 */
const instructionHandlers = [
    // JUMP TO label
    function(processor, operand) {
        // if the operand is not zero then use it as the next instruction to be executed,
        // otherwise it is a SKIP INSTRUCTION (aka NOOP)
        if (operand) {
            const address = operand;
            processor.context.address = address;
        } else {
            processor.context.address++;
        }
    },

    // JUMP TO label ON NONE
    function(processor, operand) {
        const address = operand;
        // pop the condition component off the component stack
        const condition = processor.task.stack.removeItem();
        // if the condition is 'none' then use the address as the next instruction to be executed
        if (condition.isEqualTo(bali.NONE)) {
            processor.context.address = address;
        } else {
            processor.context.address++;
        }
    },

    // JUMP TO label ON TRUE
    function(processor, operand) {
        const address = operand;
        // pop the condition component off the component stack
        const condition = processor.task.stack.removeItem();
        // if the condition is 'true' then use the address as the next instruction to be executed
        if (condition.toBoolean()) {
            processor.context.address = address;
        } else {
            processor.context.address++;
        }
    },

    // JUMP TO label ON FALSE
    function(processor, operand) {
        const address = operand;
        // pop the condition component off the component stack
        const condition = processor.task.stack.removeItem();
        // if the condition is 'false' then use the address as the next instruction to be executed
        if (!condition.toBoolean()) {
            processor.context.address = address;
        } else {
            processor.context.address++;
        }
    },

    // PUSH HANDLER label
    function(processor, operand) {
        const handlerAddress = operand;
        // push the address of the current exception handlers onto the handlers stack
        processor.context.handlers.addItem(bali.number(handlerAddress));
        processor.context.address++;
    },

    // PUSH LITERAL literal
    function(processor, operand) {
        const index = operand;
        // lookup the literal associated with the index
        const literal = processor.context.literals.getItem(index);
        processor.task.stack.addItem(literal);
        processor.context.address++;
    },

    // PUSH CONSTANT constant
    function(processor, operand) {
        const index = operand;
        // lookup the constant associated with the index
        const constant = processor.context.constants.getItem(index).getValue();
        processor.task.stack.addItem(constant);
        processor.context.address++;
    },

    // PUSH PARAMETER parameter
    function(processor, operand) {
        const index = operand;
        // lookup the parameter associated with the index
        const parameter = processor.context.parameters.getItem(index).getValue();
        processor.task.stack.addItem(parameter);
        processor.context.address++;
    },

    // POP HANDLER
    function(processor, operand) {
        // remove the current exception handler address from the top of the handlers stack
        // since it is no longer in scope
        processor.context.handlers.removeItem();
        processor.context.address++;
    },

    // POP COMPONENT
    function(processor, operand) {
        // remove the component that is on top of the component stack since it was not used
        processor.task.stack.removeItem();
        processor.context.address++;
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
        const index = operand;
        // lookup the variable associated with the index
        const variable = processor.context.variables.getItem(index).getValue();
        processor.task.stack.addItem(variable);
        processor.context.address++;
    },

    // LOAD MESSAGE symbol
    function(processor, operand) {
        const index = operand;
        // lookup the queue tag associated with the index
        const queue = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if queue isn't a tag
        // attempt to receive a message from the queue in the nebula
        const message = processor.nebula.receiveMessage(queue);
        if (message) {
            processor.task.stack.addItem(message);
            processor.context.address++;
        } else {
            // set the task status to 'waiting'
            processor.task.status = WAITING;
        }
    },

    // LOAD DRAFT symbol
    function(processor, operand) {
        const index = operand;
        // lookup the citation associated with the index
        const citation = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited draft from the nebula repository
        const draft = processor.nebula.retrieveDraft(citation);
        // push the draft on top of the component stack
        processor.task.stack.addItem(draft);
        processor.context.address++;
    },

    // LOAD DOCUMENT symbol
    function(processor, operand) {
        const index = operand;
        // lookup the citation associated with the index
        const citation = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited document from the nebula repository
        const document = processor.nebula.retrieveDocument(citation);
        // push the document on top of the component stack
        processor.task.stack.addItem(document);
        processor.context.address++;
    },

    // STORE VARIABLE symbol
    function(processor, operand) {
        const index = operand;
        // pop the component that is on top of the component stack off the stack
        const component = processor.task.stack.removeItem();
        // and store the component in the variable associated with the index
        processor.context.variables.getItem(index).setValue(component);
        processor.context.address++;
    },

    // STORE MESSAGE symbol
    function(processor, operand) {
        const index = operand;
        // pop the message that is on top of the component stack off the stack
        const message = processor.task.stack.removeItem();
        // lookup the queue tag associated with the index operand
        const queue = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if queue isn't a tag
        // send the message to the queue in the nebula
        processor.nebula.queueMessage(queue, message);
        processor.context.address++;
    },

    // STORE DRAFT symbol
    function(processor, operand) {
        const index = operand;
        // pop the draft that is on top of the component stack off the stack
        const draft = processor.task.stack.removeItem();
        // lookup the citation associated with the index operand
        const citation = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if the citation isn't a citation
        // write the cited draft to the nebula repository
        processor.nebula.saveDraft(citation, draft);
        processor.context.address++;
    },

    // STORE DOCUMENT symbol
    function(processor, operand) {
        const index = operand;
        // pop the document that is on top of the component stack off the stack
        const document = processor.task.stack.removeItem();
        // lookup the citation associated with the index operand
        var citation = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if the citation isn't a citation
        // write the cited document to the nebula repository
        citation = processor.nebula.commitDocument(citation, document);
        processor.context.variables.getItem(index).setValue(citation);
        processor.context.address++;
    },

    // INVOKE symbol
    function(processor, operand) {
        const index = operand;
        // call the intrinsic function associated with the index operand
        const result = utilities.intrinsics.functions[index]();
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
        processor.context.address++;
    },

    // INVOKE symbol WITH PARAMETER
    function(processor, operand) {
        const index = operand;
        // pop the parameter off of the component stack
        const parameter = processor.task.stack.removeItem();
        // call the intrinsic function associated with the index operand
        const result = utilities.intrinsics.functions[index](parameter);
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
        processor.context.address++;
    },

    // INVOKE symbol WITH 2 PARAMETERS
    function(processor, operand) {
        const index = operand;
        // pop the parameters off of the component stack (in reverse order)
        const parameter2 = processor.task.stack.removeItem();
        const parameter1 = processor.task.stack.removeItem();
        // call the intrinsic function associated with the index operand
        const result = utilities.intrinsics.functions[index](parameter1, parameter2);
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
        processor.context.address++;
    },

    // INVOKE symbol WITH 3 PARAMETERS
    function(processor, operand) {
        const index = operand;
        // pop the parameters call off of the component stack (in reverse order)
        const parameter3 = processor.task.stack.removeItem();
        const parameter2 = processor.task.stack.removeItem();
        const parameter1 = processor.task.stack.removeItem();
        // call the intrinsic function associated with the index operand
        const result = utilities.intrinsics.functions[index](parameter1, parameter2, parameter3);
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
        processor.context.address++;
    },

    // EXECUTE symbol
    function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = bali.parameters(bali.list());
        const target = bali.NONE;
        const type = processor.task.stack.removeItem();
        pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // EXECUTE symbol WITH PARAMETERS
    function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = processor.task.stack.removeItem();
        const target = bali.NONE;
        const type = processor.task.stack.removeItem();
        pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // EXECUTE symbol ON TARGET
    function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = bali.parameters(bali.list());
        const target = processor.task.stack.removeItem();
        const type = bali.parse(target.getType());
        pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // EXECUTE symbol ON TARGET WITH PARAMETERS
    function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = processor.task.stack.removeItem();
        const target = processor.task.stack.removeItem();
        const type = bali.parse(target.getType());
        pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // HANDLE RESULT
    function(processor, operand) {
        if (!processor.task.contexts.isEmpty()) {
            // retrieve the previous context from the stack
            processor.context = importContext(processor.task.contexts.removeItem());
            processor.context.address++;
        } else {
            // task completed with a result
            processor.task.result = processor.task.stack.removeItem();
            processor.task.status = DONE;
            processor.context = undefined;
        }
    },

    // HANDLE EXCEPTION
    function(processor, operand) {
        // search up the stack for a handler
        while (processor.context) {
            if (!processor.context.handlers.isEmpty()) {
                // retrieve the address of the next exception handler
                var handlerAddress = processor.context.handlers.removeItem().toNumber();
                // use that address as the next instruction to be executed
                processor.context.address = handlerAddress;
                break;
            } else {
                if (!processor.task.contexts.isEmpty()) {
                    // retrieve the previous context from the stack
                    processor.context = importContext(processor.task.contexts.removeItem());
                } else {
                    // task completed with an unhandled exception
                    processor.task.exception = processor.task.stack.removeItem();
                    processor.task.status = DONE;
                    processor.context = undefined;
                }
            }
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

