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


// Enter a parse tree produced by DocumentParser#variable.
DocumentListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#variable.
DocumentListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#instruction.
DocumentListener.prototype.enterInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#instruction.
DocumentListener.prototype.exitInstruction = function(ctx) {
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


// Enter a parse tree produced by DocumentParser#popInstruction.
DocumentListener.prototype.enterPopInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#popInstruction.
DocumentListener.prototype.exitPopInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#loadInstruction.
DocumentListener.prototype.enterLoadInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#loadInstruction.
DocumentListener.prototype.exitLoadInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#storeInstruction.
DocumentListener.prototype.enterStoreInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#storeInstruction.
DocumentListener.prototype.exitStoreInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#invokeInstruction.
DocumentListener.prototype.enterInvokeInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#invokeInstruction.
DocumentListener.prototype.exitInvokeInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#sendInstruction.
DocumentListener.prototype.enterSendInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#sendInstruction.
DocumentListener.prototype.exitSendInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#handleInstruction.
DocumentListener.prototype.enterHandleInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#handleInstruction.
DocumentListener.prototype.exitHandleInstruction = function(ctx) {
};



exports.DocumentListener = DocumentListener;