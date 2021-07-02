// Generated from src/grammar/Document.g4 by ANTLR 4.8
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


// Enter a parse tree produced by DocumentParser#instruction.
DocumentListener.prototype.enterInstruction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#instruction.
DocumentListener.prototype.exitInstruction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#label.
DocumentListener.prototype.enterLabel = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#label.
DocumentListener.prototype.exitLabel = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#action.
DocumentListener.prototype.enterAction = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#action.
DocumentListener.prototype.exitAction = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#note.
DocumentListener.prototype.enterNote = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#note.
DocumentListener.prototype.exitNote = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#skip.
DocumentListener.prototype.enterSkip = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#skip.
DocumentListener.prototype.exitSkip = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#jump.
DocumentListener.prototype.enterJump = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#jump.
DocumentListener.prototype.exitJump = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#push.
DocumentListener.prototype.enterPush = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#push.
DocumentListener.prototype.exitPush = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#pull.
DocumentListener.prototype.enterPull = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#pull.
DocumentListener.prototype.exitPull = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#load.
DocumentListener.prototype.enterLoad = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#load.
DocumentListener.prototype.exitLoad = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#save.
DocumentListener.prototype.enterSave = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#save.
DocumentListener.prototype.exitSave = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#drop.
DocumentListener.prototype.enterDrop = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#drop.
DocumentListener.prototype.exitDrop = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#call.
DocumentListener.prototype.enterCall = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#call.
DocumentListener.prototype.exitCall = function(ctx) {
};


// Enter a parse tree produced by DocumentParser#send.
DocumentListener.prototype.enterSend = function(ctx) {
};

// Exit a parse tree produced by DocumentParser#send.
DocumentListener.prototype.exitSend = function(ctx) {
};



exports.DocumentListener = DocumentListener;