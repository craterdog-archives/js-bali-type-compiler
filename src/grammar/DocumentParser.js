// Generated from src/grammar/Document.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');
var DocumentListener = require('./DocumentListener').DocumentListener;
var DocumentVisitor = require('./DocumentVisitor').DocumentVisitor;

var grammarFileName = "Document.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003(\u0088\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0003\u0002\u0007\u0002",
    " \n\u0002\f\u0002\u000e\u0002#\u000b\u0002\u0003\u0002\u0003\u0002\u0007",
    "\u0002\'\n\u0002\f\u0002\u000e\u0002*\u000b\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0003\u0003\u0003\u0006\u00030\n\u0003\r\u0003\u000e\u0003",
    "1\u0007\u00034\n\u0003\f\u0003\u000e\u00037\u000b\u0003\u0003\u0004",
    "\u0005\u0004:\n\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0005\u0006",
    "K\n\u0006\u0003\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0005\bW\n\b\u0005\bY\n\b\u0003\t",
    "\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0005",
    "\td\n\t\u0003\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\u000b",
    "\u0003\u000b\u0003\f\u0003\f\u0003\f\u0003\f\u0003\r\u0003\r\u0003\r",
    "\u0003\r\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e",
    "\u0003\u000e\u0003\u000e\u0005\u000e|\n\u000e\u0005\u000e~\n\u000e\u0003",
    "\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0005",
    "\u000f\u0086\n\u000f\u0003\u000f\u0002\u0002\u0010\u0002\u0004\u0006",
    "\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u0002\u0006\u0003",
    "\u0002\n\f\u0004\u0002\u000e\u000e\u0013\u0015\u0003\u0002\u0017\u001a",
    "\u0004\u0002\u0013\u0013\u0018\u0018\u0002\u008e\u0002!\u0003\u0002",
    "\u0002\u0002\u00045\u0003\u0002\u0002\u0002\u00069\u0003\u0002\u0002",
    "\u0002\b=\u0003\u0002\u0002\u0002\nJ\u0003\u0002\u0002\u0002\fL\u0003",
    "\u0002\u0002\u0002\u000eO\u0003\u0002\u0002\u0002\u0010Z\u0003\u0002",
    "\u0002\u0002\u0012e\u0003\u0002\u0002\u0002\u0014h\u0003\u0002\u0002",
    "\u0002\u0016l\u0003\u0002\u0002\u0002\u0018p\u0003\u0002\u0002\u0002",
    "\u001at\u0003\u0002\u0002\u0002\u001c\u007f\u0003\u0002\u0002\u0002",
    "\u001e \u0007&\u0002\u0002\u001f\u001e\u0003\u0002\u0002\u0002 #\u0003",
    "\u0002\u0002\u0002!\u001f\u0003\u0002\u0002\u0002!\"\u0003\u0002\u0002",
    "\u0002\"$\u0003\u0002\u0002\u0002#!\u0003\u0002\u0002\u0002$(\u0005",
    "\u0004\u0003\u0002%\'\u0007&\u0002\u0002&%\u0003\u0002\u0002\u0002\'",
    "*\u0003\u0002\u0002\u0002(&\u0003\u0002\u0002\u0002()\u0003\u0002\u0002",
    "\u0002)+\u0003\u0002\u0002\u0002*(\u0003\u0002\u0002\u0002+,\u0007\u0002",
    "\u0002\u0003,\u0003\u0003\u0002\u0002\u0002-/\u0005\u0006\u0004\u0002",
    ".0\u0007&\u0002\u0002/.\u0003\u0002\u0002\u000201\u0003\u0002\u0002",
    "\u00021/\u0003\u0002\u0002\u000212\u0003\u0002\u0002\u000224\u0003\u0002",
    "\u0002\u00023-\u0003\u0002\u0002\u000247\u0003\u0002\u0002\u000253\u0003",
    "\u0002\u0002\u000256\u0003\u0002\u0002\u00026\u0005\u0003\u0002\u0002",
    "\u000275\u0003\u0002\u0002\u00028:\u0005\b\u0005\u000298\u0003\u0002",
    "\u0002\u00029:\u0003\u0002\u0002\u0002:;\u0003\u0002\u0002\u0002;<\u0005",
    "\n\u0006\u0002<\u0007\u0003\u0002\u0002\u0002=>\u0007\"\u0002\u0002",
    ">?\u0007\u0003\u0002\u0002?@\u0007&\u0002\u0002@\t\u0003\u0002\u0002",
    "\u0002AK\u0005\f\u0007\u0002BK\u0005\u000e\b\u0002CK\u0005\u0010\t\u0002",
    "DK\u0005\u0012\n\u0002EK\u0005\u0014\u000b\u0002FK\u0005\u0016\f\u0002",
    "GK\u0005\u0018\r\u0002HK\u0005\u001a\u000e\u0002IK\u0005\u001c\u000f",
    "\u0002JA\u0003\u0002\u0002\u0002JB\u0003\u0002\u0002\u0002JC\u0003\u0002",
    "\u0002\u0002JD\u0003\u0002\u0002\u0002JE\u0003\u0002\u0002\u0002JF\u0003",
    "\u0002\u0002\u0002JG\u0003\u0002\u0002\u0002JH\u0003\u0002\u0002\u0002",
    "JI\u0003\u0002\u0002\u0002K\u000b\u0003\u0002\u0002\u0002LM\u0007\u0004",
    "\u0002\u0002MN\u0007(\u0002\u0002N\r\u0003\u0002\u0002\u0002OP\u0007",
    "\u0005\u0002\u0002PX\u0007\u0006\u0002\u0002QR\u0007\u0007\u0002\u0002",
    "RY\u0007\b\u0002\u0002SV\u0007\"\u0002\u0002TU\u0007\t\u0002\u0002U",
    "W\t\u0002\u0002\u0002VT\u0003\u0002\u0002\u0002VW\u0003\u0002\u0002",
    "\u0002WY\u0003\u0002\u0002\u0002XQ\u0003\u0002\u0002\u0002XS\u0003\u0002",
    "\u0002\u0002Y\u000f\u0003\u0002\u0002\u0002Zc\u0007\r\u0002\u0002[\\",
    "\u0007\u000e\u0002\u0002\\d\u0007\"\u0002\u0002]^\u0007\u000f\u0002",
    "\u0002^d\u0007$\u0002\u0002_`\u0007\u0010\u0002\u0002`d\u0007%\u0002",
    "\u0002ab\u0007\u0011\u0002\u0002bd\u0007%\u0002\u0002c[\u0003\u0002",
    "\u0002\u0002c]\u0003\u0002\u0002\u0002c_\u0003\u0002\u0002\u0002ca\u0003",
    "\u0002\u0002\u0002d\u0011\u0003\u0002\u0002\u0002ef\u0007\u0012\u0002",
    "\u0002fg\t\u0003\u0002\u0002g\u0013\u0003\u0002\u0002\u0002hi\u0007",
    "\u0016\u0002\u0002ij\t\u0004\u0002\u0002jk\u0007%\u0002\u0002k\u0015",
    "\u0003\u0002\u0002\u0002lm\u0007\u001b\u0002\u0002mn\t\u0004\u0002\u0002",
    "no\u0007%\u0002\u0002o\u0017\u0003\u0002\u0002\u0002pq\u0007\u001c\u0002",
    "\u0002qr\t\u0004\u0002\u0002rs\u0007%\u0002\u0002s\u0019\u0003\u0002",
    "\u0002\u0002tu\u0007\u001d\u0002\u0002u}\u0007%\u0002\u0002v{\u0007",
    "\u001e\u0002\u0002wx\u0007\u001f\u0002\u0002x|\u0007\u0011\u0002\u0002",
    "yz\u0007#\u0002\u0002z|\u0007 \u0002\u0002{w\u0003\u0002\u0002\u0002",
    "{y\u0003\u0002\u0002\u0002|~\u0003\u0002\u0002\u0002}v\u0003\u0002\u0002",
    "\u0002}~\u0003\u0002\u0002\u0002~\u001b\u0003\u0002\u0002\u0002\u007f",
    "\u0080\u0007!\u0002\u0002\u0080\u0081\u0007%\u0002\u0002\u0081\u0082",
    "\u0007\u0006\u0002\u0002\u0082\u0085\t\u0005\u0002\u0002\u0083\u0084",
    "\u0007\u001e\u0002\u0002\u0084\u0086\u0007 \u0002\u0002\u0085\u0083",
    "\u0003\u0002\u0002\u0002\u0085\u0086\u0003\u0002\u0002\u0002\u0086\u001d",
    "\u0003\u0002\u0002\u0002\u000e!(159JVXc{}\u0085"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "':'", "'NOTE'", "'JUMP'", "'TO'", "'NEXT'", 
                     "'INSTRUCTION'", "'ON'", "'EMPTY'", "'TRUE'", "'FALSE'", 
                     "'PUSH'", "'HANDLER'", "'LITERAL'", "'CONSTANT'", "'ARGUMENT'", 
                     "'PULL'", "'COMPONENT'", "'RESULT'", "'EXCEPTION'", 
                     "'LOAD'", "'VARIABLE'", "'DOCUMENT'", "'CONTRACT'", 
                     "'MESSAGE'", "'SAVE'", "'DROP'", "'CALL'", "'WITH'", 
                     "'1'", "'ARGUMENTS'", "'SEND'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, "LABEL", "NUMBER", "LITERAL", 
                      "SYMBOL", "EOL", "SPACE", "COMMENT" ];

var ruleNames =  [ "document", "instructions", "instruction", "label", "action", 
                   "note", "jump", "push", "pull", "load", "save", "drop", 
                   "call", "send" ];

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
DocumentParser.T__30 = 31;
DocumentParser.LABEL = 32;
DocumentParser.NUMBER = 33;
DocumentParser.LITERAL = 34;
DocumentParser.SYMBOL = 35;
DocumentParser.EOL = 36;
DocumentParser.SPACE = 37;
DocumentParser.COMMENT = 38;

DocumentParser.RULE_document = 0;
DocumentParser.RULE_instructions = 1;
DocumentParser.RULE_instruction = 2;
DocumentParser.RULE_label = 3;
DocumentParser.RULE_action = 4;
DocumentParser.RULE_note = 5;
DocumentParser.RULE_jump = 6;
DocumentParser.RULE_push = 7;
DocumentParser.RULE_pull = 8;
DocumentParser.RULE_load = 9;
DocumentParser.RULE_save = 10;
DocumentParser.RULE_drop = 11;
DocumentParser.RULE_call = 12;
DocumentParser.RULE_send = 13;


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
        this.state = 31;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 28;
                this.match(DocumentParser.EOL); 
            }
            this.state = 33;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
        }

        this.state = 34;
        this.instructions();
        this.state = 38;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===DocumentParser.EOL) {
            this.state = 35;
            this.match(DocumentParser.EOL);
            this.state = 40;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 41;
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

InstructionsContext.prototype.instruction = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(InstructionContext);
    } else {
        return this.getTypedRuleContext(InstructionContext,i);
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
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 51;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(((((_la - 2)) & ~0x1f) == 0 && ((1 << (_la - 2)) & ((1 << (DocumentParser.T__1 - 2)) | (1 << (DocumentParser.T__2 - 2)) | (1 << (DocumentParser.T__10 - 2)) | (1 << (DocumentParser.T__15 - 2)) | (1 << (DocumentParser.T__19 - 2)) | (1 << (DocumentParser.T__24 - 2)) | (1 << (DocumentParser.T__25 - 2)) | (1 << (DocumentParser.T__26 - 2)) | (1 << (DocumentParser.T__30 - 2)) | (1 << (DocumentParser.LABEL - 2)))) !== 0)) {
            this.state = 43;
            this.instruction();
            this.state = 45; 
            this._errHandler.sync(this);
            var _alt = 1;
            do {
            	switch (_alt) {
            	case 1:
            		this.state = 44;
            		this.match(DocumentParser.EOL);
            		break;
            	default:
            		throw new antlr4.error.NoViableAltException(this);
            	}
            	this.state = 47; 
            	this._errHandler.sync(this);
            	_alt = this._interp.adaptivePredict(this._input,2, this._ctx);
            } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
            this.state = 53;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
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

InstructionContext.prototype.action = function() {
    return this.getTypedRuleContext(ActionContext,0);
};

InstructionContext.prototype.label = function() {
    return this.getTypedRuleContext(LabelContext,0);
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
    this.enterRule(localctx, 4, DocumentParser.RULE_instruction);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 55;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.LABEL) {
            this.state = 54;
            this.label();
        }

        this.state = 57;
        this.action();
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

LabelContext.prototype.EOL = function() {
    return this.getToken(DocumentParser.EOL, 0);
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


function ActionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_action;
    return this;
}

ActionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ActionContext.prototype.constructor = ActionContext;

ActionContext.prototype.note = function() {
    return this.getTypedRuleContext(NoteContext,0);
};

ActionContext.prototype.jump = function() {
    return this.getTypedRuleContext(JumpContext,0);
};

ActionContext.prototype.push = function() {
    return this.getTypedRuleContext(PushContext,0);
};

ActionContext.prototype.pull = function() {
    return this.getTypedRuleContext(PullContext,0);
};

ActionContext.prototype.load = function() {
    return this.getTypedRuleContext(LoadContext,0);
};

ActionContext.prototype.save = function() {
    return this.getTypedRuleContext(SaveContext,0);
};

ActionContext.prototype.drop = function() {
    return this.getTypedRuleContext(DropContext,0);
};

ActionContext.prototype.call = function() {
    return this.getTypedRuleContext(CallContext,0);
};

ActionContext.prototype.send = function() {
    return this.getTypedRuleContext(SendContext,0);
};

ActionContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterAction(this);
	}
};

ActionContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitAction(this);
	}
};

ActionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitAction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.ActionContext = ActionContext;

DocumentParser.prototype.action = function() {

    var localctx = new ActionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, DocumentParser.RULE_action);
    try {
        this.state = 72;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__1:
            this.enterOuterAlt(localctx, 1);
            this.state = 63;
            this.note();
            break;
        case DocumentParser.T__2:
            this.enterOuterAlt(localctx, 2);
            this.state = 64;
            this.jump();
            break;
        case DocumentParser.T__10:
            this.enterOuterAlt(localctx, 3);
            this.state = 65;
            this.push();
            break;
        case DocumentParser.T__15:
            this.enterOuterAlt(localctx, 4);
            this.state = 66;
            this.pull();
            break;
        case DocumentParser.T__19:
            this.enterOuterAlt(localctx, 5);
            this.state = 67;
            this.load();
            break;
        case DocumentParser.T__24:
            this.enterOuterAlt(localctx, 6);
            this.state = 68;
            this.save();
            break;
        case DocumentParser.T__25:
            this.enterOuterAlt(localctx, 7);
            this.state = 69;
            this.drop();
            break;
        case DocumentParser.T__26:
            this.enterOuterAlt(localctx, 8);
            this.state = 70;
            this.call();
            break;
        case DocumentParser.T__30:
            this.enterOuterAlt(localctx, 9);
            this.state = 71;
            this.send();
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


function NoteContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_note;
    return this;
}

NoteContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NoteContext.prototype.constructor = NoteContext;

NoteContext.prototype.COMMENT = function() {
    return this.getToken(DocumentParser.COMMENT, 0);
};

NoteContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterNote(this);
	}
};

NoteContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitNote(this);
	}
};

NoteContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitNote(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.NoteContext = NoteContext;

DocumentParser.prototype.note = function() {

    var localctx = new NoteContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, DocumentParser.RULE_note);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 74;
        this.match(DocumentParser.T__1);
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


function JumpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_jump;
    return this;
}

JumpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
JumpContext.prototype.constructor = JumpContext;

JumpContext.prototype.LABEL = function() {
    return this.getToken(DocumentParser.LABEL, 0);
};

JumpContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterJump(this);
	}
};

JumpContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitJump(this);
	}
};

JumpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitJump(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.JumpContext = JumpContext;

DocumentParser.prototype.jump = function() {

    var localctx = new JumpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, DocumentParser.RULE_jump);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 77;
        this.match(DocumentParser.T__2);
        this.state = 78;
        this.match(DocumentParser.T__3);
        this.state = 86;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__4:
            this.state = 79;
            this.match(DocumentParser.T__4);
            this.state = 80;
            this.match(DocumentParser.T__5);
            break;
        case DocumentParser.LABEL:
            this.state = 81;
            this.match(DocumentParser.LABEL);
            this.state = 84;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===DocumentParser.T__6) {
                this.state = 82;
                this.match(DocumentParser.T__6);
                this.state = 83;
                _la = this._input.LA(1);
                if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__7) | (1 << DocumentParser.T__8) | (1 << DocumentParser.T__9))) !== 0))) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                }
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


function PushContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_push;
    return this;
}

PushContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PushContext.prototype.constructor = PushContext;

PushContext.prototype.LABEL = function() {
    return this.getToken(DocumentParser.LABEL, 0);
};

PushContext.prototype.LITERAL = function() {
    return this.getToken(DocumentParser.LITERAL, 0);
};

PushContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

PushContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterPush(this);
	}
};

PushContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitPush(this);
	}
};

PushContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitPush(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.PushContext = PushContext;

DocumentParser.prototype.push = function() {

    var localctx = new PushContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, DocumentParser.RULE_push);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 88;
        this.match(DocumentParser.T__10);
        this.state = 97;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case DocumentParser.T__11:
            this.state = 89;
            this.match(DocumentParser.T__11);
            this.state = 90;
            this.match(DocumentParser.LABEL);
            break;
        case DocumentParser.T__12:
            this.state = 91;
            this.match(DocumentParser.T__12);
            this.state = 92;
            this.match(DocumentParser.LITERAL);
            break;
        case DocumentParser.T__13:
            this.state = 93;
            this.match(DocumentParser.T__13);
            this.state = 94;
            this.match(DocumentParser.SYMBOL);
            break;
        case DocumentParser.T__14:
            this.state = 95;
            this.match(DocumentParser.T__14);
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


function PullContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_pull;
    return this;
}

PullContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PullContext.prototype.constructor = PullContext;


PullContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterPull(this);
	}
};

PullContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitPull(this);
	}
};

PullContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitPull(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.PullContext = PullContext;

DocumentParser.prototype.pull = function() {

    var localctx = new PullContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, DocumentParser.RULE_pull);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 99;
        this.match(DocumentParser.T__15);
        this.state = 100;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__11) | (1 << DocumentParser.T__16) | (1 << DocumentParser.T__17) | (1 << DocumentParser.T__18))) !== 0))) {
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


function LoadContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_load;
    return this;
}

LoadContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LoadContext.prototype.constructor = LoadContext;

LoadContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

LoadContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterLoad(this);
	}
};

LoadContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitLoad(this);
	}
};

LoadContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitLoad(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.LoadContext = LoadContext;

DocumentParser.prototype.load = function() {

    var localctx = new LoadContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, DocumentParser.RULE_load);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 102;
        this.match(DocumentParser.T__19);
        this.state = 103;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__20) | (1 << DocumentParser.T__21) | (1 << DocumentParser.T__22) | (1 << DocumentParser.T__23))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 104;
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


function SaveContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_save;
    return this;
}

SaveContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SaveContext.prototype.constructor = SaveContext;

SaveContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

SaveContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterSave(this);
	}
};

SaveContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitSave(this);
	}
};

SaveContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitSave(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.SaveContext = SaveContext;

DocumentParser.prototype.save = function() {

    var localctx = new SaveContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, DocumentParser.RULE_save);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 106;
        this.match(DocumentParser.T__24);
        this.state = 107;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__20) | (1 << DocumentParser.T__21) | (1 << DocumentParser.T__22) | (1 << DocumentParser.T__23))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 108;
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


function DropContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_drop;
    return this;
}

DropContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DropContext.prototype.constructor = DropContext;

DropContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

DropContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterDrop(this);
	}
};

DropContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitDrop(this);
	}
};

DropContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitDrop(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.DropContext = DropContext;

DocumentParser.prototype.drop = function() {

    var localctx = new DropContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, DocumentParser.RULE_drop);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 110;
        this.match(DocumentParser.T__25);
        this.state = 111;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << DocumentParser.T__20) | (1 << DocumentParser.T__21) | (1 << DocumentParser.T__22) | (1 << DocumentParser.T__23))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 112;
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


function CallContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_call;
    return this;
}

CallContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CallContext.prototype.constructor = CallContext;

CallContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

CallContext.prototype.NUMBER = function() {
    return this.getToken(DocumentParser.NUMBER, 0);
};

CallContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterCall(this);
	}
};

CallContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitCall(this);
	}
};

CallContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitCall(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.CallContext = CallContext;

DocumentParser.prototype.call = function() {

    var localctx = new CallContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, DocumentParser.RULE_call);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 114;
        this.match(DocumentParser.T__26);
        this.state = 115;
        this.match(DocumentParser.SYMBOL);
        this.state = 123;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__27) {
            this.state = 116;
            this.match(DocumentParser.T__27);
            this.state = 121;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case DocumentParser.T__28:
                this.state = 117;
                this.match(DocumentParser.T__28);
                this.state = 118;
                this.match(DocumentParser.T__14);
                break;
            case DocumentParser.NUMBER:
                this.state = 119;
                this.match(DocumentParser.NUMBER);
                this.state = 120;
                this.match(DocumentParser.T__29);
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


function SendContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = DocumentParser.RULE_send;
    return this;
}

SendContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SendContext.prototype.constructor = SendContext;

SendContext.prototype.SYMBOL = function() {
    return this.getToken(DocumentParser.SYMBOL, 0);
};

SendContext.prototype.enterRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.enterSend(this);
	}
};

SendContext.prototype.exitRule = function(listener) {
    if(listener instanceof DocumentListener ) {
        listener.exitSend(this);
	}
};

SendContext.prototype.accept = function(visitor) {
    if ( visitor instanceof DocumentVisitor ) {
        return visitor.visitSend(this);
    } else {
        return visitor.visitChildren(this);
    }
};




DocumentParser.SendContext = SendContext;

DocumentParser.prototype.send = function() {

    var localctx = new SendContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, DocumentParser.RULE_send);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 125;
        this.match(DocumentParser.T__30);
        this.state = 126;
        this.match(DocumentParser.SYMBOL);
        this.state = 127;
        this.match(DocumentParser.T__3);
        this.state = 128;
        _la = this._input.LA(1);
        if(!(_la===DocumentParser.T__16 || _la===DocumentParser.T__21)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 131;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===DocumentParser.T__27) {
            this.state = 129;
            this.match(DocumentParser.T__27);
            this.state = 130;
            this.match(DocumentParser.T__29);
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
