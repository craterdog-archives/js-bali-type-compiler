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

/**
 * This module provides a class that parses a document containing instructions
 * for the Bali Nebula™ virtual processor and produce the corresponding list of
 * instructions.
 */
const antlr = require('antlr4');
const ErrorStrategy = require('antlr4/error/ErrorStrategy');
const bali = require('bali-component-framework').api(1);
const grammar = require('./grammar');
const types = require('./Types');
const EOL = '\n';  // POSIX end of line character


/**
 * This class implements a parser that parses strings containing instructions for the
 * Bali Nebula™ virtual processor and generates the corresponding parse tree structures.
 *
 * An optional debug argument may be specified that controls the level of debugging that
 * should be applied during execution. The allowed levels are as follows:
 * <pre>
 *   0: no debugging is applied (this is the default value and has the best performance)
 *   1: log any exceptions to console.error before throwing them
 *   2: perform argument validation checks on each call (poor performance)
 *   3: log interesting arguments, states and results to console.log
 * </pre>
 *
 * @returns {Parser} The new string parser.
 */
function Parser(debug) {
    this.debug = debug || false;
    return this;
}
Parser.prototype.constructor = Parser;
exports.Parser = Parser;
exports.parser = new Parser();


// PUBLIC METHODS

/**
 * This method takes a string containing instructions for the Bali Nebula™ virtual processor
 * and parses it into a list of instructions.
 *
 * @param {String} source The assembly source code defining the instructions.
 * @returns {List} The resulting list of instructions.
 */
Parser.prototype.parseInstructions = function(source) {
    const parser = initializeParser(source, this.debug);
    const antlrTree = parser.document();
    const instruction = convertParseTree(antlrTree);
    return instruction;
};


// PRIVATE FUNCTIONS

function initializeParser(document, debug) {
    debug = debug || false;
    const chars = new antlr.InputStream(document);
    const lexer = new grammar.DocumentLexer(chars);
    const listener = new CustomErrorListener(debug);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);
    const tokens = new antlr.CommonTokenStream(lexer);
    const parser = new grammar.DocumentParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    parser._errHandler = new CustomErrorStrategy(debug);
    return parser;
}


function convertParseTree(antlrTree) {
    const visitor = new ParsingVisitor();
    antlrTree.accept(visitor);
    const instructions = visitor.result;
    return instructions;
}


// PRIVATE CLASSES

function ParsingVisitor() {
    grammar.DocumentVisitor.call(this);
    return this;
}
ParsingVisitor.prototype = Object.create(grammar.DocumentVisitor.prototype);
ParsingVisitor.prototype.constructor = ParsingVisitor;


// document: EOL* instructions EOL* EOF
ParsingVisitor.prototype.visitDocument = function(ctx) {
    ctx.instructions().accept(this);
};


// instructions: (instruction EOL)*
ParsingVisitor.prototype.visitInstructions = function(ctx) {
    const list = bali.list();
    const instructions = ctx.instruction();
    instructions.forEach(function(instruction) {
        instruction.accept(this);
        list.addItem(this.result);
    }, this);
    this.result = list;
};


// instruction: label? action
ParsingVisitor.prototype.visitInstruction = function(ctx) {
    ctx.action().accept(this);
    const instruction = this.result;
    const label = ctx.label();
    if (label) {
        label.accept(this);
        instruction.setAttribute('$label', this.result);
    }
    this.result = instruction;
};


// label: EOL LABEL ':' EOL
ParsingVisitor.prototype.visitLabel = function(ctx) {
    this.result = bali.text(ctx.LABEL().getText());
};


// note: 'NOTE' COMMENT
ParsingVisitor.prototype.visitNote = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.NOTE);
    const note = ctx.children[1].getText();
    instruction.setAttribute('$note', note);
    this.result = instruction;
};


// jump:
//     'JUMP' 'TO' 'NEXT' 'INSTRUCTION' |
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'EMPTY' |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
ParsingVisitor.prototype.visitJump = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.JUMP);
    switch (ctx.children.length) {
        case 3:
            instruction.setAttribute('$modifier', types.ON_ANY);
            instruction.setAttribute('$operand', bali.text(ctx.LABEL().getText()));
            break;
        case 5:
            const modifier = types.jumpModifierValue(ctx.children[3].getText() + ' ' + ctx.children[4].getText());
            instruction.setAttribute('$modifier', modifier);
            instruction.setAttribute('$operand', bali.text(ctx.LABEL().getText()));
            break;
    }
    this.result = instruction;
};


// push:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'ARGUMENT' SYMBOL
ParsingVisitor.prototype.visitPush = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.PUSH);
    const modifier = types.pushModifierValue(ctx.children[1].getText());
    instruction.setAttribute('$modifier', modifier);
    const operand = ctx.children[2].getText();
    var value;
    switch (modifier) {
        case types.HANDLER:
            value = bali.text(operand);  // treat the label as text
            break;
        case types.LITERAL:
            value = bali.component(operand.slice(1, -1));  // remove the back tick delimeters
            break;
        case types.CONSTANT:
        case types.ARGUMENT:
            value = bali.component(operand);
            break;
    }
    instruction.setAttribute('$operand', value);
    this.result = instruction;
};


// pull:
//     'PULL' 'HANDLER' |
//     'PULL' 'COMPONENT' |
//     'PULL' 'RESULT' |
//     'PULL' 'EXCEPTION'
ParsingVisitor.prototype.visitPull = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.PULL);
    instruction.setAttribute('$modifier', types.pullModifierValue(ctx.children[1].getText()));
    this.result = instruction;
};


// load:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
ParsingVisitor.prototype.visitLoad = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.LOAD);
    instruction.setAttribute('$modifier', types.loadModifierValue(ctx.children[1].getText()));
    const symbol = ctx.children[2].getText();
    instruction.setAttribute('$operand', bali.component(symbol));
    this.result = instruction;
};


// save:
//     'SAVE' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
ParsingVisitor.prototype.visitSave = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.SAVE);
    instruction.setAttribute('$modifier', types.saveModifierValue(ctx.children[1].getText()));
    const symbol = ctx.children[2].getText();
    instruction.setAttribute('$operand', bali.component(symbol));
    this.result = instruction;
};


// drop:
//     'DROP' 'VARIABLE' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'CONTRACT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
ParsingVisitor.prototype.visitDrop = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.DROP);
    instruction.setAttribute('$modifier', types.dropModifierValue(ctx.children[1].getText()));
    const symbol = ctx.children[2].getText();
    instruction.setAttribute('$operand', bali.component(symbol));
    this.result = instruction;
};


// call:
//     'CALL' SYMBOL |
//     'CALL' SYMBOL 'WITH' '1' 'ARGUMENT' |
//     'CALL' SYMBOL 'WITH' NUMBER 'ARGUMENTS'
ParsingVisitor.prototype.visitCall = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.CALL);
    var modifier = 0;
    if (ctx.children.length === 5) modifier = Number(ctx.children[3].getText());
    instruction.setAttribute('$modifier', modifier);
    instruction.setAttribute('$operand', bali.component(ctx.SYMBOL().getText()));
    this.result = instruction;
};


// send:
//     'SEND' SYMBOL 'TO' 'COMPONENT' |
//     'SEND' SYMBOL 'TO' 'COMPONENT' 'WITH' 'ARGUMENTS' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' 'WITH' 'ARGUMENTS'
ParsingVisitor.prototype.visitSend = function(ctx) {
    const instruction = bali.catalog();
    instruction.setAttribute('$operation', types.SEND);
    var string = '';
    for (var i = 2; i < ctx.children.length; i++) {
        string += ctx.children[i].getText() + ' ';
    }
    string = string.slice(0, -1);  // strip off last space
    const modifier = types.sendModifierValue(string);
    instruction.setAttribute('$modifier', modifier);
    instruction.setAttribute('$operand', bali.component(ctx.SYMBOL().getText()));
    this.result = instruction;
};


// CUSTOM ERROR HANDLING

// override the recover method in the lexer to fail fast
grammar.DocumentLexer.prototype.recover = function(e) {
    throw e;
};


const CustomErrorStrategy = function(debug) {
    ErrorStrategy.DefaultErrorStrategy.call(this);
    this.debug = debug || 0;
    return this;
};
CustomErrorStrategy.prototype = Object.create(ErrorStrategy.DefaultErrorStrategy.prototype);
CustomErrorStrategy.prototype.constructor = CustomErrorStrategy;


CustomErrorStrategy.prototype.reportError = function(recognizer, e) {
    recognizer.notifyErrorListeners(e.message, recognizer.getCurrentToken(), e);
};


CustomErrorStrategy.prototype.recover = function(recognizer, cause) {
    var context = recognizer._ctx;
    while (context !== null) {
        context.exception = cause;
        context = context.parentCtx;
    }
    const exception = bali.exception({
        $module: '/bali/assembler/Parser',
        $procedure: '$parseInstructions',
        $exception: '$syntaxError',
        $text: cause.toString()
    }, cause);
    if (this.debug > 0) console.error(exception.toString());
    throw exception;
};


CustomErrorStrategy.prototype.recoverInline = function(recognizer) {
    const exception = new antlr.error.InputMismatchException(recognizer);
    this.reportError(recognizer, exception);
    this.recover(recognizer, exception);
};


CustomErrorStrategy.prototype.sync = function(recognizer) {
    // ignore for efficiency
};


const CustomErrorListener = function(debug) {
    antlr.error.ErrorListener.call(this);
    this.debug = debug || 0;
    this.exactOnly = false;  // 'true' results in uninteresting ambiguities so leave 'false'
    return this;
};
CustomErrorListener.prototype = Object.create(antlr.error.ErrorListener.prototype);
CustomErrorListener.prototype.constructor = CustomErrorListener;


CustomErrorListener.prototype.syntaxError = function(recognizer, offendingToken, lineNumber, columnNumber, message, e) {
    // create the error message
    const token = offendingToken ? recognizer.getTokenErrorDisplay(offendingToken) : '';
    const input = token ? offendingToken.getInputStream() : recognizer._input;
    const lines = input.toString().split(EOL);
    const character = lines[lineNumber - 1][columnNumber];
    if (!token) {
        message = "An unexpected character was encountered: '" + character + "'";
    } else {
        message = 'An invalid token was encountered: ' + token;
    }
    message = addContext(recognizer, message);

    // capture the exception
    const exception = bali.exception({
        $module: '/bali/assembler/Parser',
        $procedure: '$parseInstructions',
        $exception: '$syntaxError',
        $text: message
    });

    // stop the processing
    if (this.debug > 0) console.error(exception.toString());
    throw exception;
};


CustomErrorListener.prototype.reportAmbiguity = function(recognizer, dfa, startIndex, stopIndex, exact, alternatives, configs) {
    if (this.debug > 0) {
        const rule = getRule(recognizer, dfa);
        var message = 'The parser encountered ambiguous input for rule: ' + rule;
        message = addContext(recognizer, message);
        console.error(message);
    }
};


CustomErrorListener.prototype.reportContextSensitivity = function(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
    if (this.debug > 0) {
        const rule = getRule(recognizer, dfa);
        var message = 'The parser encountered a context sensitive rule: ' + rule;
        message = addContext(recognizer, message);
        console.error(message);
    }
};


// PRIVATE FUNCTIONS

const getRule = function(recognizer, dfa) {
    const description = dfa.decision.toString();
    const ruleIndex = dfa.atnStartState.ruleIndex;

    const ruleNames = recognizer.ruleNames;
    if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
        return description;
    }
    const ruleName = ruleNames[ruleIndex] || '<unknown>';
    return description + " (" + ruleName + ")";
};


const addContext = function(recognizer, message) {
    // truncate the main message as needed
    message = EOL + '    ' + message.slice(0, 160) + EOL;

    // add the lines before and after the invalid line and highlight the invalid token
    const offendingToken = recognizer._precedenceStack ? recognizer.getCurrentToken() : undefined;
    const token = offendingToken ? recognizer.getTokenErrorDisplay(offendingToken) : '';
    const input = token ? offendingToken.getInputStream() : recognizer._input;
    const lines = input.toString().split(EOL);
    const lineNumber = token ? offendingToken.line : recognizer._tokenStartLine;  // unit based
    const columnNumber = token ? offendingToken.column : recognizer._tokenStartColumn;  // zero based
    if (lineNumber > 1) {
        message += '    [' + (lineNumber - 1) + ']: ' + lines[lineNumber - 2] + EOL;
    }
    message += '    [' + lineNumber + ']: ' + lines[lineNumber - 1] + EOL;
    var line = '         ';  // indent 4 spaces plus "[", "]: " for total of nine spaces
    for (var i = 0; i < lineNumber.toString().length + columnNumber - 1; i++) {
        line += ' ';
    }
    var start = token ? offendingToken.start : 0;
    const stop = token ? offendingToken.stop : 0;
    while (start++ <= stop) {
        line += '^';
    }
    message += line + EOL;
    if (lineNumber < lines.length) {
        message += '    [' + (lineNumber + 1) + ']: ' + lines[lineNumber] + EOL;
    }
    return message;
};
