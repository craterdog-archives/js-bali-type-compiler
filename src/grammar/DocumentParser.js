// Generated from src/grammar/Document.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var DocumentListener = require('./DocumentListener').DocumentListener;
var DocumentVisitor = require('./DocumentVisitor').DocumentVisitor;

var grammarFileName = "Document.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\'\u0087\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0003",
    "\u0002\u0007\u0002\"\n\u0002\f\u0002\u000e\u0002%\u000b\u0002\u0003",
    "\u0002\u0003\u0002\u0007\u0002)\n\u0002\f\u0002\u000e\u0002,\u000b\u0002",
    "\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003",
    "3\n\u0003\f\u0003\u000e\u00036\u000b\u0003\u0003\u0004\u0005\u00049",
    "\n\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0005\u0006L\n\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\b\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0005\tX\n\t\u0003\n\u0003",
    "\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0005\nc",
    "\n\n\u0003\u000b\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000e",
    "\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f",
    "\u0003\u000f\u0003\u000f\u0005\u000f{\n\u000f\u0005\u000f}\n\u000f\u0003",
    "\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0005",
    "\u0010\u0085\n\u0010\u0003\u0010\u0002\u0002\u0011\u0002\u0004\u0006",
    "\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e\u0002\u0006",
    "\u0003\u0002\t\u000b\u0004\u0002\r\r\u0012\u0014\u0003\u0002\u0016\u0019",
    "\u0004\u0002\u0012\u0012\u0017\u0017\u0002\u008b\u0002#\u0003\u0002",
    "\u0002\u0002\u00044\u0003\u0002\u0002\u0002\u00068\u0003\u0002\u0002",
    "\u0002\b<\u0003\u0002\u0002\u0002\nK\u0003\u0002\u0002\u0002\fM\u0003",
    "\u0002\u0002\u0002\u000eO\u0003\u0002\u0002\u0002\u0010R\u0003\u0002",
    "\u0002\u0002\u0012Y\u0003\u0002\u0002\u0002\u0014d\u0003\u0002\u0002",
    "\u0002\u0016g\u0003\u0002\u0002\u0002\u0018k\u0003\u0002\u0002\u0002",
    "\u001ao\u0003\u0002\u0002\u0002\u001cs\u0003\u0002\u0002\u0002\u001e",
    "~\u0003\u0002\u0002\u0002 \"\u0007%\u0002\u0002! \u0003\u0002\u0002",
    "\u0002\"%\u0003\u0002\u0002\u0002#!\u0003\u0002\u0002\u0002#$\u0003",
    "\u0002\u0002\u0002$&\u0003\u0002\u0002\u0002%#\u0003\u0002\u0002\u0002",
    "&*\u0005\u0004\u0003\u0002\')\u0007%\u0002\u0002(\'\u0003\u0002\u0002",
    "\u0002),\u0003\u0002\u0002\u0002*(\u0003\u0002\u0002\u0002*+\u0003\u0002",
    "\u0002\u0002+-\u0003\u0002\u0002\u0002,*\u0003\u0002\u0002\u0002-.\u0007",
    "\u0002\u0002\u0003.\u0003\u0003\u0002\u0002\u0002/0\u0005\u0006\u0004",
    "\u000201\u0007%\u0002\u000213\u0003\u0002\u0002\u00022/\u0003\u0002",
    "\u0002\u000236\u0003\u0002\u0002\u000242\u0003\u0002\u0002\u000245\u0003",
    "\u0002\u0002\u00025\u0005\u0003\u0002\u0002\u000264\u0003\u0002\u0002",
    "\u000279\u0005\b\u0005\u000287\u0003\u0002\u0002\u000289\u0003\u0002",
    "\u0002\u00029:\u0003\u0002\u0002\u0002:;\u0005\n\u0006\u0002;\u0007",
    "\u0003\u0002\u0002\u0002<=\u0007%\u0002\u0002=>\u0007!\u0002\u0002>",
    "?\u0007\u0003\u0002\u0002?@\u0007%\u0002\u0002@\t\u0003\u0002\u0002",
    "\u0002AL\u0005\f\u0007\u0002BL\u0005\u000e\b\u0002CL\u0005\u0010\t\u0002",
    "DL\u0005\u0012\n\u0002EL\u0005\u0014\u000b\u0002FL\u0005\u0016\f\u0002",
    "GL\u0005\u0018\r\u0002HL\u0005\u001a\u000e\u0002IL\u0005\u001c\u000f",
    "\u0002JL\u0005\u001e\u0010\u0002KA\u0003\u0002\u0002\u0002KB\u0003\u0002",
    "\u0002\u0002KC\u0003\u0002\u0002\u0002KD\u0003\u0002\u0002\u0002KE\u0003",
    "\u0002\u0002\u0002KF\u0003\u0002\u0002\u0002KG\u0003\u0002\u0002\u0002",
    "KH\u0003\u0002\u0002\u0002KI\u0003\u0002\u0002\u0002KJ\u0003\u0002\u0002",
    "\u0002L\u000b\u0003\u0002\u0002\u0002MN\u0007\'\u0002\u0002N\r\u0003",
    "\u0002\u0002\u0002OP\u0007\u0004\u0002\u0002PQ\u0007\u0005\u0002\u0002",
    "Q\u000f\u0003\u0002\u0002\u0002RS\u0007\u0006\u0002\u0002ST\u0007\u0007",
    "\u0002\u0002TW\u0007!\u0002\u0002UV\u0007\b\u0002\u0002VX\t\u0002\u0002",
    "\u0002WU\u0003\u0002\u0002\u0002WX\u0003\u0002\u0002\u0002X\u0011\u0003",
    "\u0002\u0002\u0002Yb\u0007\f\u0002\u0002Z[\u0007\r\u0002\u0002[c\u0007",
    "!\u0002\u0002\\]\u0007\u000e\u0002\u0002]c\u0007#\u0002\u0002^_\u0007",
    "\u000f\u0002\u0002_c\u0007$\u0002\u0002`a\u0007\u0010\u0002\u0002ac",
    "\u0007$\u0002\u0002bZ\u0003\u0002\u0002\u0002b\\\u0003\u0002\u0002\u0002",
    "b^\u0003\u0002\u0002\u0002b`\u0003\u0002\u0002\u0002c\u0013\u0003\u0002",
    "\u0002\u0002de\u0007\u0011\u0002\u0002ef\t\u0003\u0002\u0002f\u0015",
    "\u0003\u0002\u0002\u0002gh\u0007\u0015\u0002\u0002hi\t\u0004\u0002\u0002",
    "ij\u0007$\u0002\u0002j\u0017\u0003\u0002\u0002\u0002kl\u0007\u001a\u0002",
    "\u0002lm\t\u0004\u0002\u0002mn\u0007$\u0002\u0002n\u0019\u0003\u0002",
    "\u0002\u0002op\u0007\u001b\u0002\u0002pq\t\u0004\u0002\u0002qr\u0007",
    "$\u0002\u0002r\u001b\u0003\u0002\u0002\u0002st\u0007\u001c\u0002\u0002",
    "t|\u0007$\u0002\u0002uz\u0007\u001d\u0002\u0002vw\u0007\u001e\u0002",
    "\u0002w{\u0007\u0010\u0002\u0002xy\u0007\"\u0002\u0002y{\u0007\u001f",
    "\u0002\u0002zv\u0003\u0002\u0002\u0002zx\u0003\u0002\u0002\u0002{}\u0003",
    "\u0002\u0002\u0002|u\u0003\u0002\u0002\u0002|}\u0003\u0002\u0002\u0002",
    "}\u001d\u0003\u0002\u0002\u0002~\u007f\u0007 \u0002\u0002\u007f\u0080",
    "\u0007$\u0002\u0002\u0080\u0081\u0007\u0007\u0002\u0002\u0081\u0084",
    "\t\u0005\u0002\u0002\u0082\u0083\u0007\u001d\u0002\u0002\u0083\u0085",
    "\u0007\u001f\u0002\u0002\u0084\u0082\u0003\u0002\u0002\u0002\u0084\u0085",
    "\u0003\u0002\u0002\u0002\u0085\u001f\u0003\u0002\u0002\u0002\f#*48K",
    "Wbz|\u0084"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "':'", "'SKIP'", "'INSTRUCTION'", "'JUMP'", "'TO'", 
                     "'ON'", "'NONE'", "'TRUE'", "'FALSE'", "'PUSH'", "'HANDLER'", 
                     "'LITERAL'", "'CONSTANT'", "'ARGUMENT'", "'PULL'", 
                     "'COMPONENT'", "'RESULT'", "'EXCEPTION'", "'LOAD'", 
                     "'REGISTER'", "'DOCUMENT'", "'CONTRACT'", "'MESSAGE'", 
                     "'SAVE'", "'DROP'", "'CALL'", "'WITH'", "'1'", "'ARGUMENTS'", 
                     "'SEND'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, "LABEL", "NUMBER", "LITERAL", 
                      "SYMBOL", "EOL", "SPACE", "COMMENT" ];

var ruleNames =  [ "document", "instructions", "step", "label", "instruction", 
                   "comment", "skipInstruction", "jumpInstruction", "pushInstruction", 
                   "pullInstruction", "loadInstruction", "saveInstruction", 
                   "dropInstruction", "callInstruction", "sendInstruction" ];

function DocumentParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

DocumentParser.prototype = Object.create(antlr4.Parser.prototype);
DocumentParser.prototype.constructor = DocumentParser;

Object.defineProperty(DocumentParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

DocumentParser.EOF = antlr4.Token.EOF;
DocumentParser.T__0 = 1;
DocumentParser.T__1 = 2;
DocumentParser.T__2 = 3;
DocumentParser.T__3 = 4;
DocumentParser.T__4 = 5;
DocumentParser.T__5 = 6;
DocumentParser.T__6 = 7;
DocumentParser.T__7 = 8;
DocumentParser.T__8 = 9;
DocumentParser.T__9 = 10;
DocumentParser.T__10 = 11;
DocumentParser.T__11 = 12;
DocumentParser.T__12 = 13;
DocumentParser.T__13 = 14;
DocumentParser.T__14 = 15;
DocumentParser.T__15 = 16;
DocumentParser.T__16 = 17;
DocumentParser.T__17 = 18;
DocumentParser.T__18 = 19;
DocumentParser.T__19 = 20;
DocumentParser.T__20 = 21;
DocumentParser.T__21 = 22;
DocumentParser.T__22 = 23;
DocumentParser.T__23 = 24;
DocumentParser.T__24 = 25;
DocumentParser.T__25 = 26;
DocumentParser.T__26 = 27;
DocumentParser.T__27 = 28;
DocumentParser.T__28 = 29;
DocumentParser.T__29 = 30;
DocumentParser.LABEL = 31;
DocumentParser.NUMBER = 32;
DocumentParser.LITERAL = 33;
DocumentParser.SYMBOL = 34;
DocumentParser.EOL = 35;
DocumentParser.SPACE = 36;
DocumentParser.COMMENT = 37;

DocumentParser.RULE_document = 0;
DocumentParser.RULE_instructions = 1;
DocumentParser.RULE_step = 2;
DocumentParser.RULE_label = 3;
DocumentParser.RULE_instruction = 4;
DocumentParser.RULE_comment = 5;
DocumentParser.RULE_skipInstruction = 6;
DocumentParser.RULE_jumpInstruction = 7;
DocumentParser.RULE_pushInstruction = 8;
DocumentParser.RULE_pullInstruction = 9;
DocumentParser.RULE_loadInstruction = 10;
DocumentParser.RULE_saveInstruction = 11;
DocumentParser.RULE_dropInstruction = 12;
DocumentParser.RULE_callInstruction = 13;
DocumentParser.RULE_sendInstruction = 14;

function DocumentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_document;
    return this;
}

DocumentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DocumentContext.prototype.constructor = DocumentContext;

DocumentContext.prototype.instructions = function() {
    return this.getTypedRuleContext(InstructionsContext,0);
};

DocumentContext.prototype.EOF = function() {
    return this.getToken(DocumentParser.EOF, 0);
};

DocumentContext.prototype.EOL = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(DocumentParser.EOL);
    } else {
        return this.getToken(DocumentParser.EOL, i);
    }
};


DocumentContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterDocument(this);
	}
};

DocumentContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitDocument(this);
	}
};

DocumentContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitDocument(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.DocumentContext = DocumentContext;

DocumentParser.prototype.document = function() {

    var localctx = new DocumentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, DocumentParser.RULE_document);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 33;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 30;
                this.match(DocumentParser.EOL); 
            }
            this.state = 35;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
        }

        this.state = 36;
        this.instructions();
        this.state = 40;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===DocumentParser.EOL) {
            this.state = 37;
            this.match(DocumentParser.EOL);
            this.state = 42;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 43;
        this.match(DocumentParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function InstructionsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_instructions;
    return this;
}

InstructionsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InstructionsContext.prototype.constructor = InstructionsContext;

InstructionsContext.prototype.step = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(StepContext);
    } else {
        return this.getTypedRuleContext(StepContext,i);
    }
};

InstructionsContext.prototype.EOL = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(DocumentParser.EOL);
    } else {
        return this.getToken(DocumentParser.EOL, i);
    }
};


InstructionsContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterInstructions(this);
	}
};

InstructionsContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitInstructions(this);
	}
};

InstructionsContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitInstructions(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.InstructionsContext = InstructionsContext;

DocumentParser.prototype.instructions = function() {

    var localctx = new InstructionsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, DocumentParser.RULE_instructions);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 50;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 45;
                this.step();
                this.state = 46;
                this.match(DocumentParser.EOL); 
            }
            this.state = 52;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function StepContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_step;
    return this;
}

StepContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StepContext.prototype.constructor = StepContext;

StepContext.prototype.instruction = function() {
    return this.getTypedRuleContext(InstructionContext,0);
};

StepContext.prototype.label = function() {
    return this.getTypedRuleContext(LabelContext,0);
};

StepContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterStep(this);
	}
};

StepContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitStep(this);
	}
};

StepContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitStep(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.StepContext = StepContext;

DocumentParser.prototype.step = function() {

    var localctx = new StepContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, DocumentParser.RULE_step);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 54;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.EOL) {
            this.state = 53;
            this.label();
        }

        this.state = 56;
        this.instruction();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function LabelContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_label;
    return this;
}

LabelContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LabelContext.prototype.constructor = LabelContext;

LabelContext.prototype.EOL = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(DocumentParser.EOL);
    } else {
        return this.getToken(DocumentParser.EOL, i);
    }
};


LabelContext.prototype.LABEL = function() {
    return this.getToken(DocumentParser.LABEL, 0);
};

LabelContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterLabel(this);
	}
};

LabelContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitLabel(this);
	}
};

LabelContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitLabel(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.LabelContext = LabelContext;

DocumentParser.prototype.label = function() {

    var localctx = new LabelContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, DocumentParser.RULE_label);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 58;
        this.match(DocumentParser.EOL);
        this.state = 59;
        this.match(DocumentParser.LABEL);
        this.state = 60;
        this.match(DocumentParser.T__0);
        this.state = 61;
        this.match(DocumentParser.EOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function InstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_instruction;
    return this;
}

InstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InstructionContext.prototype.constructor = InstructionContext;

InstructionContext.prototype.comment = function() {
    return this.getTypedRuleContext(CommentContext,0);
};

InstructionContext.prototype.skipInstruction = function() {
    return this.getTypedRuleContext(SkipInstructionContext,0);
};

InstructionContext.prototype.jumpInstruction = function() {
    return this.getTypedRuleContext(JumpInstructionContext,0);
};

InstructionContext.prototype.pushInstruction = function() {
    return this.getTypedRuleContext(PushInstructionContext,0);
};

InstructionContext.prototype.pullInstruction = function() {
    return this.getTypedRuleContext(PullInstructionContext,0);
};

InstructionContext.prototype.loadInstruction = function() {
    return this.getTypedRuleContext(LoadInstructionContext,0);
};

InstructionContext.prototype.saveInstruction = function() {
    return this.getTypedRuleContext(SaveInstructionContext,0);
};

InstructionContext.prototype.dropInstruction = function() {
    return this.getTypedRuleContext(DropInstructionContext,0);
};

InstructionContext.prototype.callInstruction = function() {
    return this.getTypedRuleContext(CallInstructionContext,0);
};

InstructionContext.prototype.sendInstruction = function() {
    return this.getTypedRuleContext(SendInstructionContext,0);
};

InstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterInstruction(this);
	}
};

InstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitInstruction(this);
	}
};

InstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.InstructionContext = InstructionContext;

DocumentParser.prototype.instruction = function() {

    var localctx = new InstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, DocumentParser.RULE_instruction);
    try {
        this.state = 73;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.COMMENT:
            this.enterOuterAlt(localctx, 1);
            this.state = 63;
            this.comment();
            break;
        case DocumentParser.T__1:
            this.enterOuterAlt(localctx, 2);
            this.state = 64;
            this.skipInstruction();
            break;
        case DocumentParser.T__3:
            this.enterOuterAlt(localctx, 3);
            this.state = 65;
            this.jumpInstruction();
            break;
        case DocumentParser.T__9:
            this.enterOuterAlt(localctx, 4);
            this.state = 66;
            this.pushInstruction();
            break;
        case DocumentParser.T__14:
            this.enterOuterAlt(localctx, 5);
            this.state = 67;
            this.pullInstruction();
            break;
        case DocumentParser.T__18:
            this.enterOuterAlt(localctx, 6);
            this.state = 68;
            this.loadInstruction();
            break;
        case DocumentParser.T__23:
            this.enterOuterAlt(localctx, 7);
            this.state = 69;
            this.saveInstruction();
            break;
        case DocumentParser.T__24:
            this.enterOuterAlt(localctx, 8);
            this.state = 70;
            this.dropInstruction();
            break;
        case DocumentParser.T__25:
            this.enterOuterAlt(localctx, 9);
            this.state = 71;
            this.callInstruction();
            break;
        case DocumentParser.T__29:
            this.enterOuterAlt(localctx, 10);
            this.state = 72;
            this.sendInstruction();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function CommentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_comment;
    return this;
}

CommentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommentContext.prototype.constructor = CommentContext;

CommentContext.prototype.COMMENT = function() {
    return this.getToken(DocumentParser.COMMENT, 0);
};

CommentContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterComment(this);
	}
};

CommentContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitComment(this);
	}
};

CommentContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitComment(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.CommentContext = CommentContext;

DocumentParser.prototype.comment = function() {

    var localctx = new CommentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, DocumentParser.RULE_comment);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 75;
        this.match(DocumentParser.COMMENT);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SkipInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_skipInstruction;
    return this;
}

SkipInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SkipInstructionContext.prototype.constructor = SkipInstructionContext;


SkipInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterSkipInstruction(this);
	}
};

SkipInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitSkipInstruction(this);
	}
};

SkipInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitSkipInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.SkipInstructionContext = SkipInstructionContext;

DocumentParser.prototype.skipInstruction = function() {

    var localctx = new SkipInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, DocumentParser.RULE_skipInstruction);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 77;
        this.match(DocumentParser.T__1);
        this.state = 78;
        this.match(DocumentParser.T__2);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function JumpInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_jumpInstruction;
    return this;
}

JumpInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
JumpInstructionContext.prototype.constructor = JumpInstructionContext;

JumpInstructionContext.prototype.LABEL = function() {
    return this.getToken(DocumentParser.LABEL, 0);
};

JumpInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterJumpInstruction(this);
	}
};

JumpInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitJumpInstruction(this);
	}
};

JumpInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitJumpInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.JumpInstructionContext = JumpInstructionContext;

DocumentParser.prototype.jumpInstruction = function() {

    var localctx = new JumpInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, DocumentParser.RULE_jumpInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 80;
        this.match(DocumentParser.T__3);
        this.state = 81;
        this.match(DocumentParser.T__4);
        this.state = 82;
        this.match(DocumentParser.LABEL);
        this.state = 85;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__5) {
            this.state = 83;
            this.match(DocumentParser.T__5);
            this.state = 84;
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__6) | (1 << DocumentParser.T__7) | (1 << DocumentParser.T__8))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function PushInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_pushInstruction;
    return this;
}

PushInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PushInstructionContext.prototype.constructor = PushInstructionContext;

PushInstructionContext.prototype.LABEL = function() {
    return this.getToken(DocumentParser.LABEL, 0);
};

PushInstructionContext.prototype.LITERAL = function() {
    return this.getToken(DocumentParser.LITERAL, 0);
};

PushInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

PushInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterPushInstruction(this);
	}
};

PushInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitPushInstruction(this);
	}
};

PushInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitPushInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.PushInstructionContext = PushInstructionContext;

DocumentParser.prototype.pushInstruction = function() {

    var localctx = new PushInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, DocumentParser.RULE_pushInstruction);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 87;
        this.match(DocumentParser.T__9);
        this.state = 96;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__10:
            this.state = 88;
            this.match(DocumentParser.T__10);
            this.state = 89;
            this.match(DocumentParser.LABEL);
            break;
        case DocumentParser.T__11:
            this.state = 90;
            this.match(DocumentParser.T__11);
            this.state = 91;
            this.match(DocumentParser.LITERAL);
            break;
        case DocumentParser.T__12:
            this.state = 92;
            this.match(DocumentParser.T__12);
            this.state = 93;
            this.match(DocumentParser.SYMBOL);
            break;
        case DocumentParser.T__13:
            this.state = 94;
            this.match(DocumentParser.T__13);
            this.state = 95;
            this.match(DocumentParser.SYMBOL);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function PullInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_pullInstruction;
    return this;
}

PullInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PullInstructionContext.prototype.constructor = PullInstructionContext;


PullInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterPullInstruction(this);
	}
};

PullInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitPullInstruction(this);
	}
};

PullInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitPullInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.PullInstructionContext = PullInstructionContext;

DocumentParser.prototype.pullInstruction = function() {

    var localctx = new PullInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, DocumentParser.RULE_pullInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 98;
        this.match(DocumentParser.T__14);
        this.state = 99;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__10) | (1 << DocumentParser.T__15) | (1 << DocumentParser.T__16) | (1 << DocumentParser.T__17))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function LoadInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_loadInstruction;
    return this;
}

LoadInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LoadInstructionContext.prototype.constructor = LoadInstructionContext;

LoadInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

LoadInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterLoadInstruction(this);
	}
};

LoadInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitLoadInstruction(this);
	}
};

LoadInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitLoadInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.LoadInstructionContext = LoadInstructionContext;

DocumentParser.prototype.loadInstruction = function() {

    var localctx = new LoadInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, DocumentParser.RULE_loadInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 101;
        this.match(DocumentParser.T__18);
        this.state = 102;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__19) | (1 << DocumentParser.T__20) | (1 << DocumentParser.T__21) | (1 << DocumentParser.T__22))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 103;
        this.match(DocumentParser.SYMBOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SaveInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_saveInstruction;
    return this;
}

SaveInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SaveInstructionContext.prototype.constructor = SaveInstructionContext;

SaveInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

SaveInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterSaveInstruction(this);
	}
};

SaveInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitSaveInstruction(this);
	}
};

SaveInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitSaveInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.SaveInstructionContext = SaveInstructionContext;

DocumentParser.prototype.saveInstruction = function() {

    var localctx = new SaveInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, DocumentParser.RULE_saveInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 105;
        this.match(DocumentParser.T__23);
        this.state = 106;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__19) | (1 << DocumentParser.T__20) | (1 << DocumentParser.T__21) | (1 << DocumentParser.T__22))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 107;
        this.match(DocumentParser.SYMBOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DropInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_dropInstruction;
    return this;
}

DropInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DropInstructionContext.prototype.constructor = DropInstructionContext;

DropInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

DropInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterDropInstruction(this);
	}
};

DropInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitDropInstruction(this);
	}
};

DropInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitDropInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.DropInstructionContext = DropInstructionContext;

DocumentParser.prototype.dropInstruction = function() {

    var localctx = new DropInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, DocumentParser.RULE_dropInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 109;
        this.match(DocumentParser.T__24);
        this.state = 110;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__19) | (1 << DocumentParser.T__20) | (1 << DocumentParser.T__21) | (1 << DocumentParser.T__22))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 111;
        this.match(DocumentParser.SYMBOL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function CallInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_callInstruction;
    return this;
}

CallInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CallInstructionContext.prototype.constructor = CallInstructionContext;

CallInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

CallInstructionContext.prototype.NUMBER = function() {
    return this.getToken(DocumentParser.NUMBER, 0);
};

CallInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterCallInstruction(this);
	}
};

CallInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitCallInstruction(this);
	}
};

CallInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitCallInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.CallInstructionContext = CallInstructionContext;

DocumentParser.prototype.callInstruction = function() {

    var localctx = new CallInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, DocumentParser.RULE_callInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 113;
        this.match(DocumentParser.T__25);
        this.state = 114;
        this.match(DocumentParser.SYMBOL);
        this.state = 122;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__26) {
            this.state = 115;
            this.match(DocumentParser.T__26);
            this.state = 120;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case DocumentParser.T__27:
                this.state = 116;
                this.match(DocumentParser.T__27);
                this.state = 117;
                this.match(DocumentParser.T__13);
                break;
            case DocumentParser.NUMBER:
                this.state = 118;
                this.match(DocumentParser.NUMBER);
                this.state = 119;
                this.match(DocumentParser.T__28);
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SendInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_sendInstruction;
    return this;
}

SendInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SendInstructionContext.prototype.constructor = SendInstructionContext;

SendInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

SendInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterSendInstruction(this);
	}
};

SendInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitSendInstruction(this);
	}
};

SendInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitSendInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.SendInstructionContext = SendInstructionContext;

DocumentParser.prototype.sendInstruction = function() {

    var localctx = new SendInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, DocumentParser.RULE_sendInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 124;
        this.match(DocumentParser.T__29);
        this.state = 125;
        this.match(DocumentParser.SYMBOL);
        this.state = 126;
        this.match(DocumentParser.T__4);
        this.state = 127;
        _la = this._input.LA(1);
        if(!(_la===DocumentParser.T__15 || _la===DocumentParser.T__20)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 130;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__26) {
            this.state = 128;
            this.match(DocumentParser.T__26);
            this.state = 129;
            this.match(DocumentParser.T__28);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.DocumentParser = DocumentParser;
