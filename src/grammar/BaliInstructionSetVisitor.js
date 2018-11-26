// Generated from src/grammar/BaliInstructionSet.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by BaliInstructionSetParser.

function BaliInstructionSetVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

BaliInstructionSetVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
BaliInstructionSetVisitor.prototype.constructor = BaliInstructionSetVisitor;

// Visit a parse tree produced by BaliInstructionSetParser#procedure.
BaliInstructionSetVisitor.prototype.visitProcedure = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#step.
BaliInstructionSetVisitor.prototype.visitStep = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#label.
BaliInstructionSetVisitor.prototype.visitLabel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#instruction.
BaliInstructionSetVisitor.prototype.visitInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#skipInstruction.
BaliInstructionSetVisitor.prototype.visitSkipInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#jumpInstruction.
BaliInstructionSetVisitor.prototype.visitJumpInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#pushInstruction.
BaliInstructionSetVisitor.prototype.visitPushInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#popInstruction.
BaliInstructionSetVisitor.prototype.visitPopInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#loadInstruction.
BaliInstructionSetVisitor.prototype.visitLoadInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#storeInstruction.
BaliInstructionSetVisitor.prototype.visitStoreInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#invokeInstruction.
BaliInstructionSetVisitor.prototype.visitInvokeInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#executeInstruction.
BaliInstructionSetVisitor.prototype.visitExecuteInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by BaliInstructionSetParser#handleInstruction.
BaliInstructionSetVisitor.prototype.visitHandleInstruction = function(ctx) {
  return this.visitChildren(ctx);
};



exports.BaliInstructionSetVisitor = BaliInstructionSetVisitor;