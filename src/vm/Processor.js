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
const formatter = bali.Formatter(1);
const utilities = require('../utilities');

const ACTIVE = '$active';
const WAITING = '$waiting';
const DONE = '$done';

// This private constant sets the POSIX end of line character
const EOL = '\n';


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new processor to execute the specified task.
 * 
 * @constructor
 * @param {Object} nebula An object that implements the Bali Nebula API™.
 * @param {Catalog} task The task for the new processor to execute.
 * @param {Boolean} debug An optional flag that determines whether or not exceptions
 * will be logged to the error console.
 * @returns {Processor} The new processor loaded with the task.
 */
const Processor = function(nebula, task, debug) {
    this.nebula = nebula;
    this.task = importTask(task);
    this.debug = debug || false;
    this.context = importContext(this.task.contexts.removeItem());
    return this;
};
Processor.prototype.constructor = Processor;
exports.Processor = Processor;


/**
 * This method returns a string representation of the current processor state using
 * Bali Document Notation™.
 * 
 * @returns {String} A string representation of the current processor state.
 */
Processor.prototype.toString = function() {
    const task = captureState(this);
    return task.toString();
};


/**
 * This method executes the next instruction in the current task.
 * 
 * @returns {Boolean} Whether or not an instruction was executed.
 */
Processor.prototype.step = async function() {
    try {
        if (fetchInstruction(this)) {
            await executeInstruction(this);
            return true;
        } else {
            await finalizeProcessing(this);
            return false;
        }
    } catch (cause) {
        const exception = bali.exception({
            $module: '$Processor',
            $function: '$step',
            $exception: '$unexpected',
            $task: captureState(this),
            $text: bali.text('An unexpected error occurred while attempting to execute a single step of a task.')
        }, cause);
        if (this.debug) console.error(exception.toString());
        throw exception;
    }
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
Processor.prototype.run = async function() {
    try {
        while (fetchInstruction(this)) {
            await executeInstruction(this);
        }
        await finalizeProcessing(this);
    } catch (cause) {
        const exception = bali.exception({
            $module: '$Processor',
            $function: '$run',
            $exception: '$unexpected',
            $task: captureState(this),
            $text: bali.text('An unexpected error occurred while attempting to run a task.')
        }, cause);
        if (this.debug) console.error(exception.toString());
        throw exception;
    }
};


// PRIVATE SYNCHRONOUS FUNCTIONS

const captureState = function(processor) {
    const task = bali.duplicate(exportTask(processor.task));  // copy the task state
    const contexts = task.getValue('$contexts');
    if (processor.context) {
        const currentContext = exportContext(processor.context);
        contexts.addItem(bali.duplicate(currentContext));  // add a copy of the context
    }
    return task;
};


/*
 * This function determines whether or not the task assigned to the specified processor is runnable.
 */
const isRunnable = function(processor) {
    const hasInstructions = processor.context && processor.context.address <= processor.context.bytecode.length;
    const isActive = processor.task.status === ACTIVE;
    const hasTokens = processor.task.balance > 0;
    return hasInstructions && isActive && hasTokens;
};


/*
 * This function fetches the next 16 bit bytecode instruction from the current procedure context.
 */
const fetchInstruction = function(processor) {
    if (isRunnable(processor)) {
        const address = processor.context.address;
        const instruction = processor.context.bytecode[address - 1];
        processor.context.instruction = instruction;
        return true;
    } else {
        return false;
    }
};


const importTask = function(catalog) {
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
};


const exportTask = function(task) {
    const catalog = bali.catalog();
    catalog.setValue('$tag', task.tag);
    catalog.setValue('$account', task.account);
    catalog.setValue('$balance', task.balance);
    catalog.setValue('$status', task.status);
    catalog.setValue('$clock', task.clock);
    catalog.setValue('$stack', task.stack);
    catalog.setValue('$contexts', task.contexts);
    return catalog;
};


const importContext = function(catalog) {
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
};


const exportContext = function(procedure) {
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
};


// PRIVATE ASYNCHRONOUS FUNCTIONS

/*
 * This function executes the current 16 bit bytecode instruction.
 */
const executeInstruction = async function(processor) {
    // decode the bytecode instruction
    const instruction = processor.context.instruction;
    const operation = utilities.bytecode.decodeOperation(instruction);
    const modifier = utilities.bytecode.decodeModifier(instruction);
    const operand = utilities.bytecode.decodeOperand(instruction);

    // pass execution off to the correct operation handler
    const index = (operation << 2) | modifier;  // index: [0..31]
    try {
        await instructionHandlers[index](processor, operand); // operand: [0..2047]
    } catch (exception) {
        await handleException(processor, exception);
    }

    // update the state of the task context
    processor.task.clock++;
    processor.task.balance--;
};


const handleException = async function(processor, exception) {
    if (!(exception instanceof bali.Exception)) {
        // it's a bug in the compiler or processor
        const stack = exception.stack.split(EOL).slice(1);
        stack.forEach(function(line, index) {
            line = '  ' + line;
            if (line.length > 80) {
                line = line.slice(0, 44) + '..' + line.slice(-35, -1);
            }
            stack[index] = line;
        });
        exception = bali.catalog({
            $module: '$Processor',
            $procedure: '$executeInstruction',
            $exception: '$processorBug',
            $type: bali.text(exception.constructor.name),
            $processor: captureState(processor),
            $text: bali.text(exception.toString()),
            $trace: bali.text(EOL + stack.join(EOL))
        });
        console.error('FOUND BUG IN PROCESSOR: ' + exception);
    }
    processor.task.stack.addItem(exception);
    await instructionHandlers[29](processor);  // HANDLE EXCEPTION instruction
};


/*
 * This function finalizes the processing depending on the status of the task.
 */
const finalizeProcessing = async function(processor) {
    const status = processor.task.status;
    switch (status) {
        case ACTIVE:
            // the task hit a break point or the account balance is zero so notify any interested parties
            await publishSuspensionEvent(processor);
            break;
        case WAITING:
            // the task is waiting on a message so requeue the task context
            await queueTaskContext(processor);
            break;
        case DONE:
            // the task completed successfully or with an exception so notify any interested parties
            await publishCompletionEvent(processor);
            break;
        default:
    }
};


/*
 * This function publishes a task completion event to the global event queue.
 */
const publishCompletionEvent = async function(processor) {
    const task = processor.task;
    const event = bali.catalog({
        $eventType: '$completion',
        $tag: task.tag,
        $account: task.account,
        $balance: task.balance,
        $clock: task.clock
    });
    if (task.result) {
        event.setValue('$result', task.result);
    } else {
        event.setValue('$exception', task.exception);
    }
    await processor.nebula.publishEvent(event);
};


/*
 * This function publishes a task step event to the global event queue.
 */
const publishSuspensionEvent = async function(processor) {
    const task = exportTask(processor.task);
    const event = bali.catalog({
        $eventType: '$suspension',
        $tag: task.tag,
        $task: task
    });
    await processor.nebula.publishEvent(event);
};


/*
 * This function places the current task context on the queue for tasks awaiting messages
 */
const queueTaskContext = async function(processor) {
    // convert the task context into its corresponding source document
    const task = exportTask(processor.task);
    const document = task.toString();
    // queue up the task for a new virtual machine
    const WAIT_QUEUE = bali.tag('3F8TVTX4SVG5Z12F3RMYZCTWHV2VPX4K');
    await processor.nebula.queueMessage(WAIT_QUEUE, document);
};


const pushContext = async function(processor, target, citation, passedParameters, index) {

    // save the current procedure context
    const currentContext = processor.context;

    // retrieve the type and procedure to be executed
    const name = currentContext.procedures.getItem(index);
    const type = await processor.nebula.retrieveType(citation);

    // retrieve the procedures for this type
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
};


// PRIVATE MACHINE INSTRUCTION HANDLERS (ASYNCHRONOUS)

const instructionHandlers = [
    // JUMP TO label
    async function(processor, operand) {
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
    async function(processor, operand) {
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
    async function(processor, operand) {
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
    async function(processor, operand) {
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
    async function(processor, operand) {
        const handlerAddress = operand;
        // push the address of the current exception handlers onto the handlers stack
        processor.context.handlers.addItem(bali.number(handlerAddress));
        processor.context.address++;
    },

    // PUSH LITERAL literal
    async function(processor, operand) {
        const index = operand;
        // lookup the literal associated with the index
        const literal = processor.context.literals.getItem(index);
        processor.task.stack.addItem(literal);
        processor.context.address++;
    },

    // PUSH CONSTANT constant
    async function(processor, operand) {
        const index = operand;
        // lookup the constant associated with the index
        const constant = processor.context.constants.getItem(index).getValue();
        processor.task.stack.addItem(constant);
        processor.context.address++;
    },

    // PUSH PARAMETER parameter
    async function(processor, operand) {
        const index = operand;
        // lookup the parameter associated with the index
        const parameter = processor.context.parameters.getItem(index).getValue();
        processor.task.stack.addItem(parameter);
        processor.context.address++;
    },

    // POP HANDLER
    async function(processor, operand) {
        // remove the current exception handler address from the top of the handlers stack
        // since it is no longer in scope
        processor.context.handlers.removeItem();
        processor.context.address++;
    },

    // POP COMPONENT
    async function(processor, operand) {
        // remove the component that is on top of the component stack since it was not used
        processor.task.stack.removeItem();
        processor.context.address++;
    },

    // UNIMPLEMENTED POP OPERATION
    async function(processor, operand) {
        throw bali.exception({
            $module: '$Processor',
            $procedure: '$pop3',
            $exception: '$notImplemented',
            $operand: operand,
            $processor: captureState(processor),
            $message: 'An unimplemented POP operation was attempted.'
        });
    },

    // UNIMPLEMENTED POP OPERATION
    async function(processor, operand) {
        throw bali.exception({
            $module: '$Processor',
            $procedure: '$pop4',
            $exception: '$notImplemented',
            $operand: operand,
            $processor: captureState(processor),
            $message: 'An unimplemented POP operation was attempted.'
        });
    },

    // LOAD VARIABLE symbol
    async function(processor, operand) {
        const index = operand;
        // lookup the variable associated with the index
        const variable = processor.context.variables.getItem(index).getValue();
        processor.task.stack.addItem(variable);
        processor.context.address++;
    },

    // LOAD MESSAGE symbol
    async function(processor, operand) {
        const index = operand;
        // lookup the queue tag associated with the index
        const queue = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if queue isn't a tag
        // attempt to receive a message from the queue in the nebula
        const message = await processor.nebula.receiveMessage(queue);
        if (message) {
            processor.task.stack.addItem(message);
            processor.context.address++;
        } else {
            // set the task status to 'waiting'
            processor.task.status = WAITING;
        }
    },

    // LOAD DRAFT symbol
    async function(processor, operand) {
        const index = operand;
        // lookup the citation associated with the index
        const citation = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited draft from the nebula repository
        const draft = await processor.nebula.retrieveDraft(citation);
        // push the draft on top of the component stack
        processor.task.stack.addItem(draft);
        processor.context.address++;
    },

    // LOAD DOCUMENT symbol
    async function(processor, operand) {
        const index = operand;
        // lookup the citation associated with the index
        const citation = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if the citation isn't a citation
        // retrieve the cited document from the nebula repository
        const document = await processor.nebula.retrieveDocument(citation);
        // push the document on top of the component stack
        processor.task.stack.addItem(document);
        processor.context.address++;
    },

    // STORE VARIABLE symbol
    async function(processor, operand) {
        const index = operand;
        // pop the component that is on top of the component stack off the stack
        const component = processor.task.stack.removeItem();
        // and store the component in the variable associated with the index
        processor.context.variables.getItem(index).setValue(component);
        processor.context.address++;
    },

    // STORE MESSAGE symbol
    async function(processor, operand) {
        const index = operand;
        // pop the message that is on top of the component stack off the stack
        const message = processor.task.stack.removeItem();
        // lookup the queue tag associated with the index operand
        const queue = processor.context.variables.getItem(index).getValue();
        // TODO: jump to exception handler if queue isn't a tag
        // send the message to the queue in the nebula
        await processor.nebula.queueMessage(queue, message);
        processor.context.address++;
    },

    // STORE DRAFT symbol
    async function(processor, operand) {
        const index = operand;
        // pop the draft that is on top of the component stack off the stack
        const draft = processor.task.stack.removeItem();
        // write the draft to the nebula repository
        const citation = await processor.nebula.saveDraft(draft);
        // and store the resulting citation in the variable associated with the index
        processor.context.variables.getItem(index).setValue(citation);
        processor.context.address++;
    },

    // STORE DOCUMENT symbol
    async function(processor, operand) {
        const index = operand;
        // pop the document that is on top of the component stack off the stack
        const document = processor.task.stack.removeItem();
        // write the document to the nebula repository
        const citation = await processor.nebula.commitDocument(document);
        // and store the resulting citation in the variable associated with the index
        processor.context.variables.getItem(index).setValue(citation);
        processor.context.address++;
    },

    // INVOKE symbol
    async function(processor, operand) {
        const index = operand;
        // call the intrinsic function associated with the index operand
        const result = utilities.intrinsics.functions[index]();
        // push the result of the function call onto the top of the component stack
        processor.task.stack.addItem(result);
        processor.context.address++;
    },

    // INVOKE symbol WITH PARAMETER
    async function(processor, operand) {
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
    async function(processor, operand) {
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
    async function(processor, operand) {
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
    async function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = bali.parameters(bali.list());
        const target = bali.NONE;
        const type = processor.task.stack.removeItem();
        await pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // EXECUTE symbol WITH PARAMETERS
    async function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = processor.task.stack.removeItem();
        const target = bali.NONE;
        const type = processor.task.stack.removeItem();
        await pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // EXECUTE symbol ON TARGET
    async function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = bali.parameters(bali.list());
        const target = processor.task.stack.removeItem();
        const type = target.getParameters().getParameter('$type');
        await pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // EXECUTE symbol ON TARGET WITH PARAMETERS
    async function(processor, operand) {
        // setup the new procedure context
        const index = operand;
        const parameters = processor.task.stack.removeItem();
        const target = processor.task.stack.removeItem();
        const type = target.getParameters().getParameter('$type');
        await pushContext(processor, target, type, parameters, index);
        processor.context.address++;
    },

    // HANDLE RESULT
    async function(processor, operand) {
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
    async function(processor, operand) {
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
    async function(processor, operand) {
        throw bali.exception({
            $module: '$Processor',
            $procedure: '$handle3',
            $exception: '$notImplemented',
            $operand: operand,
            $processor: captureState(processor),
            $message: 'An unimplemented HANDLE operation was attempted.'
        });
    },

    // UNIMPLEMENTED HANDLE OPERATION
    async function(processor, operand) {
        throw bali.exception({
            $module: '$Processor',
            $procedure: '$handle4',
            $exception: '$notImplemented',
            $operand: operand,
            $processor: captureState(processor),
            $message: 'An unimplemented HANDLE operation was attempted.'
        });
    }

];

