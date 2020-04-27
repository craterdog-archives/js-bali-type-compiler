// Generated from src/grammar/Document.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var DocumentListener = require('./DocumentListener').DocumentListener;
var DocumentVisitor = require('./DocumentVisitor').DocumentVisitor;

var grammarFileName = "Document.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003&\u008e\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0003",
    "\u0002\u0007\u0002\"\n\u0002\f\u0002\u000e\u0002%\u000b\u0002\u0003",
    "\u0002\u0003\u0002\u0007\u0002)\n\u0002\f\u0002\u000e\u0002,\u000b\u0002",
    "\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003",
    "3\n\u0003\f\u0003\u000e\u00036\u000b\u0003\u0003\u0004\u0005\u00049",
    "\n\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0005\u0005>\n\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0005\u0007O\n\u0007\u0003\b\u0003\b",
    "\u0003\b\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0005\tY\n\t\u0003",
    "\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0005",
    "\nd\n\n\u0003\u000b\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003\f",
    "\u0003\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0005\u000ex",
    "\n\u000e\u0005\u000ez\n\u000e\u0003\u000f\u0003\u000f\u0003\u000f\u0003",
    "\u000f\u0003\u000f\u0003\u000f\u0005\u000f\u0082\n\u000f\u0003\u000f",
    "\u0003\u000f\u0003\u000f\u0005\u000f\u0087\n\u000f\u0005\u000f\u0089",
    "\n\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0002\u0002",
    "\u0011\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a",
    "\u001c\u001e\u0002\u0006\u0003\u0002\t\u000b\u0004\u0002\r\r\u0012\u0012",
    "\u0003\u0002\u0014\u0017\u0003\u0002\u001f \u0002\u0094\u0002#\u0003",
    "\u0002\u0002\u0002\u0004/\u0003\u0002\u0002\u0002\u00068\u0003\u0002",
    "\u0002\u0002\b=\u0003\u0002\u0002\u0002\nC\u0003\u0002\u0002\u0002\f",
    "N\u0003\u0002\u0002\u0002\u000eP\u0003\u0002\u0002\u0002\u0010S\u0003",
    "\u0002\u0002\u0002\u0012Z\u0003\u0002\u0002\u0002\u0014e\u0003\u0002",
    "\u0002\u0002\u0016h\u0003\u0002\u0002\u0002\u0018l\u0003\u0002\u0002",
    "\u0002\u001ap\u0003\u0002\u0002\u0002\u001c{\u0003\u0002\u0002\u0002",
    "\u001e\u008a\u0003\u0002\u0002\u0002 \"\u0007%\u0002\u0002! \u0003\u0002",
    "\u0002\u0002\"%\u0003\u0002\u0002\u0002#!\u0003\u0002\u0002\u0002#$",
    "\u0003\u0002\u0002\u0002$&\u0003\u0002\u0002\u0002%#\u0003\u0002\u0002",
    "\u0002&*\u0005\u0004\u0003\u0002\')\u0007%\u0002\u0002(\'\u0003\u0002",
    "\u0002\u0002),\u0003\u0002\u0002\u0002*(\u0003\u0002\u0002\u0002*+\u0003",
    "\u0002\u0002\u0002+-\u0003\u0002\u0002\u0002,*\u0003\u0002\u0002\u0002",
    "-.\u0007\u0002\u0002\u0003.\u0003\u0003\u0002\u0002\u0002/4\u0005\u0006",
    "\u0004\u000201\u0007%\u0002\u000213\u0005\u0006\u0004\u000220\u0003",
    "\u0002\u0002\u000236\u0003\u0002\u0002\u000242\u0003\u0002\u0002\u0002",
    "45\u0003\u0002\u0002\u00025\u0005\u0003\u0002\u0002\u000264\u0003\u0002",
    "\u0002\u000279\u0005\b\u0005\u000287\u0003\u0002\u0002\u000289\u0003",
    "\u0002\u0002\u00029:\u0003\u0002\u0002\u0002:;\u0005\f\u0007\u0002;",
    "\u0007\u0003\u0002\u0002\u0002<>\u0007%\u0002\u0002=<\u0003\u0002\u0002",
    "\u0002=>\u0003\u0002\u0002\u0002>?\u0003\u0002\u0002\u0002?@\u0007!",
    "\u0002\u0002@A\u0007\u0003\u0002\u0002AB\u0007%\u0002\u0002B\t\u0003",
    "\u0002\u0002\u0002CD\u0007$\u0002\u0002D\u000b\u0003\u0002\u0002\u0002",
    "EO\u0005\u000e\b\u0002FO\u0005\u0010\t\u0002GO\u0005\u0012\n\u0002H",
    "O\u0005\u0014\u000b\u0002IO\u0005\u0016\f\u0002JO\u0005\u0018\r\u0002",
    "KO\u0005\u001a\u000e\u0002LO\u0005\u001c\u000f\u0002MO\u0005\u001e\u0010",
    "\u0002NE\u0003\u0002\u0002\u0002NF\u0003\u0002\u0002\u0002NG\u0003\u0002",
    "\u0002\u0002NH\u0003\u0002\u0002\u0002NI\u0003\u0002\u0002\u0002NJ\u0003",
    "\u0002\u0002\u0002NK\u0003\u0002\u0002\u0002NL\u0003\u0002\u0002\u0002",
    "NM\u0003\u0002\u0002\u0002O\r\u0003\u0002\u0002\u0002PQ\u0007\u0004",
    "\u0002\u0002QR\u0007\u0005\u0002\u0002R\u000f\u0003\u0002\u0002\u0002",
    "ST\u0007\u0006\u0002\u0002TU\u0007\u0007\u0002\u0002UX\u0007!\u0002",
    "\u0002VW\u0007\b\u0002\u0002WY\t\u0002\u0002\u0002XV\u0003\u0002\u0002",
    "\u0002XY\u0003\u0002\u0002\u0002Y\u0011\u0003\u0002\u0002\u0002Zc\u0007",
    "\f\u0002\u0002[\\\u0007\r\u0002\u0002\\d\u0007!\u0002\u0002]^\u0007",
    "\u000e\u0002\u0002^d\u0007#\u0002\u0002_`\u0007\u000f\u0002\u0002`d",
    "\u0007$\u0002\u0002ab\u0007\u0010\u0002\u0002bd\u0007$\u0002\u0002c",
    "[\u0003\u0002\u0002\u0002c]\u0003\u0002\u0002\u0002c_\u0003\u0002\u0002",
    "\u0002ca\u0003\u0002\u0002\u0002d\u0013\u0003\u0002\u0002\u0002ef\u0007",
    "\u0011\u0002\u0002fg\t\u0003\u0002\u0002g\u0015\u0003\u0002\u0002\u0002",
    "hi\u0007\u0013\u0002\u0002ij\t\u0004\u0002\u0002jk\u0005\n\u0006\u0002",
    "k\u0017\u0003\u0002\u0002\u0002lm\u0007\u0018\u0002\u0002mn\t\u0004",
    "\u0002\u0002no\u0005\n\u0006\u0002o\u0019\u0003\u0002\u0002\u0002pq",
    "\u0007\u0019\u0002\u0002qy\u0007$\u0002\u0002rw\u0007\u001a\u0002\u0002",
    "st\u0007\u001b\u0002\u0002tx\u0007\u0010\u0002\u0002uv\u0007\"\u0002",
    "\u0002vx\u0007\u001c\u0002\u0002ws\u0003\u0002\u0002\u0002wu\u0003\u0002",
    "\u0002\u0002xz\u0003\u0002\u0002\u0002yr\u0003\u0002\u0002\u0002yz\u0003",
    "\u0002\u0002\u0002z\u001b\u0003\u0002\u0002\u0002{|\u0007\u001d\u0002",
    "\u0002|}\u0007$\u0002\u0002}\u0088\u0007\u0007\u0002\u0002~\u0081\u0007",
    "\u0012\u0002\u0002\u007f\u0080\u0007\u001a\u0002\u0002\u0080\u0082\u0007",
    "\u001c\u0002\u0002\u0081\u007f\u0003\u0002\u0002\u0002\u0081\u0082\u0003",
    "\u0002\u0002\u0002\u0082\u0089\u0003\u0002\u0002\u0002\u0083\u0086\u0007",
    "\u0017\u0002\u0002\u0084\u0085\u0007\u001a\u0002\u0002\u0085\u0087\u0007",
    "\u001c\u0002\u0002\u0086\u0084\u0003\u0002\u0002\u0002\u0086\u0087\u0003",
    "\u0002\u0002\u0002\u0087\u0089\u0003\u0002\u0002\u0002\u0088~\u0003",
    "\u0002\u0002\u0002\u0088\u0083\u0003\u0002\u0002\u0002\u0089\u001d\u0003",
    "\u0002\u0002\u0002\u008a\u008b\u0007\u001e\u0002\u0002\u008b\u008c\t",
    "\u0005\u0002\u0002\u008c\u001f\u0003\u0002\u0002\u0002\u000f#*48=NX",
    "cwy\u0081\u0086\u0088"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "':'", "'SKIP'", "'INSTRUCTION'", "'JUMP'", "'TO'", 
                     "'ON'", "'NONE'", "'TRUE'", "'FALSE'", "'PUSH'", "'HANDLER'", 
                     "'LITERAL'", "'CONSTANT'", "'ARGUMENT'", "'POP'", "'COMPONENT'", 
                     "'LOAD'", "'VARIABLE'", "'MESSAGE'", "'DRAFT'", "'DOCUMENT'", 
                     "'STORE'", "'INVOKE'", "'WITH'", "'1'", "'ARGUMENTS'", 
                     "'SEND'", "'HANDLE'", "'EXCEPTION'", "'RESULT'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, "LABEL", "NUMBER", "LITERAL", 
                      "SYMBOL", "EOL", "SPACE" ];

var ruleNames =  [ "document", "instructions", "step", "label", "variable", 
                   "instruction", "skipInstruction", "jumpInstruction", 
                   "pushInstruction", "popInstruction", "loadInstruction", 
                   "storeInstruction", "invokeInstruction", "sendInstruction", 
                   "handleInstruction" ];

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

DocumentParser.RULE_document = 0;
DocumentParser.RULE_instructions = 1;
DocumentParser.RULE_step = 2;
DocumentParser.RULE_label = 3;
DocumentParser.RULE_variable = 4;
DocumentParser.RULE_instruction = 5;
DocumentParser.RULE_skipInstruction = 6;
DocumentParser.RULE_jumpInstruction = 7;
DocumentParser.RULE_pushInstruction = 8;
DocumentParser.RULE_popInstruction = 9;
DocumentParser.RULE_loadInstruction = 10;
DocumentParser.RULE_storeInstruction = 11;
DocumentParser.RULE_invokeInstruction = 12;
DocumentParser.RULE_sendInstruction = 13;
DocumentParser.RULE_handleInstruction = 14;

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
        this.state = 45;
        this.step();
        this.state = 50;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 46;
                this.match(DocumentParser.EOL);
                this.state = 47;
                this.step(); 
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
        if(_la===DocumentParser.LABEL || _la===DocumentParser.EOL) {
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

LabelContext.prototype.LABEL = function() {
    return this.getToken(DocumentParser.LABEL, 0);
};

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
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 59;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.EOL) {
            this.state = 58;
            this.match(DocumentParser.EOL);
        }

        this.state = 61;
        this.match(DocumentParser.LABEL);
        this.state = 62;
        this.match(DocumentParser.T__0);
        this.state = 63;
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

function VariableContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_variable;
    return this;
}

VariableContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VariableContext.prototype.constructor = VariableContext;

VariableContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

VariableContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterVariable(this);
	}
};

VariableContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitVariable(this);
	}
};

VariableContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitVariable(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.VariableContext = VariableContext;

DocumentParser.prototype.variable = function() {

    var localctx = new VariableContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, DocumentParser.RULE_variable);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 65;
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

InstructionContext.prototype.skipInstruction = function() {
    return this.getTypedRuleContext(SkipInstructionContext,0);
};

InstructionContext.prototype.jumpInstruction = function() {
    return this.getTypedRuleContext(JumpInstructionContext,0);
};

InstructionContext.prototype.pushInstruction = function() {
    return this.getTypedRuleContext(PushInstructionContext,0);
};

InstructionContext.prototype.popInstruction = function() {
    return this.getTypedRuleContext(PopInstructionContext,0);
};

InstructionContext.prototype.loadInstruction = function() {
    return this.getTypedRuleContext(LoadInstructionContext,0);
};

InstructionContext.prototype.storeInstruction = function() {
    return this.getTypedRuleContext(StoreInstructionContext,0);
};

InstructionContext.prototype.invokeInstruction = function() {
    return this.getTypedRuleContext(InvokeInstructionContext,0);
};

InstructionContext.prototype.sendInstruction = function() {
    return this.getTypedRuleContext(SendInstructionContext,0);
};

InstructionContext.prototype.handleInstruction = function() {
    return this.getTypedRuleContext(HandleInstructionContext,0);
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
    this.enterRule(localctx, 10, DocumentParser.RULE_instruction);
    try {
        this.state = 76;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__1:
            this.enterOuterAlt(localctx, 1);
            this.state = 67;
            this.skipInstruction();
            break;
        case DocumentParser.T__3:
            this.enterOuterAlt(localctx, 2);
            this.state = 68;
            this.jumpInstruction();
            break;
        case DocumentParser.T__9:
            this.enterOuterAlt(localctx, 3);
            this.state = 69;
            this.pushInstruction();
            break;
        case DocumentParser.T__14:
            this.enterOuterAlt(localctx, 4);
            this.state = 70;
            this.popInstruction();
            break;
        case DocumentParser.T__16:
            this.enterOuterAlt(localctx, 5);
            this.state = 71;
            this.loadInstruction();
            break;
        case DocumentParser.T__21:
            this.enterOuterAlt(localctx, 6);
            this.state = 72;
            this.storeInstruction();
            break;
        case DocumentParser.T__22:
            this.enterOuterAlt(localctx, 7);
            this.state = 73;
            this.invokeInstruction();
            break;
        case DocumentParser.T__26:
            this.enterOuterAlt(localctx, 8);
            this.state = 74;
            this.sendInstruction();
            break;
        case DocumentParser.T__27:
            this.enterOuterAlt(localctx, 9);
            this.state = 75;
            this.handleInstruction();
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
        this.state = 78;
        this.match(DocumentParser.T__1);
        this.state = 79;
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
        this.state = 81;
        this.match(DocumentParser.T__3);
        this.state = 82;
        this.match(DocumentParser.T__4);
        this.state = 83;
        this.match(DocumentParser.LABEL);
        this.state = 86;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__5) {
            this.state = 84;
            this.match(DocumentParser.T__5);
            this.state = 85;
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
        this.state = 88;
        this.match(DocumentParser.T__9);
        this.state = 97;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__10:
            this.state = 89;
            this.match(DocumentParser.T__10);
            this.state = 90;
            this.match(DocumentParser.LABEL);
            break;
        case DocumentParser.T__11:
            this.state = 91;
            this.match(DocumentParser.T__11);
            this.state = 92;
            this.match(DocumentParser.LITERAL);
            break;
        case DocumentParser.T__12:
            this.state = 93;
            this.match(DocumentParser.T__12);
            this.state = 94;
            this.match(DocumentParser.SYMBOL);
            break;
        case DocumentParser.T__13:
            this.state = 95;
            this.match(DocumentParser.T__13);
            this.state = 96;
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

function PopInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_popInstruction;
    return this;
}

PopInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PopInstructionContext.prototype.constructor = PopInstructionContext;


PopInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterPopInstruction(this);
	}
};

PopInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitPopInstruction(this);
	}
};

PopInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitPopInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.PopInstructionContext = PopInstructionContext;

DocumentParser.prototype.popInstruction = function() {

    var localctx = new PopInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, DocumentParser.RULE_popInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 99;
        this.match(DocumentParser.T__14);
        this.state = 100;
        _la = this._input.LA(1);
        if(!(_la===DocumentParser.T__10 || _la===DocumentParser.T__15)) {
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

LoadInstructionContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
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
        this.state = 102;
        this.match(DocumentParser.T__16);
        this.state = 103;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__17) | (1 << DocumentParser.T__18) | (1 << DocumentParser.T__19) | (1 << DocumentParser.T__20))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 104;
        this.variable();
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

function StoreInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_storeInstruction;
    return this;
}

StoreInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StoreInstructionContext.prototype.constructor = StoreInstructionContext;

StoreInstructionContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};

StoreInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterStoreInstruction(this);
	}
};

StoreInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitStoreInstruction(this);
	}
};

StoreInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitStoreInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.StoreInstructionContext = StoreInstructionContext;

DocumentParser.prototype.storeInstruction = function() {

    var localctx = new StoreInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, DocumentParser.RULE_storeInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 106;
        this.match(DocumentParser.T__21);
        this.state = 107;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__17) | (1 << DocumentParser.T__18) | (1 << DocumentParser.T__19) | (1 << DocumentParser.T__20))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 108;
        this.variable();
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

function InvokeInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_invokeInstruction;
    return this;
}

InvokeInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InvokeInstructionContext.prototype.constructor = InvokeInstructionContext;

InvokeInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

InvokeInstructionContext.prototype.NUMBER = function() {
    return this.getToken(DocumentParser.NUMBER, 0);
};

InvokeInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterInvokeInstruction(this);
	}
};

InvokeInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitInvokeInstruction(this);
	}
};

InvokeInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitInvokeInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.InvokeInstructionContext = InvokeInstructionContext;

DocumentParser.prototype.invokeInstruction = function() {

    var localctx = new InvokeInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, DocumentParser.RULE_invokeInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 110;
        this.match(DocumentParser.T__22);
        this.state = 111;
        this.match(DocumentParser.SYMBOL);
        this.state = 119;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__23) {
            this.state = 112;
            this.match(DocumentParser.T__23);
            this.state = 117;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case DocumentParser.T__24:
                this.state = 113;
                this.match(DocumentParser.T__24);
                this.state = 114;
                this.match(DocumentParser.T__13);
                break;
            case DocumentParser.NUMBER:
                this.state = 115;
                this.match(DocumentParser.NUMBER);
                this.state = 116;
                this.match(DocumentParser.T__25);
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
    this.enterRule(localctx, 26, DocumentParser.RULE_sendInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 121;
        this.match(DocumentParser.T__26);
        this.state = 122;
        this.match(DocumentParser.SYMBOL);
        this.state = 123;
        this.match(DocumentParser.T__4);
        this.state = 134;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__15:
            this.state = 124;
            this.match(DocumentParser.T__15);
            this.state = 127;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===DocumentParser.T__23) {
                this.state = 125;
                this.match(DocumentParser.T__23);
                this.state = 126;
                this.match(DocumentParser.T__25);
            }

            break;
        case DocumentParser.T__20:
            this.state = 129;
            this.match(DocumentParser.T__20);
            this.state = 132;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===DocumentParser.T__23) {
                this.state = 130;
                this.match(DocumentParser.T__23);
                this.state = 131;
                this.match(DocumentParser.T__25);
            }

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

function HandleInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_handleInstruction;
    return this;
}

HandleInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
HandleInstructionContext.prototype.constructor = HandleInstructionContext;


HandleInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterHandleInstruction(this);
	}
};

HandleInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitHandleInstruction(this);
	}
};

HandleInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitHandleInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.HandleInstructionContext = HandleInstructionContext;

DocumentParser.prototype.handleInstruction = function() {

    var localctx = new HandleInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, DocumentParser.RULE_handleInstruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 136;
        this.match(DocumentParser.T__27);
        this.state = 137;
        _la = this._input.LA(1);
        if(!(_la===DocumentParser.T__28 || _la===DocumentParser.T__29)) {
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


exports.DocumentParser = DocumentParser;
