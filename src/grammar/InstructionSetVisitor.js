// Generated from src/grammar/InstructionSet.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by InstructionSetParser.

function InstructionSetVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

InstructionSetVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
InstructionSetVisitor.prototype.constructor = InstructionSetVisitor;

// Visit a parse tree produced by InstructionSetParser#document.
InstructionSetVisitor.prototype.visitDocument = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#instructions.
InstructionSetVisitor.prototype.visitInstructions = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#step.
InstructionSetVisitor.prototype.visitStep = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#label.
InstructionSetVisitor.prototype.visitLabel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#instruction.
InstructionSetVisitor.prototype.visitInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#skipInstruction.
InstructionSetVisitor.prototype.visitSkipInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#jumpInstruction.
InstructionSetVisitor.prototype.visitJumpInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#pushInstruction.
InstructionSetVisitor.prototype.visitPushInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#popInstruction.
InstructionSetVisitor.prototype.visitPopInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#loadInstruction.
InstructionSetVisitor.prototype.visitLoadInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#storeInstruction.
InstructionSetVisitor.prototype.visitStoreInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#invokeInstruction.
InstructionSetVisitor.prototype.visitInvokeInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#executeInstruction.
InstructionSetVisitor.prototype.visitExecuteInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by InstructionSetParser#handleInstruction.
InstructionSetVisitor.prototype.visitHandleInstruction = function(ctx) {
  return this.visitChildren(ctx);
};



exports.InstructionSetVisitor = InstructionSetVisitor;