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
 * for the Bali Virtual Machine™ and produce the corresponding list of instructions.
 */
const antlr = require('antlr4');
const ErrorStrategy = require('antlr4/error/ErrorStrategy');
const bali = require('bali-component-framework');
const grammar = require('../grammar');
const types = require('./Types');
const EOL = '\n';  // POSIX end of line character


// PUBLIC FUNCTIONS

/**
 * This class implements a parser that parses strings containing instructions for the
 * Bali Virtual Machine™ and generates the corresponding parse tree structures.
 * 
 * @constructor
 * @param {Boolean} debug Whether of not the parser should be run in debug mode, the
 * default is false. Debug mode is only useful for debugging the language grammar and
 * need not be used otherwise.
 * @returns {Parser} The new string parser.
 */
function Parser(debug) {
    this.debug = debug || false;
    return this;
}
Parser.prototype.constructor = Parser;
exports.Parser = Parser;
exports.parser = new Parser();


/**
 * This function takes a string containing instructions for the Bali Virtual Machine™
 * and parses it into a list of instructions.
 * 
 * @param {String} document The document defining the instructions.
 * @returns {List} The resulting list of instructions.
 */
Parser.prototype.parseDocument = function(document) {
    var parser = initializeParser(document, this.debug);
    var antlrTree = parser.document();
    var list = convertParseTree(antlrTree);
    return list;
};


// PRIVATE FUNCTIONS

function initializeParser(document, debug) {
    var chars = new antlr.InputStream(document);
    var lexer = new grammar.InstructionSetLexer(chars);
    var listener = new CustomErrorListener(debug);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);
    var tokens = new antlr.CommonTokenStream(lexer);
    var parser = new grammar.InstructionSetParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    parser._errHandler = new CustomErrorStrategy();
    return parser;
}


function convertParseTree(antlrTree) {
    var visitor = new ParsingVisitor();
    antlrTree.accept(visitor);
    var instructions = visitor.result;
    return instructions;
}


// PRIVATE CLASSES

function ParsingVisitor() {
    grammar.InstructionSetVisitor.call(this);
    return this;
}
ParsingVisitor.prototype = Object.create(grammar.InstructionSetVisitor.prototype);
ParsingVisitor.prototype.constructor = ParsingVisitor;


// document: EOL* instructions EOL* EOF
ParsingVisitor.prototype.visitDocument = function(ctx) {
    ctx.instructions().accept(this);
};


// instructions: step (EOL step)*
ParsingVisitor.prototype.visitInstructions = function(ctx) {
    var instructions = bali.list();
    var steps = ctx.step();
    steps.forEach(function(step) {
        step.accept(this);
        instructions.addItem(this.result);
    }, this);
    this.result = instructions;
};


// step: label? instruction
ParsingVisitor.prototype.visitStep = function(ctx) {
    ctx.instruction().accept(this);
    var instruction = this.result;
    var label = ctx.label();
    if (label) {
        label.accept(this);
        instruction.setValue('$label', this.result);
    }
    this.result = instruction;
};


// label: EOL? LABEL ':' EOL
ParsingVisitor.prototype.visitLabel = function(ctx) {
    this.result = bali.text(ctx.LABEL().getText());
};


// skipInstruction: 'SKIP INSTRUCTION'
ParsingVisitor.prototype.visitSkipInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.SKIP);
    this.result = instruction;
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
ParsingVisitor.prototype.visitJumpInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.JUMP);
    var modifier = types.ON_ANY;
    if (ctx.children.length > 3) {
        modifier = types.jumpModifierValue(ctx.children[3].getText() + ' ' + ctx.children[4].getText());
    }
    instruction.setValue('$modifier', modifier);
    instruction.setValue('$operand', bali.text(ctx.LABEL().getText()));
    this.result = instruction;
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'PARAMETER' SYMBOL
ParsingVisitor.prototype.visitPushInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.PUSH);
    var modifier = types.pushModifierValue(ctx.children[1].getText());
    instruction.setValue('$modifier', modifier);
    var operand = ctx.children[2].getText();
    var value;
    switch (modifier) {
        case types.HANDLER:
            value = bali.text(operand);  // treat the label as text
            break;
        case types.LITERAL:
            value = bali.parse(operand.slice(1, -1));  // remove the back tick delimeters
            break;
        case types.CONSTANT:
        case types.PARAMETER:
            value = bali.parse(operand);
            break;
    }
    instruction.setValue('$operand', value);
    this.result = instruction;
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
ParsingVisitor.prototype.visitPopInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.POP);
    instruction.setValue('$modifier', types.popModifierValue(ctx.children[1].getText()));
    this.result = instruction;
};


// loadInstruction:
//     'LOAD' 'VARIABLE' variable |
//     'LOAD' 'MESSAGE' variable |
//     'LOAD' 'DRAFT' variable |
//     'LOAD' 'DOCUMENT' variable
ParsingVisitor.prototype.visitLoadInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.LOAD);
    instruction.setValue('$modifier', types.loadModifierValue(ctx.children[1].getText()));
    var variable = ctx.children[2].getText();
    instruction.setValue('$operand', bali.parse(variable));
    this.result = instruction;
};


// storeInstruction:
//     'STORE' 'VARIABLE' variable |
//     'STORE' 'MESSAGE' variable |
//     'STORE' 'DRAFT' variable |
//     'STORE' 'DOCUMENT' variable
ParsingVisitor.prototype.visitStoreInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.STORE);
    instruction.setValue('$modifier', types.storeModifierValue(ctx.children[1].getText()));
    var variable = ctx.children[2].getText();
    instruction.setValue('$operand', bali.parse(variable));
    this.result = instruction;
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
ParsingVisitor.prototype.visitInvokeInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.INVOKE);
    var modifier;
    switch (ctx.children.length) {
        case 2:
            modifier = 0;
            break;
        case 4:
            modifier = 1;
            break;
        case 5:
            modifier = Number(ctx.NUMBER().getText());
            break;
    }
    instruction.setValue('$modifier', modifier);
    instruction.setValue('$operand', bali.parse(ctx.SYMBOL().getText()));
    this.result = instruction;
};


// executeInstruction:
//     'EXECUTE' SYMBOL |
//     'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
ParsingVisitor.prototype.visitExecuteInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.EXECUTE);
    var string = '';
    for (var i = 2; i < ctx.children.length; i++) {
        string += ctx.children[i].getText() + ' ';
    }
    string = string.slice(0, -1);  // strip off last space
    var modifier = types.executeModifierValue(string);
    instruction.setValue('$modifier', modifier);
    instruction.setValue('$operand', bali.parse(ctx.SYMBOL().getText()));
    this.result = instruction;
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
ParsingVisitor.prototype.visitHandleInstruction = function(ctx) {
    var instruction = bali.catalog();
    instruction.setValue('$operation', types.HANDLE);
    instruction.setValue('$modifier', types.handleModifierValue(ctx.children[1].getText()));
    this.result = instruction;
};


// CUSTOM ERROR HANDLING

// override the recover method in the lexer to fail fast
grammar.InstructionSetLexer.prototype.recover = function(e) {
    throw e;
};


function CustomErrorStrategy() {
    ErrorStrategy.DefaultErrorStrategy.call(this);
    return this;
}
CustomErrorStrategy.prototype = Object.create(ErrorStrategy.DefaultErrorStrategy.prototype);
CustomErrorStrategy.prototype.constructor = CustomErrorStrategy;


CustomErrorStrategy.prototype.reportError = function(recognizer, e) {
    recognizer.notifyErrorListeners(e.message, recognizer.getCurrentToken(), e);
};


CustomErrorStrategy.prototype.recover = function(recognizer, e) {
    var context = recognizer._ctx;
    while (context !== null) {
        context.exception = e;
        context = context.parentCtx;
    }
    throw new Error(e.message);
};


CustomErrorStrategy.prototype.recoverInline = function(recognizer) {
    var exception = new antlr.error.InputMismatchException(recognizer);
    this.reportError(recognizer, exception);
    this.recover(recognizer, exception);
};


CustomErrorStrategy.prototype.sync = function(recognizer) {
    // ignore for efficiency
};


function CustomErrorListener(debug) {
    antlr.error.ErrorListener.call(this);
    this.exactOnly = false;  // 'true' results in uninteresting ambiguities so leave 'false'
    this.debug = debug;
    return this;
}
CustomErrorListener.prototype = Object.create(antlr.error.ErrorListener.prototype);
CustomErrorListener.prototype.constructor = CustomErrorListener;


CustomErrorListener.prototype.syntaxError = function(recognizer, offendingToken, lineNumber, columnNumber, message, e) {
    // log a message
    var token = offendingToken ? recognizer.getTokenErrorDisplay(offendingToken) : '';
    var input = token ? offendingToken.getInputStream() : recognizer._input;
    var lines = input.toString().split(EOL);
    var character = lines[lineNumber - 1][columnNumber];
    if (!token) {
        message = "LEXER: An unexpected character was encountered: '" + character + "'";
    } else {
        message = 'PARSER: An invalid token was encountered: ' + token;
    }
    logMessage(recognizer, message);

    // stop processing
    var error = new Error(message);
    throw error;
};


CustomErrorListener.prototype.reportAmbiguity = function(recognizer, dfa, startIndex, stopIndex, exact, alternatives, configs) {
    if (this.debug) {
        var rule = getRule(recognizer, dfa);
        alternatives = [];
        configs.items.forEach(function(item) {
            alternatives.push(item.alt);
        });
        alternatives = "{" + alternatives.join(", ") + "}";
        var message = 'PARSER: Ambiguous input was encountered for rule: ' + rule + ', alternatives: ' + alternatives;
        logMessage(recognizer, message);
    }
};


CustomErrorListener.prototype.reportContextSensitivity = function(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
    if (this.debug) {
        var rule = getRule(recognizer, dfa);
        var message = 'PARSER Encountered a context sensitive rule: ' + rule;
        logMessage(recognizer, message);
    }
};


// PRIVATE FUNCTIONS

function getRule(recognizer, dfa) {
    var description = dfa.decision.toString();
    var ruleIndex = dfa.atnStartState.ruleIndex;

    var ruleNames = recognizer.ruleNames;
    if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
        return description;
    }
    var ruleName = ruleNames[ruleIndex] || '<unknown>';
    return description + " (" + ruleName + ")";
}


function logMessage(recognizer, message) {
    // log the error message
    console.error(message.slice(0, 160));

    // log the lines before and after the invalid line and highlight the invalid token
    var offendingToken = recognizer._precedenceStack ? recognizer.getCurrentToken() : undefined;
    var token = offendingToken ? recognizer.getTokenErrorDisplay(offendingToken) : '';
    var input = token ? offendingToken.getInputStream() : recognizer._input;
    var lines = input.toString().split(EOL);
    var lineNumber = token ? offendingToken.line : recognizer._tokenStartLine;
    var columnNumber = token ? offendingToken.column : recognizer._tokenStartColumn;
    if (lineNumber > 1) {
        console.error(lines[lineNumber - 2]);
    }
    console.error(lines[lineNumber - 1]);
    var line = '';
    for (var i = 0; i < columnNumber; i++) {
        line += ' ';
    }
    var start = token ? offendingToken.start : columnNumber;
    var stop = token ? offendingToken.stop : columnNumber;
    while (start++ <= stop) {
        line += '^';
    }
    console.error(line);
    if (lineNumber < lines.length) console.error(lines[lineNumber]);
}
