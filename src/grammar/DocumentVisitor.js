// Generated from src/grammar/Document.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by DocumentParser.

function DocumentVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

DocumentVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
DocumentVisitor.prototype.constructor = DocumentVisitor;

// Visit a parse tree produced by DocumentParser#document.
DocumentVisitor.prototype.visitDocument = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#instructions.
DocumentVisitor.prototype.visitInstructions = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#instruction.
DocumentVisitor.prototype.visitInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#label.
DocumentVisitor.prototype.visitLabel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#action.
DocumentVisitor.prototype.visitAction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#note.
DocumentVisitor.prototype.visitNote = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#skip.
DocumentVisitor.prototype.visitSkip = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#jump.
DocumentVisitor.prototype.visitJump = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#push.
DocumentVisitor.prototype.visitPush = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#pull.
DocumentVisitor.prototype.visitPull = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#load.
DocumentVisitor.prototype.visitLoad = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#save.
DocumentVisitor.prototype.visitSave = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#drop.
DocumentVisitor.prototype.visitDrop = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#call.
DocumentVisitor.prototype.visitCall = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#send.
DocumentVisitor.prototype.visitSend = function(ctx) {
  return this.visitChildren(ctx);
};



exports.DocumentVisitor = DocumentVisitor;