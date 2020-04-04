// Generated from src/grammar/InstructionSet.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by InstructionSetParser.
function InstructionSetListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

InstructionSetListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
InstructionSetListener.prototype.constructor = InstructionSetListener;

// Enter a parse tree produced by InstructionSetParser#document.
InstructionSetListener.prototype.enterDocument = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#document.
InstructionSetListener.prototype.exitDocument = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#instructions.
InstructionSetListener.prototype.enterInstructions = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#instructions.
InstructionSetListener.prototype.exitInstructions = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#step.
InstructionSetListener.prototype.enterStep = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#step.
InstructionSetListener.prototype.exitStep = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#label.
InstructionSetListener.prototype.enterLabel = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#label.
InstructionSetListener.prototype.exitLabel = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#variable.
InstructionSetListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#variable.
InstructionSetListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#instruction.
InstructionSetListener.prototype.enterInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#instruction.
InstructionSetListener.prototype.exitInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#skipInstruction.
InstructionSetListener.prototype.enterSkipInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#skipInstruction.
InstructionSetListener.prototype.exitSkipInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#jumpInstruction.
InstructionSetListener.prototype.enterJumpInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#jumpInstruction.
InstructionSetListener.prototype.exitJumpInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#pushInstruction.
InstructionSetListener.prototype.enterPushInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#pushInstruction.
InstructionSetListener.prototype.exitPushInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#popInstruction.
InstructionSetListener.prototype.enterPopInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#popInstruction.
InstructionSetListener.prototype.exitPopInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#loadInstruction.
InstructionSetListener.prototype.enterLoadInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#loadInstruction.
InstructionSetListener.prototype.exitLoadInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#storeInstruction.
InstructionSetListener.prototype.enterStoreInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#storeInstruction.
InstructionSetListener.prototype.exitStoreInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#invokeInstruction.
InstructionSetListener.prototype.enterInvokeInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#invokeInstruction.
InstructionSetListener.prototype.exitInvokeInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#sendInstruction.
InstructionSetListener.prototype.enterSendInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#sendInstruction.
InstructionSetListener.prototype.exitSendInstruction = function(ctx) {
};


// Enter a parse tree produced by InstructionSetParser#handleInstruction.
InstructionSetListener.prototype.enterHandleInstruction = function(ctx) {
};

// Exit a parse tree produced by InstructionSetParser#handleInstruction.
InstructionSetListener.prototype.exitHandleInstruction = function(ctx) {
};



exports.InstructionSetListener = InstructionSetListener;