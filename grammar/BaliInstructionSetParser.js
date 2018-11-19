// Generated from grammar/BaliInstructionSet.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var BaliInstructionSetListener = require('./BaliInstructionSetListener').BaliInstructionSetListener;
var BaliInstructionSetVisitor = require('./BaliInstructionSetVisitor').BaliInstructionSetVisitor;

var grammarFileName = "BaliInstructionSet.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003%\u00af\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0003\u0002\u0007\u0002\u001e\n\u0002\f\u0002",
    "\u000e\u0002!\u000b\u0002\u0003\u0002\u0007\u0002$\n\u0002\f\u0002\u000e",
    "\u0002\'\u000b\u0002\u0003\u0002\u0007\u0002*\n\u0002\f\u0002\u000e",
    "\u0002-\u000b\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0005\u0003",
    "2\n\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0005\u0005E\n\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0005\u0007[\n\u0007",
    "\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0005\bf\n\b\u0003\t\u0003\t\u0003\t\u0003\t\u0005\tl\n\t\u0003\n",
    "\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003",
    "\n\u0003\n\u0003\n\u0005\nz\n\n\u0003\u000b\u0003\u000b\u0003\u000b",
    "\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b",
    "\u0003\u000b\u0003\u000b\u0003\u000b\u0005\u000b\u0088\n\u000b\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0005\f\u0095\n\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r",
    "\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003",
    "\r\u0003\r\u0003\r\u0005\r\u00a7\n\r\u0003\u000e\u0003\u000e\u0003\u000e",
    "\u0003\u000e\u0005\u000e\u00ad\n\u000e\u0003\u000e\u0002\u0002\u000f",
    "\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u0002",
    "\u0002\u0002\u00bf\u0002\u001f\u0003\u0002\u0002\u0002\u00041\u0003",
    "\u0002\u0002\u0002\u00066\u0003\u0002\u0002\u0002\bD\u0003\u0002\u0002",
    "\u0002\nF\u0003\u0002\u0002\u0002\fZ\u0003\u0002\u0002\u0002\u000ee",
    "\u0003\u0002\u0002\u0002\u0010k\u0003\u0002\u0002\u0002\u0012y\u0003",
    "\u0002\u0002\u0002\u0014\u0087\u0003\u0002\u0002\u0002\u0016\u0094\u0003",
    "\u0002\u0002\u0002\u0018\u00a6\u0003\u0002\u0002\u0002\u001a\u00ac\u0003",
    "\u0002\u0002\u0002\u001c\u001e\u0007$\u0002\u0002\u001d\u001c\u0003",
    "\u0002\u0002\u0002\u001e!\u0003\u0002\u0002\u0002\u001f\u001d\u0003",
    "\u0002\u0002\u0002\u001f \u0003\u0002\u0002\u0002 %\u0003\u0002\u0002",
    "\u0002!\u001f\u0003\u0002\u0002\u0002\"$\u0005\u0004\u0003\u0002#\"",
    "\u0003\u0002\u0002\u0002$\'\u0003\u0002\u0002\u0002%#\u0003\u0002\u0002",
    "\u0002%&\u0003\u0002\u0002\u0002&+\u0003\u0002\u0002\u0002\'%\u0003",
    "\u0002\u0002\u0002(*\u0007$\u0002\u0002)(\u0003\u0002\u0002\u0002*-",
    "\u0003\u0002\u0002\u0002+)\u0003\u0002\u0002\u0002+,\u0003\u0002\u0002",
    "\u0002,.\u0003\u0002\u0002\u0002-+\u0003\u0002\u0002\u0002./\u0007\u0002",
    "\u0002\u0003/\u0003\u0003\u0002\u0002\u000202\u0005\u0006\u0004\u0002",
    "10\u0003\u0002\u0002\u000212\u0003\u0002\u0002\u000223\u0003\u0002\u0002",
    "\u000234\u0005\b\u0005\u000245\u0007$\u0002\u00025\u0005\u0003\u0002",
    "\u0002\u000267\u0007$\u0002\u000278\u0007 \u0002\u000289\u0007\u0003",
    "\u0002\u00029:\u0007$\u0002\u0002:\u0007\u0003\u0002\u0002\u0002;E\u0005",
    "\n\u0006\u0002<E\u0005\f\u0007\u0002=E\u0005\u000e\b\u0002>E\u0005\u0010",
    "\t\u0002?E\u0005\u0012\n\u0002@E\u0005\u0014\u000b\u0002AE\u0005\u0016",
    "\f\u0002BE\u0005\u0018\r\u0002CE\u0005\u001a\u000e\u0002D;\u0003\u0002",
    "\u0002\u0002D<\u0003\u0002\u0002\u0002D=\u0003\u0002\u0002\u0002D>\u0003",
    "\u0002\u0002\u0002D?\u0003\u0002\u0002\u0002D@\u0003\u0002\u0002\u0002",
    "DA\u0003\u0002\u0002\u0002DB\u0003\u0002\u0002\u0002DC\u0003\u0002\u0002",
    "\u0002E\t\u0003\u0002\u0002\u0002FG\u0007\u0004\u0002\u0002G\u000b\u0003",
    "\u0002\u0002\u0002HI\u0007\u0005\u0002\u0002IJ\u0007\u0006\u0002\u0002",
    "J[\u0007 \u0002\u0002KL\u0007\u0005\u0002\u0002LM\u0007\u0006\u0002",
    "\u0002MN\u0007 \u0002\u0002NO\u0007\u0007\u0002\u0002O[\u0007\b\u0002",
    "\u0002PQ\u0007\u0005\u0002\u0002QR\u0007\u0006\u0002\u0002RS\u0007 ",
    "\u0002\u0002ST\u0007\u0007\u0002\u0002T[\u0007\t\u0002\u0002UV\u0007",
    "\u0005\u0002\u0002VW\u0007\u0006\u0002\u0002WX\u0007 \u0002\u0002XY",
    "\u0007\u0007\u0002\u0002Y[\u0007\n\u0002\u0002ZH\u0003\u0002\u0002\u0002",
    "ZK\u0003\u0002\u0002\u0002ZP\u0003\u0002\u0002\u0002ZU\u0003\u0002\u0002",
    "\u0002[\r\u0003\u0002\u0002\u0002\\]\u0007\u000b\u0002\u0002]^\u0007",
    "\f\u0002\u0002^f\u0007 \u0002\u0002_`\u0007\u000b\u0002\u0002`a\u0007",
    "\r\u0002\u0002af\u0007\"\u0002\u0002bc\u0007\u000b\u0002\u0002cd\u0007",
    "\u000e\u0002\u0002df\u0007\"\u0002\u0002e\\\u0003\u0002\u0002\u0002",
    "e_\u0003\u0002\u0002\u0002eb\u0003\u0002\u0002\u0002f\u000f\u0003\u0002",
    "\u0002\u0002gh\u0007\u000f\u0002\u0002hl\u0007\f\u0002\u0002ij\u0007",
    "\u000f\u0002\u0002jl\u0007\u0010\u0002\u0002kg\u0003\u0002\u0002\u0002",
    "ki\u0003\u0002\u0002\u0002l\u0011\u0003\u0002\u0002\u0002mn\u0007\u0011",
    "\u0002\u0002no\u0007\u0012\u0002\u0002oz\u0007#\u0002\u0002pq\u0007",
    "\u0011\u0002\u0002qr\u0007\u0013\u0002\u0002rz\u0007#\u0002\u0002st",
    "\u0007\u0011\u0002\u0002tu\u0007\u0014\u0002\u0002uz\u0007#\u0002\u0002",
    "vw\u0007\u0011\u0002\u0002wx\u0007\u0015\u0002\u0002xz\u0007#\u0002",
    "\u0002ym\u0003\u0002\u0002\u0002yp\u0003\u0002\u0002\u0002ys\u0003\u0002",
    "\u0002\u0002yv\u0003\u0002\u0002\u0002z\u0013\u0003\u0002\u0002\u0002",
    "{|\u0007\u0016\u0002\u0002|}\u0007\u0012\u0002\u0002}\u0088\u0007#\u0002",
    "\u0002~\u007f\u0007\u0016\u0002\u0002\u007f\u0080\u0007\u0017\u0002",
    "\u0002\u0080\u0088\u0007#\u0002\u0002\u0081\u0082\u0007\u0016\u0002",
    "\u0002\u0082\u0083\u0007\u0014\u0002\u0002\u0083\u0088\u0007#\u0002",
    "\u0002\u0084\u0085\u0007\u0016\u0002\u0002\u0085\u0086\u0007\u0015\u0002",
    "\u0002\u0086\u0088\u0007#\u0002\u0002\u0087{\u0003\u0002\u0002\u0002",
    "\u0087~\u0003\u0002\u0002\u0002\u0087\u0081\u0003\u0002\u0002\u0002",
    "\u0087\u0084\u0003\u0002\u0002\u0002\u0088\u0015\u0003\u0002\u0002\u0002",
    "\u0089\u008a\u0007\u0018\u0002\u0002\u008a\u0095\u0007#\u0002\u0002",
    "\u008b\u008c\u0007\u0018\u0002\u0002\u008c\u008d\u0007#\u0002\u0002",
    "\u008d\u008e\u0007\u0019\u0002\u0002\u008e\u0095\u0007\u0013\u0002\u0002",
    "\u008f\u0090\u0007\u0018\u0002\u0002\u0090\u0091\u0007#\u0002\u0002",
    "\u0091\u0092\u0007\u0019\u0002\u0002\u0092\u0093\u0007!\u0002\u0002",
    "\u0093\u0095\u0007\u001a\u0002\u0002\u0094\u0089\u0003\u0002\u0002\u0002",
    "\u0094\u008b\u0003\u0002\u0002\u0002\u0094\u008f\u0003\u0002\u0002\u0002",
    "\u0095\u0017\u0003\u0002\u0002\u0002\u0096\u0097\u0007\u001b\u0002\u0002",
    "\u0097\u00a7\u0007#\u0002\u0002\u0098\u0099\u0007\u001b\u0002\u0002",
    "\u0099\u009a\u0007#\u0002\u0002\u009a\u009b\u0007\u0019\u0002\u0002",
    "\u009b\u00a7\u0007\u001a\u0002\u0002\u009c\u009d\u0007\u001b\u0002\u0002",
    "\u009d\u009e\u0007#\u0002\u0002\u009e\u009f\u0007\u0007\u0002\u0002",
    "\u009f\u00a7\u0007\u001c\u0002\u0002\u00a0\u00a1\u0007\u001b\u0002\u0002",
    "\u00a1\u00a2\u0007#\u0002\u0002\u00a2\u00a3\u0007\u0007\u0002\u0002",
    "\u00a3\u00a4\u0007\u001c\u0002\u0002\u00a4\u00a5\u0007\u0019\u0002\u0002",
    "\u00a5\u00a7\u0007\u001a\u0002\u0002\u00a6\u0096\u0003\u0002\u0002\u0002",
    "\u00a6\u0098\u0003\u0002\u0002\u0002\u00a6\u009c\u0003\u0002\u0002\u0002",
    "\u00a6\u00a0\u0003\u0002\u0002\u0002\u00a7\u0019\u0003\u0002\u0002\u0002",
    "\u00a8\u00a9\u0007\u001d\u0002\u0002\u00a9\u00ad\u0007\u001e\u0002\u0002",
    "\u00aa\u00ab\u0007\u001d\u0002\u0002\u00ab\u00ad\u0007\u001f\u0002\u0002",
    "\u00ac\u00a8\u0003\u0002\u0002\u0002\u00ac\u00aa\u0003\u0002\u0002\u0002",
    "\u00ad\u001b\u0003\u0002\u0002\u0002\u000f\u001f%+1DZeky\u0087\u0094",
    "\u00a6\u00ac"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "':'", "'SKIP INSTRUCTION'", "'JUMP'", "'TO'", 
                     "'ON'", "'NONE'", "'TRUE'", "'FALSE'", "'PUSH'", "'HANDLER'", 
                     "'ELEMENT'", "'SOURCE'", "'POP'", "'COMPONENT'", "'LOAD'", 
                     "'VARIABLE'", "'PARAMETER'", "'DOCUMENT'", "'MESSAGE'", 
                     "'STORE'", "'DRAFT'", "'INVOKE'", "'WITH'", "'PARAMETERS'", 
                     "'EXECUTE'", "'TARGET'", "'HANDLE'", "'EXCEPTION'", 
                     "'RESULT'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, "LABEL", "NUMBER", "LITERAL", "SYMBOL", 
                      "NEWLINE", "SPACE" ];

var ruleNames =  [ "procedure", "step", "label", "instruction", "skipInstruction", 
                   "jumpInstruction", "pushInstruction", "popInstruction", 
                   "loadInstruction", "storeInstruction", "invokeInstruction", 
                   "executeInstruction", "handleInstruction" ];

function BaliInstructionSetParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

BaliInstructionSetParser.prototype = Object.create(antlr4.Parser.prototype);
BaliInstructionSetParser.prototype.constructor = BaliInstructionSetParser;

Object.defineProperty(BaliInstructionSetParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

BaliInstructionSetParser.EOF = antlr4.Token.EOF;
BaliInstructionSetParser.T__0 = 1;
BaliInstructionSetParser.T__1 = 2;
BaliInstructionSetParser.T__2 = 3;
BaliInstructionSetParser.T__3 = 4;
BaliInstructionSetParser.T__4 = 5;
BaliInstructionSetParser.T__5 = 6;
BaliInstructionSetParser.T__6 = 7;
BaliInstructionSetParser.T__7 = 8;
BaliInstructionSetParser.T__8 = 9;
BaliInstructionSetParser.T__9 = 10;
BaliInstructionSetParser.T__10 = 11;
BaliInstructionSetParser.T__11 = 12;
BaliInstructionSetParser.T__12 = 13;
BaliInstructionSetParser.T__13 = 14;
BaliInstructionSetParser.T__14 = 15;
BaliInstructionSetParser.T__15 = 16;
BaliInstructionSetParser.T__16 = 17;
BaliInstructionSetParser.T__17 = 18;
BaliInstructionSetParser.T__18 = 19;
BaliInstructionSetParser.T__19 = 20;
BaliInstructionSetParser.T__20 = 21;
BaliInstructionSetParser.T__21 = 22;
BaliInstructionSetParser.T__22 = 23;
BaliInstructionSetParser.T__23 = 24;
BaliInstructionSetParser.T__24 = 25;
BaliInstructionSetParser.T__25 = 26;
BaliInstructionSetParser.T__26 = 27;
BaliInstructionSetParser.T__27 = 28;
BaliInstructionSetParser.T__28 = 29;
BaliInstructionSetParser.LABEL = 30;
BaliInstructionSetParser.NUMBER = 31;
BaliInstructionSetParser.LITERAL = 32;
BaliInstructionSetParser.SYMBOL = 33;
BaliInstructionSetParser.NEWLINE = 34;
BaliInstructionSetParser.SPACE = 35;

BaliInstructionSetParser.RULE_procedure = 0;
BaliInstructionSetParser.RULE_step = 1;
BaliInstructionSetParser.RULE_label = 2;
BaliInstructionSetParser.RULE_instruction = 3;
BaliInstructionSetParser.RULE_skipInstruction = 4;
BaliInstructionSetParser.RULE_jumpInstruction = 5;
BaliInstructionSetParser.RULE_pushInstruction = 6;
BaliInstructionSetParser.RULE_popInstruction = 7;
BaliInstructionSetParser.RULE_loadInstruction = 8;
BaliInstructionSetParser.RULE_storeInstruction = 9;
BaliInstructionSetParser.RULE_invokeInstruction = 10;
BaliInstructionSetParser.RULE_executeInstruction = 11;
BaliInstructionSetParser.RULE_handleInstruction = 12;

function ProcedureContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = BaliInstructionSetParser.RULE_procedure;
    return this;
}

ProcedureContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ProcedureContext.prototype.constructor = ProcedureContext;

ProcedureContext.prototype.EOF = function() {
    return this.getToken(BaliInstructionSetParser.EOF, 0);
};

ProcedureContext.prototype.NEWLINE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(BaliInstructionSetParser.NEWLINE);
    } else {
        return this.getToken(BaliInstructionSetParser.NEWLINE, i);
    }
};


ProcedureContext.prototype.step = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(StepContext);
    } else {
        return this.getTypedRuleContext(StepContext,i);
    }
};

ProcedureContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterProcedure(this);
	}
};

ProcedureContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitProcedure(this);
	}
};

ProcedureContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitProcedure(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.ProcedureContext = ProcedureContext;

BaliInstructionSetParser.prototype.procedure = function() {

    var localctx = new ProcedureContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, BaliInstructionSetParser.RULE_procedure);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 29;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 26;
                this.match(BaliInstructionSetParser.NEWLINE); 
            }
            this.state = 31;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
        }

        this.state = 35;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,1,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 32;
                this.step(); 
            }
            this.state = 37;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,1,this._ctx);
        }

        this.state = 41;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===BaliInstructionSetParser.NEWLINE) {
            this.state = 38;
            this.match(BaliInstructionSetParser.NEWLINE);
            this.state = 43;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 44;
        this.match(BaliInstructionSetParser.EOF);
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
    this.ruleIndex = BaliInstructionSetParser.RULE_step;
    return this;
}

StepContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StepContext.prototype.constructor = StepContext;

StepContext.prototype.instruction = function() {
    return this.getTypedRuleContext(InstructionContext,0);
};

StepContext.prototype.NEWLINE = function() {
    return this.getToken(BaliInstructionSetParser.NEWLINE, 0);
};

StepContext.prototype.label = function() {
    return this.getTypedRuleContext(LabelContext,0);
};

StepContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterStep(this);
	}
};

StepContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitStep(this);
	}
};

StepContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitStep(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.StepContext = StepContext;

BaliInstructionSetParser.prototype.step = function() {

    var localctx = new StepContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, BaliInstructionSetParser.RULE_step);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 47;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===BaliInstructionSetParser.NEWLINE) {
            this.state = 46;
            this.label();
        }

        this.state = 49;
        this.instruction();
        this.state = 50;
        this.match(BaliInstructionSetParser.NEWLINE);
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
    this.ruleIndex = BaliInstructionSetParser.RULE_label;
    return this;
}

LabelContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LabelContext.prototype.constructor = LabelContext;

LabelContext.prototype.NEWLINE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(BaliInstructionSetParser.NEWLINE);
    } else {
        return this.getToken(BaliInstructionSetParser.NEWLINE, i);
    }
};


LabelContext.prototype.LABEL = function() {
    return this.getToken(BaliInstructionSetParser.LABEL, 0);
};

LabelContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterLabel(this);
	}
};

LabelContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitLabel(this);
	}
};

LabelContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitLabel(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.LabelContext = LabelContext;

BaliInstructionSetParser.prototype.label = function() {

    var localctx = new LabelContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, BaliInstructionSetParser.RULE_label);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 52;
        this.match(BaliInstructionSetParser.NEWLINE);
        this.state = 53;
        this.match(BaliInstructionSetParser.LABEL);
        this.state = 54;
        this.match(BaliInstructionSetParser.T__0);
        this.state = 55;
        this.match(BaliInstructionSetParser.NEWLINE);
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
    this.ruleIndex = BaliInstructionSetParser.RULE_instruction;
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

InstructionContext.prototype.executeInstruction = function() {
    return this.getTypedRuleContext(ExecuteInstructionContext,0);
};

InstructionContext.prototype.handleInstruction = function() {
    return this.getTypedRuleContext(HandleInstructionContext,0);
};

InstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterInstruction(this);
	}
};

InstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitInstruction(this);
	}
};

InstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.InstructionContext = InstructionContext;

BaliInstructionSetParser.prototype.instruction = function() {

    var localctx = new InstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, BaliInstructionSetParser.RULE_instruction);
    try {
        this.state = 66;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case BaliInstructionSetParser.T__1:
            this.enterOuterAlt(localctx, 1);
            this.state = 57;
            this.skipInstruction();
            break;
        case BaliInstructionSetParser.T__2:
            this.enterOuterAlt(localctx, 2);
            this.state = 58;
            this.jumpInstruction();
            break;
        case BaliInstructionSetParser.T__8:
            this.enterOuterAlt(localctx, 3);
            this.state = 59;
            this.pushInstruction();
            break;
        case BaliInstructionSetParser.T__12:
            this.enterOuterAlt(localctx, 4);
            this.state = 60;
            this.popInstruction();
            break;
        case BaliInstructionSetParser.T__14:
            this.enterOuterAlt(localctx, 5);
            this.state = 61;
            this.loadInstruction();
            break;
        case BaliInstructionSetParser.T__19:
            this.enterOuterAlt(localctx, 6);
            this.state = 62;
            this.storeInstruction();
            break;
        case BaliInstructionSetParser.T__21:
            this.enterOuterAlt(localctx, 7);
            this.state = 63;
            this.invokeInstruction();
            break;
        case BaliInstructionSetParser.T__24:
            this.enterOuterAlt(localctx, 8);
            this.state = 64;
            this.executeInstruction();
            break;
        case BaliInstructionSetParser.T__26:
            this.enterOuterAlt(localctx, 9);
            this.state = 65;
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
    this.ruleIndex = BaliInstructionSetParser.RULE_skipInstruction;
    return this;
}

SkipInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SkipInstructionContext.prototype.constructor = SkipInstructionContext;


SkipInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterSkipInstruction(this);
	}
};

SkipInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitSkipInstruction(this);
	}
};

SkipInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitSkipInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.SkipInstructionContext = SkipInstructionContext;

BaliInstructionSetParser.prototype.skipInstruction = function() {

    var localctx = new SkipInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, BaliInstructionSetParser.RULE_skipInstruction);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 68;
        this.match(BaliInstructionSetParser.T__1);
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
    this.ruleIndex = BaliInstructionSetParser.RULE_jumpInstruction;
    return this;
}

JumpInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
JumpInstructionContext.prototype.constructor = JumpInstructionContext;

JumpInstructionContext.prototype.LABEL = function() {
    return this.getToken(BaliInstructionSetParser.LABEL, 0);
};

JumpInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterJumpInstruction(this);
	}
};

JumpInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitJumpInstruction(this);
	}
};

JumpInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitJumpInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.JumpInstructionContext = JumpInstructionContext;

BaliInstructionSetParser.prototype.jumpInstruction = function() {

    var localctx = new JumpInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, BaliInstructionSetParser.RULE_jumpInstruction);
    try {
        this.state = 88;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 70;
            this.match(BaliInstructionSetParser.T__2);
            this.state = 71;
            this.match(BaliInstructionSetParser.T__3);
            this.state = 72;
            this.match(BaliInstructionSetParser.LABEL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 73;
            this.match(BaliInstructionSetParser.T__2);
            this.state = 74;
            this.match(BaliInstructionSetParser.T__3);
            this.state = 75;
            this.match(BaliInstructionSetParser.LABEL);
            this.state = 76;
            this.match(BaliInstructionSetParser.T__4);
            this.state = 77;
            this.match(BaliInstructionSetParser.T__5);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 78;
            this.match(BaliInstructionSetParser.T__2);
            this.state = 79;
            this.match(BaliInstructionSetParser.T__3);
            this.state = 80;
            this.match(BaliInstructionSetParser.LABEL);
            this.state = 81;
            this.match(BaliInstructionSetParser.T__4);
            this.state = 82;
            this.match(BaliInstructionSetParser.T__6);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 83;
            this.match(BaliInstructionSetParser.T__2);
            this.state = 84;
            this.match(BaliInstructionSetParser.T__3);
            this.state = 85;
            this.match(BaliInstructionSetParser.LABEL);
            this.state = 86;
            this.match(BaliInstructionSetParser.T__4);
            this.state = 87;
            this.match(BaliInstructionSetParser.T__7);
            break;

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
    this.ruleIndex = BaliInstructionSetParser.RULE_pushInstruction;
    return this;
}

PushInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PushInstructionContext.prototype.constructor = PushInstructionContext;

PushInstructionContext.prototype.LABEL = function() {
    return this.getToken(BaliInstructionSetParser.LABEL, 0);
};

PushInstructionContext.prototype.LITERAL = function() {
    return this.getToken(BaliInstructionSetParser.LITERAL, 0);
};

PushInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterPushInstruction(this);
	}
};

PushInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitPushInstruction(this);
	}
};

PushInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitPushInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.PushInstructionContext = PushInstructionContext;

BaliInstructionSetParser.prototype.pushInstruction = function() {

    var localctx = new PushInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, BaliInstructionSetParser.RULE_pushInstruction);
    try {
        this.state = 99;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 90;
            this.match(BaliInstructionSetParser.T__8);
            this.state = 91;
            this.match(BaliInstructionSetParser.T__9);
            this.state = 92;
            this.match(BaliInstructionSetParser.LABEL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 93;
            this.match(BaliInstructionSetParser.T__8);
            this.state = 94;
            this.match(BaliInstructionSetParser.T__10);
            this.state = 95;
            this.match(BaliInstructionSetParser.LITERAL);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 96;
            this.match(BaliInstructionSetParser.T__8);
            this.state = 97;
            this.match(BaliInstructionSetParser.T__11);
            this.state = 98;
            this.match(BaliInstructionSetParser.LITERAL);
            break;

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
    this.ruleIndex = BaliInstructionSetParser.RULE_popInstruction;
    return this;
}

PopInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PopInstructionContext.prototype.constructor = PopInstructionContext;


PopInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterPopInstruction(this);
	}
};

PopInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitPopInstruction(this);
	}
};

PopInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitPopInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.PopInstructionContext = PopInstructionContext;

BaliInstructionSetParser.prototype.popInstruction = function() {

    var localctx = new PopInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, BaliInstructionSetParser.RULE_popInstruction);
    try {
        this.state = 105;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 101;
            this.match(BaliInstructionSetParser.T__12);
            this.state = 102;
            this.match(BaliInstructionSetParser.T__9);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 103;
            this.match(BaliInstructionSetParser.T__12);
            this.state = 104;
            this.match(BaliInstructionSetParser.T__13);
            break;

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
    this.ruleIndex = BaliInstructionSetParser.RULE_loadInstruction;
    return this;
}

LoadInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LoadInstructionContext.prototype.constructor = LoadInstructionContext;

LoadInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(BaliInstructionSetParser.SYMBOL, 0);
};

LoadInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterLoadInstruction(this);
	}
};

LoadInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitLoadInstruction(this);
	}
};

LoadInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitLoadInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.LoadInstructionContext = LoadInstructionContext;

BaliInstructionSetParser.prototype.loadInstruction = function() {

    var localctx = new LoadInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, BaliInstructionSetParser.RULE_loadInstruction);
    try {
        this.state = 119;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,8,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 107;
            this.match(BaliInstructionSetParser.T__14);
            this.state = 108;
            this.match(BaliInstructionSetParser.T__15);
            this.state = 109;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 110;
            this.match(BaliInstructionSetParser.T__14);
            this.state = 111;
            this.match(BaliInstructionSetParser.T__16);
            this.state = 112;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 113;
            this.match(BaliInstructionSetParser.T__14);
            this.state = 114;
            this.match(BaliInstructionSetParser.T__17);
            this.state = 115;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 116;
            this.match(BaliInstructionSetParser.T__14);
            this.state = 117;
            this.match(BaliInstructionSetParser.T__18);
            this.state = 118;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

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

function StoreInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = BaliInstructionSetParser.RULE_storeInstruction;
    return this;
}

StoreInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StoreInstructionContext.prototype.constructor = StoreInstructionContext;

StoreInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(BaliInstructionSetParser.SYMBOL, 0);
};

StoreInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterStoreInstruction(this);
	}
};

StoreInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitStoreInstruction(this);
	}
};

StoreInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitStoreInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.StoreInstructionContext = StoreInstructionContext;

BaliInstructionSetParser.prototype.storeInstruction = function() {

    var localctx = new StoreInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, BaliInstructionSetParser.RULE_storeInstruction);
    try {
        this.state = 133;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 121;
            this.match(BaliInstructionSetParser.T__19);
            this.state = 122;
            this.match(BaliInstructionSetParser.T__15);
            this.state = 123;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 124;
            this.match(BaliInstructionSetParser.T__19);
            this.state = 125;
            this.match(BaliInstructionSetParser.T__20);
            this.state = 126;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 127;
            this.match(BaliInstructionSetParser.T__19);
            this.state = 128;
            this.match(BaliInstructionSetParser.T__17);
            this.state = 129;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 130;
            this.match(BaliInstructionSetParser.T__19);
            this.state = 131;
            this.match(BaliInstructionSetParser.T__18);
            this.state = 132;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

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

function InvokeInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = BaliInstructionSetParser.RULE_invokeInstruction;
    return this;
}

InvokeInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InvokeInstructionContext.prototype.constructor = InvokeInstructionContext;

InvokeInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(BaliInstructionSetParser.SYMBOL, 0);
};

InvokeInstructionContext.prototype.NUMBER = function() {
    return this.getToken(BaliInstructionSetParser.NUMBER, 0);
};

InvokeInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterInvokeInstruction(this);
	}
};

InvokeInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitInvokeInstruction(this);
	}
};

InvokeInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitInvokeInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.InvokeInstructionContext = InvokeInstructionContext;

BaliInstructionSetParser.prototype.invokeInstruction = function() {

    var localctx = new InvokeInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, BaliInstructionSetParser.RULE_invokeInstruction);
    try {
        this.state = 146;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 135;
            this.match(BaliInstructionSetParser.T__21);
            this.state = 136;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 137;
            this.match(BaliInstructionSetParser.T__21);
            this.state = 138;
            this.match(BaliInstructionSetParser.SYMBOL);
            this.state = 139;
            this.match(BaliInstructionSetParser.T__22);
            this.state = 140;
            this.match(BaliInstructionSetParser.T__16);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 141;
            this.match(BaliInstructionSetParser.T__21);
            this.state = 142;
            this.match(BaliInstructionSetParser.SYMBOL);
            this.state = 143;
            this.match(BaliInstructionSetParser.T__22);
            this.state = 144;
            this.match(BaliInstructionSetParser.NUMBER);
            this.state = 145;
            this.match(BaliInstructionSetParser.T__23);
            break;

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

function ExecuteInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = BaliInstructionSetParser.RULE_executeInstruction;
    return this;
}

ExecuteInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExecuteInstructionContext.prototype.constructor = ExecuteInstructionContext;

ExecuteInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(BaliInstructionSetParser.SYMBOL, 0);
};

ExecuteInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterExecuteInstruction(this);
	}
};

ExecuteInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitExecuteInstruction(this);
	}
};

ExecuteInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitExecuteInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.ExecuteInstructionContext = ExecuteInstructionContext;

BaliInstructionSetParser.prototype.executeInstruction = function() {

    var localctx = new ExecuteInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, BaliInstructionSetParser.RULE_executeInstruction);
    try {
        this.state = 164;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 148;
            this.match(BaliInstructionSetParser.T__24);
            this.state = 149;
            this.match(BaliInstructionSetParser.SYMBOL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 150;
            this.match(BaliInstructionSetParser.T__24);
            this.state = 151;
            this.match(BaliInstructionSetParser.SYMBOL);
            this.state = 152;
            this.match(BaliInstructionSetParser.T__22);
            this.state = 153;
            this.match(BaliInstructionSetParser.T__23);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 154;
            this.match(BaliInstructionSetParser.T__24);
            this.state = 155;
            this.match(BaliInstructionSetParser.SYMBOL);
            this.state = 156;
            this.match(BaliInstructionSetParser.T__4);
            this.state = 157;
            this.match(BaliInstructionSetParser.T__25);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 158;
            this.match(BaliInstructionSetParser.T__24);
            this.state = 159;
            this.match(BaliInstructionSetParser.SYMBOL);
            this.state = 160;
            this.match(BaliInstructionSetParser.T__4);
            this.state = 161;
            this.match(BaliInstructionSetParser.T__25);
            this.state = 162;
            this.match(BaliInstructionSetParser.T__22);
            this.state = 163;
            this.match(BaliInstructionSetParser.T__23);
            break;

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
    this.ruleIndex = BaliInstructionSetParser.RULE_handleInstruction;
    return this;
}

HandleInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
HandleInstructionContext.prototype.constructor = HandleInstructionContext;


HandleInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.enterHandleInstruction(this);
	}
};

HandleInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof BaliInstructionSetListener ) {
        listener.exitHandleInstruction(this);
	}
};

HandleInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof BaliInstructionSetVisitor ) {
        return visitor.visitHandleInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




BaliInstructionSetParser.HandleInstructionContext = HandleInstructionContext;

BaliInstructionSetParser.prototype.handleInstruction = function() {

    var localctx = new HandleInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, BaliInstructionSetParser.RULE_handleInstruction);
    try {
        this.state = 170;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 166;
            this.match(BaliInstructionSetParser.T__26);
            this.state = 167;
            this.match(BaliInstructionSetParser.T__27);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 168;
            this.match(BaliInstructionSetParser.T__26);
            this.state = 169;
            this.match(BaliInstructionSetParser.T__28);
            break;

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


exports.BaliInstructionSetParser = BaliInstructionSetParser;
