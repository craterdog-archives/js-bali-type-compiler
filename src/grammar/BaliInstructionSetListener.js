// Generated from src/grammar/BaliInstructionSet.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by BaliInstructionSetParser.
function BaliInstructionSetListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

BaliInstructionSetListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
BaliInstructionSetListener.prototype.constructor = BaliInstructionSetListener;

// Enter a parse tree produced by BaliInstructionSetParser#procedure.
BaliInstructionSetListener.prototype.enterProcedure = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#procedure.
BaliInstructionSetListener.prototype.exitProcedure = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#step.
BaliInstructionSetListener.prototype.enterStep = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#step.
BaliInstructionSetListener.prototype.exitStep = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#label.
BaliInstructionSetListener.prototype.enterLabel = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#label.
BaliInstructionSetListener.prototype.exitLabel = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#instruction.
BaliInstructionSetListener.prototype.enterInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#instruction.
BaliInstructionSetListener.prototype.exitInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#skipInstruction.
BaliInstructionSetListener.prototype.enterSkipInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#skipInstruction.
BaliInstructionSetListener.prototype.exitSkipInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#jumpInstruction.
BaliInstructionSetListener.prototype.enterJumpInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#jumpInstruction.
BaliInstructionSetListener.prototype.exitJumpInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#pushInstruction.
BaliInstructionSetListener.prototype.enterPushInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#pushInstruction.
BaliInstructionSetListener.prototype.exitPushInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#popInstruction.
BaliInstructionSetListener.prototype.enterPopInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#popInstruction.
BaliInstructionSetListener.prototype.exitPopInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#loadInstruction.
BaliInstructionSetListener.prototype.enterLoadInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#loadInstruction.
BaliInstructionSetListener.prototype.exitLoadInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#storeInstruction.
BaliInstructionSetListener.prototype.enterStoreInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#storeInstruction.
BaliInstructionSetListener.prototype.exitStoreInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#invokeInstruction.
BaliInstructionSetListener.prototype.enterInvokeInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#invokeInstruction.
BaliInstructionSetListener.prototype.exitInvokeInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#executeInstruction.
BaliInstructionSetListener.prototype.enterExecuteInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#executeInstruction.
BaliInstructionSetListener.prototype.exitExecuteInstruction = function(ctx) {
};


// Enter a parse tree produced by BaliInstructionSetParser#handleInstruction.
BaliInstructionSetListener.prototype.enterHandleInstruction = function(ctx) {
};

// Exit a parse tree produced by BaliInstructionSetParser#handleInstruction.
BaliInstructionSetListener.prototype.exitHandleInstruction = function(ctx) {
};



exports.BaliInstructionSetListener = BaliInstructionSetListener;