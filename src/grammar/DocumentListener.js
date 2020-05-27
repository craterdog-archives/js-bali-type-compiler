// Generated from src/grammar/Document.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by DocumentParser.
function DocumentListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

DocumentListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
DocumentListener.prototype.constructor = DocumentListener;

// Enter a parse tree produced by DocumentParser#document.
DocumentListener.prototype.enterDocument = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#document.
DocumentListener.prototype.exitDocument = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#instructions.
DocumentListener.prototype.enterInstructions = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#instructions.
DocumentListener.prototype.exitInstructions = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#step.
DocumentListener.prototype.enterStep = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#step.
DocumentListener.prototype.exitStep = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#label.
DocumentListener.prototype.enterLabel = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#label.
DocumentListener.prototype.exitLabel = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#instruction.
DocumentListener.prototype.enterInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#instruction.
DocumentListener.prototype.exitInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#comment.
DocumentListener.prototype.enterComment = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#comment.
DocumentListener.prototype.exitComment = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#skipInstruction.
DocumentListener.prototype.enterSkipInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#skipInstruction.
DocumentListener.prototype.exitSkipInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#jumpInstruction.
DocumentListener.prototype.enterJumpInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#jumpInstruction.
DocumentListener.prototype.exitJumpInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#pushInstruction.
DocumentListener.prototype.enterPushInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#pushInstruction.
DocumentListener.prototype.exitPushInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#pullInstruction.
DocumentListener.prototype.enterPullInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#pullInstruction.
DocumentListener.prototype.exitPullInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#loadInstruction.
DocumentListener.prototype.enterLoadInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#loadInstruction.
DocumentListener.prototype.exitLoadInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#saveInstruction.
DocumentListener.prototype.enterSaveInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#saveInstruction.
DocumentListener.prototype.exitSaveInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#dropInstruction.
DocumentListener.prototype.enterDropInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#dropInstruction.
DocumentListener.prototype.exitDropInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#callInstruction.
DocumentListener.prototype.enterCallInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#callInstruction.
DocumentListener.prototype.exitCallInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#sendInstruction.
DocumentListener.prototype.enterSendInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#sendInstruction.
DocumentListener.prototype.exitSendInstruction = function(ctx) {
};



exports.DocumentListener = DocumentListener;