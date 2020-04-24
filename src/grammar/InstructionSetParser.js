// Generated from src/grammar/InstructionSet.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var InstructionSetListener = require('./InstructionSetListener').InstructionSetListener;
var InstructionSetVisitor = require('./InstructionSetVisitor').InstructionSetVisitor;

var grammarFileName = "InstructionSet.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003%\u00c1\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
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
    "\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0005\te\n\t\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003",
    "\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0005\ns\n\n\u0003\u000b",
    "\u0003\u000b\u0003\u000b\u0003\u000b\u0005\u000by\n\u000b\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0005\f\u0087\n\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r",
    "\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0005\r\u0095",
    "\n\r\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0005\u000e\u00a3\n\u000e\u0003\u000f\u0003\u000f\u0003\u000f",
    "\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f",
    "\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f",
    "\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0005\u000f",
    "\u00b9\n\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0005",
    "\u0010\u00bf\n\u0010\u0003\u0010\u0002\u0002\u0011\u0002\u0004\u0006",
    "\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e\u0002\u0002",
    "\u0002\u00d1\u0002#\u0003\u0002\u0002\u0002\u0004/\u0003\u0002\u0002",
    "\u0002\u00068\u0003\u0002\u0002\u0002\b=\u0003\u0002\u0002\u0002\nC",
    "\u0003\u0002\u0002\u0002\fN\u0003\u0002\u0002\u0002\u000eP\u0003\u0002",
    "\u0002\u0002\u0010d\u0003\u0002\u0002\u0002\u0012r\u0003\u0002\u0002",
    "\u0002\u0014x\u0003\u0002\u0002\u0002\u0016\u0086\u0003\u0002\u0002",
    "\u0002\u0018\u0094\u0003\u0002\u0002\u0002\u001a\u00a2\u0003\u0002\u0002",
    "\u0002\u001c\u00b8\u0003\u0002\u0002\u0002\u001e\u00be\u0003\u0002\u0002",
    "\u0002 \"\u0007$\u0002\u0002! \u0003\u0002\u0002\u0002\"%\u0003\u0002",
    "\u0002\u0002#!\u0003\u0002\u0002\u0002#$\u0003\u0002\u0002\u0002$&\u0003",
    "\u0002\u0002\u0002%#\u0003\u0002\u0002\u0002&*\u0005\u0004\u0003\u0002",
    "\')\u0007$\u0002\u0002(\'\u0003\u0002\u0002\u0002),\u0003\u0002\u0002",
    "\u0002*(\u0003\u0002\u0002\u0002*+\u0003\u0002\u0002\u0002+-\u0003\u0002",
    "\u0002\u0002,*\u0003\u0002\u0002\u0002-.\u0007\u0002\u0002\u0003.\u0003",
    "\u0003\u0002\u0002\u0002/4\u0005\u0006\u0004\u000201\u0007$\u0002\u0002",
    "13\u0005\u0006\u0004\u000220\u0003\u0002\u0002\u000236\u0003\u0002\u0002",
    "\u000242\u0003\u0002\u0002\u000245\u0003\u0002\u0002\u00025\u0005\u0003",
    "\u0002\u0002\u000264\u0003\u0002\u0002\u000279\u0005\b\u0005\u00028",
    "7\u0003\u0002\u0002\u000289\u0003\u0002\u0002\u00029:\u0003\u0002\u0002",
    "\u0002:;\u0005\f\u0007\u0002;\u0007\u0003\u0002\u0002\u0002<>\u0007",
    "$\u0002\u0002=<\u0003\u0002\u0002\u0002=>\u0003\u0002\u0002\u0002>?",
    "\u0003\u0002\u0002\u0002?@\u0007 \u0002\u0002@A\u0007\u0003\u0002\u0002",
    "AB\u0007$\u0002\u0002B\t\u0003\u0002\u0002\u0002CD\u0007#\u0002\u0002",
    "D\u000b\u0003\u0002\u0002\u0002EO\u0005\u000e\b\u0002FO\u0005\u0010",
    "\t\u0002GO\u0005\u0012\n\u0002HO\u0005\u0014\u000b\u0002IO\u0005\u0016",
    "\f\u0002JO\u0005\u0018\r\u0002KO\u0005\u001a\u000e\u0002LO\u0005\u001c",
    "\u000f\u0002MO\u0005\u001e\u0010\u0002NE\u0003\u0002\u0002\u0002NF\u0003",
    "\u0002\u0002\u0002NG\u0003\u0002\u0002\u0002NH\u0003\u0002\u0002\u0002",
    "NI\u0003\u0002\u0002\u0002NJ\u0003\u0002\u0002\u0002NK\u0003\u0002\u0002",
    "\u0002NL\u0003\u0002\u0002\u0002NM\u0003\u0002\u0002\u0002O\r\u0003",
    "\u0002\u0002\u0002PQ\u0007\u0004\u0002\u0002Q\u000f\u0003\u0002\u0002",
    "\u0002RS\u0007\u0005\u0002\u0002ST\u0007\u0006\u0002\u0002Te\u0007 ",
    "\u0002\u0002UV\u0007\u0005\u0002\u0002VW\u0007\u0006\u0002\u0002WX\u0007",
    " \u0002\u0002XY\u0007\u0007\u0002\u0002Ye\u0007\b\u0002\u0002Z[\u0007",
    "\u0005\u0002\u0002[\\\u0007\u0006\u0002\u0002\\]\u0007 \u0002\u0002",
    "]^\u0007\u0007\u0002\u0002^e\u0007\t\u0002\u0002_`\u0007\u0005\u0002",
    "\u0002`a\u0007\u0006\u0002\u0002ab\u0007 \u0002\u0002bc\u0007\u0007",
    "\u0002\u0002ce\u0007\n\u0002\u0002dR\u0003\u0002\u0002\u0002dU\u0003",
    "\u0002\u0002\u0002dZ\u0003\u0002\u0002\u0002d_\u0003\u0002\u0002\u0002",
    "e\u0011\u0003\u0002\u0002\u0002fg\u0007\u000b\u0002\u0002gh\u0007\f",
    "\u0002\u0002hs\u0007 \u0002\u0002ij\u0007\u000b\u0002\u0002jk\u0007",
    "\r\u0002\u0002ks\u0007\"\u0002\u0002lm\u0007\u000b\u0002\u0002mn\u0007",
    "\u000e\u0002\u0002ns\u0007#\u0002\u0002op\u0007\u000b\u0002\u0002pq",
    "\u0007\u000f\u0002\u0002qs\u0007#\u0002\u0002rf\u0003\u0002\u0002\u0002",
    "ri\u0003\u0002\u0002\u0002rl\u0003\u0002\u0002\u0002ro\u0003\u0002\u0002",
    "\u0002s\u0013\u0003\u0002\u0002\u0002tu\u0007\u0010\u0002\u0002uy\u0007",
    "\f\u0002\u0002vw\u0007\u0010\u0002\u0002wy\u0007\u0011\u0002\u0002x",
    "t\u0003\u0002\u0002\u0002xv\u0003\u0002\u0002\u0002y\u0015\u0003\u0002",
    "\u0002\u0002z{\u0007\u0012\u0002\u0002{|\u0007\u0013\u0002\u0002|\u0087",
    "\u0005\n\u0006\u0002}~\u0007\u0012\u0002\u0002~\u007f\u0007\u0014\u0002",
    "\u0002\u007f\u0087\u0005\n\u0006\u0002\u0080\u0081\u0007\u0012\u0002",
    "\u0002\u0081\u0082\u0007\u0015\u0002\u0002\u0082\u0087\u0005\n\u0006",
    "\u0002\u0083\u0084\u0007\u0012\u0002\u0002\u0084\u0085\u0007\u0016\u0002",
    "\u0002\u0085\u0087\u0005\n\u0006\u0002\u0086z\u0003\u0002\u0002\u0002",
    "\u0086}\u0003\u0002\u0002\u0002\u0086\u0080\u0003\u0002\u0002\u0002",
    "\u0086\u0083\u0003\u0002\u0002\u0002\u0087\u0017\u0003\u0002\u0002\u0002",
    "\u0088\u0089\u0007\u0017\u0002\u0002\u0089\u008a\u0007\u0013\u0002\u0002",
    "\u008a\u0095\u0005\n\u0006\u0002\u008b\u008c\u0007\u0017\u0002\u0002",
    "\u008c\u008d\u0007\u0014\u0002\u0002\u008d\u0095\u0005\n\u0006\u0002",
    "\u008e\u008f\u0007\u0017\u0002\u0002\u008f\u0090\u0007\u0015\u0002\u0002",
    "\u0090\u0095\u0005\n\u0006\u0002\u0091\u0092\u0007\u0017\u0002\u0002",
    "\u0092\u0093\u0007\u0016\u0002\u0002\u0093\u0095\u0005\n\u0006\u0002",
    "\u0094\u0088\u0003\u0002\u0002\u0002\u0094\u008b\u0003\u0002\u0002\u0002",
    "\u0094\u008e\u0003\u0002\u0002\u0002\u0094\u0091\u0003\u0002\u0002\u0002",
    "\u0095\u0019\u0003\u0002\u0002\u0002\u0096\u0097\u0007\u0018\u0002\u0002",
    "\u0097\u00a3\u0007#\u0002\u0002\u0098\u0099\u0007\u0018\u0002\u0002",
    "\u0099\u009a\u0007#\u0002\u0002\u009a\u009b\u0007\u0019\u0002\u0002",
    "\u009b\u009c\u0007\u001a\u0002\u0002\u009c\u00a3\u0007\u000f\u0002\u0002",
    "\u009d\u009e\u0007\u0018\u0002\u0002\u009e\u009f\u0007#\u0002\u0002",
    "\u009f\u00a0\u0007\u0019\u0002\u0002\u00a0\u00a1\u0007!\u0002\u0002",
    "\u00a1\u00a3\u0007\u001b\u0002\u0002\u00a2\u0096\u0003\u0002\u0002\u0002",
    "\u00a2\u0098\u0003\u0002\u0002\u0002\u00a2\u009d\u0003\u0002\u0002\u0002",
    "\u00a3\u001b\u0003\u0002\u0002\u0002\u00a4\u00a5\u0007\u001c\u0002\u0002",
    "\u00a5\u00a6\u0007#\u0002\u0002\u00a6\u00a7\u0007\u0006\u0002\u0002",
    "\u00a7\u00b9\u0007\u0011\u0002\u0002\u00a8\u00a9\u0007\u001c\u0002\u0002",
    "\u00a9\u00aa\u0007#\u0002\u0002\u00aa\u00ab\u0007\u0006\u0002\u0002",
    "\u00ab\u00ac\u0007\u0011\u0002\u0002\u00ac\u00ad\u0007\u0019\u0002\u0002",
    "\u00ad\u00b9\u0007\u001b\u0002\u0002\u00ae\u00af\u0007\u001c\u0002\u0002",
    "\u00af\u00b0\u0007#\u0002\u0002\u00b0\u00b1\u0007\u0006\u0002\u0002",
    "\u00b1\u00b9\u0007\u0016\u0002\u0002\u00b2\u00b3\u0007\u001c\u0002\u0002",
    "\u00b3\u00b4\u0007#\u0002\u0002\u00b4\u00b5\u0007\u0006\u0002\u0002",
    "\u00b5\u00b6\u0007\u0016\u0002\u0002\u00b6\u00b7\u0007\u0019\u0002\u0002",
    "\u00b7\u00b9\u0007\u001b\u0002\u0002\u00b8\u00a4\u0003\u0002\u0002\u0002",
    "\u00b8\u00a8\u0003\u0002\u0002\u0002\u00b8\u00ae\u0003\u0002\u0002\u0002",
    "\u00b8\u00b2\u0003\u0002\u0002\u0002\u00b9\u001d\u0003\u0002\u0002\u0002",
    "\u00ba\u00bb\u0007\u001d\u0002\u0002\u00bb\u00bf\u0007\u001e\u0002\u0002",
    "\u00bc\u00bd\u0007\u001d\u0002\u0002\u00bd\u00bf\u0007\u001f\u0002\u0002",
    "\u00be\u00ba\u0003\u0002\u0002\u0002\u00be\u00bc\u0003\u0002\u0002\u0002",
    "\u00bf\u001f\u0003\u0002\u0002\u0002\u0010#*48=Ndrx\u0086\u0094\u00a2",
    "\u00b8\u00be"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "':'", "'SKIP INSTRUCTION'", "'JUMP'", "'TO'", 
                     "'ON'", "'NONE'", "'TRUE'", "'FALSE'", "'PUSH'", "'HANDLER'", 
                     "'LITERAL'", "'CONSTANT'", "'ARGUMENT'", "'POP'", "'COMPONENT'", 
                     "'LOAD'", "'VARIABLE'", "'MESSAGE'", "'DRAFT'", "'DOCUMENT'", 
                     "'STORE'", "'INVOKE'", "'WITH'", "'1'", "'ARGUMENTS'", 
                     "'SEND'", "'HANDLE'", "'EXCEPTION'", "'RESULT'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, "LABEL", "NUMBER", "LITERAL", "SYMBOL", 
                      "EOL", "SPACE" ];

var ruleNames =  [ "document", "instructions", "step", "label", "variable", 
                   "instruction", "skipInstruction", "jumpInstruction", 
                   "pushInstruction", "popInstruction", "loadInstruction", 
                   "storeInstruction", "invokeInstruction", "sendInstruction", 
                   "handleInstruction" ];

function InstructionSetParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

InstructionSetParser.prototype = Object.create(antlr4.Parser.prototype);
InstructionSetParser.prototype.constructor = InstructionSetParser;

Object.defineProperty(InstructionSetParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

InstructionSetParser.EOF = antlr4.Token.EOF;
InstructionSetParser.T__0 = 1;
InstructionSetParser.T__1 = 2;
InstructionSetParser.T__2 = 3;
InstructionSetParser.T__3 = 4;
InstructionSetParser.T__4 = 5;
InstructionSetParser.T__5 = 6;
InstructionSetParser.T__6 = 7;
InstructionSetParser.T__7 = 8;
InstructionSetParser.T__8 = 9;
InstructionSetParser.T__9 = 10;
InstructionSetParser.T__10 = 11;
InstructionSetParser.T__11 = 12;
InstructionSetParser.T__12 = 13;
InstructionSetParser.T__13 = 14;
InstructionSetParser.T__14 = 15;
InstructionSetParser.T__15 = 16;
InstructionSetParser.T__16 = 17;
InstructionSetParser.T__17 = 18;
InstructionSetParser.T__18 = 19;
InstructionSetParser.T__19 = 20;
InstructionSetParser.T__20 = 21;
InstructionSetParser.T__21 = 22;
InstructionSetParser.T__22 = 23;
InstructionSetParser.T__23 = 24;
InstructionSetParser.T__24 = 25;
InstructionSetParser.T__25 = 26;
InstructionSetParser.T__26 = 27;
InstructionSetParser.T__27 = 28;
InstructionSetParser.T__28 = 29;
InstructionSetParser.LABEL = 30;
InstructionSetParser.NUMBER = 31;
InstructionSetParser.LITERAL = 32;
InstructionSetParser.SYMBOL = 33;
InstructionSetParser.EOL = 34;
InstructionSetParser.SPACE = 35;

InstructionSetParser.RULE_document = 0;
InstructionSetParser.RULE_instructions = 1;
InstructionSetParser.RULE_step = 2;
InstructionSetParser.RULE_label = 3;
InstructionSetParser.RULE_variable = 4;
InstructionSetParser.RULE_instruction = 5;
InstructionSetParser.RULE_skipInstruction = 6;
InstructionSetParser.RULE_jumpInstruction = 7;
InstructionSetParser.RULE_pushInstruction = 8;
InstructionSetParser.RULE_popInstruction = 9;
InstructionSetParser.RULE_loadInstruction = 10;
InstructionSetParser.RULE_storeInstruction = 11;
InstructionSetParser.RULE_invokeInstruction = 12;
InstructionSetParser.RULE_sendInstruction = 13;
InstructionSetParser.RULE_handleInstruction = 14;

function DocumentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = InstructionSetParser.RULE_document;
    return this;
}

DocumentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DocumentContext.prototype.constructor = DocumentContext;

DocumentContext.prototype.instructions = function() {
    return this.getTypedRuleContext(InstructionsContext,0);
};

DocumentContext.prototype.EOF = function() {
    return this.getToken(InstructionSetParser.EOF, 0);
};

DocumentContext.prototype.EOL = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(InstructionSetParser.EOL);
    } else {
        return this.getToken(InstructionSetParser.EOL, i);
    }
};


DocumentContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterDocument(this);
	}
};

DocumentContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitDocument(this);
	}
};

DocumentContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitDocument(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.DocumentContext = DocumentContext;

InstructionSetParser.prototype.document = function() {

    var localctx = new DocumentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, InstructionSetParser.RULE_document);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 33;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 30;
                this.match(InstructionSetParser.EOL); 
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
        while(_la===InstructionSetParser.EOL) {
            this.state = 37;
            this.match(InstructionSetParser.EOL);
            this.state = 42;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 43;
        this.match(InstructionSetParser.EOF);
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
    this.ruleIndex = InstructionSetParser.RULE_instructions;
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
        return this.getTokens(InstructionSetParser.EOL);
    } else {
        return this.getToken(InstructionSetParser.EOL, i);
    }
};


InstructionsContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterInstructions(this);
	}
};

InstructionsContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitInstructions(this);
	}
};

InstructionsContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitInstructions(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.InstructionsContext = InstructionsContext;

InstructionSetParser.prototype.instructions = function() {

    var localctx = new InstructionsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, InstructionSetParser.RULE_instructions);
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
                this.match(InstructionSetParser.EOL);
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
    this.ruleIndex = InstructionSetParser.RULE_step;
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
    if(listener instanceof InstructionSetListener ) {
        listener.enterStep(this);
	}
};

StepContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitStep(this);
	}
};

StepContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitStep(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.StepContext = StepContext;

InstructionSetParser.prototype.step = function() {

    var localctx = new StepContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, InstructionSetParser.RULE_step);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 54;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===InstructionSetParser.LABEL || _la===InstructionSetParser.EOL) {
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
    this.ruleIndex = InstructionSetParser.RULE_label;
    return this;
}

LabelContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LabelContext.prototype.constructor = LabelContext;

LabelContext.prototype.LABEL = function() {
    return this.getToken(InstructionSetParser.LABEL, 0);
};

LabelContext.prototype.EOL = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(InstructionSetParser.EOL);
    } else {
        return this.getToken(InstructionSetParser.EOL, i);
    }
};


LabelContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterLabel(this);
	}
};

LabelContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitLabel(this);
	}
};

LabelContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitLabel(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.LabelContext = LabelContext;

InstructionSetParser.prototype.label = function() {

    var localctx = new LabelContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, InstructionSetParser.RULE_label);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 59;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===InstructionSetParser.EOL) {
            this.state = 58;
            this.match(InstructionSetParser.EOL);
        }

        this.state = 61;
        this.match(InstructionSetParser.LABEL);
        this.state = 62;
        this.match(InstructionSetParser.T__0);
        this.state = 63;
        this.match(InstructionSetParser.EOL);
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
    this.ruleIndex = InstructionSetParser.RULE_variable;
    return this;
}

VariableContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VariableContext.prototype.constructor = VariableContext;

VariableContext.prototype.SYMBOL = function() {
    return this.getToken(InstructionSetParser.SYMBOL, 0);
};

VariableContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterVariable(this);
	}
};

VariableContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitVariable(this);
	}
};

VariableContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitVariable(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.VariableContext = VariableContext;

InstructionSetParser.prototype.variable = function() {

    var localctx = new VariableContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, InstructionSetParser.RULE_variable);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 65;
        this.match(InstructionSetParser.SYMBOL);
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
    this.ruleIndex = InstructionSetParser.RULE_instruction;
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
    if(listener instanceof InstructionSetListener ) {
        listener.enterInstruction(this);
	}
};

InstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitInstruction(this);
	}
};

InstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.InstructionContext = InstructionContext;

InstructionSetParser.prototype.instruction = function() {

    var localctx = new InstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, InstructionSetParser.RULE_instruction);
    try {
        this.state = 76;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case InstructionSetParser.T__1:
            this.enterOuterAlt(localctx, 1);
            this.state = 67;
            this.skipInstruction();
            break;
        case InstructionSetParser.T__2:
            this.enterOuterAlt(localctx, 2);
            this.state = 68;
            this.jumpInstruction();
            break;
        case InstructionSetParser.T__8:
            this.enterOuterAlt(localctx, 3);
            this.state = 69;
            this.pushInstruction();
            break;
        case InstructionSetParser.T__13:
            this.enterOuterAlt(localctx, 4);
            this.state = 70;
            this.popInstruction();
            break;
        case InstructionSetParser.T__15:
            this.enterOuterAlt(localctx, 5);
            this.state = 71;
            this.loadInstruction();
            break;
        case InstructionSetParser.T__20:
            this.enterOuterAlt(localctx, 6);
            this.state = 72;
            this.storeInstruction();
            break;
        case InstructionSetParser.T__21:
            this.enterOuterAlt(localctx, 7);
            this.state = 73;
            this.invokeInstruction();
            break;
        case InstructionSetParser.T__25:
            this.enterOuterAlt(localctx, 8);
            this.state = 74;
            this.sendInstruction();
            break;
        case InstructionSetParser.T__26:
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
    this.ruleIndex = InstructionSetParser.RULE_skipInstruction;
    return this;
}

SkipInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SkipInstructionContext.prototype.constructor = SkipInstructionContext;


SkipInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterSkipInstruction(this);
	}
};

SkipInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitSkipInstruction(this);
	}
};

SkipInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitSkipInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.SkipInstructionContext = SkipInstructionContext;

InstructionSetParser.prototype.skipInstruction = function() {

    var localctx = new SkipInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, InstructionSetParser.RULE_skipInstruction);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 78;
        this.match(InstructionSetParser.T__1);
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
    this.ruleIndex = InstructionSetParser.RULE_jumpInstruction;
    return this;
}

JumpInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
JumpInstructionContext.prototype.constructor = JumpInstructionContext;

JumpInstructionContext.prototype.LABEL = function() {
    return this.getToken(InstructionSetParser.LABEL, 0);
};

JumpInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterJumpInstruction(this);
	}
};

JumpInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitJumpInstruction(this);
	}
};

JumpInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitJumpInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.JumpInstructionContext = JumpInstructionContext;

InstructionSetParser.prototype.jumpInstruction = function() {

    var localctx = new JumpInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, InstructionSetParser.RULE_jumpInstruction);
    try {
        this.state = 98;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 80;
            this.match(InstructionSetParser.T__2);
            this.state = 81;
            this.match(InstructionSetParser.T__3);
            this.state = 82;
            this.match(InstructionSetParser.LABEL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 83;
            this.match(InstructionSetParser.T__2);
            this.state = 84;
            this.match(InstructionSetParser.T__3);
            this.state = 85;
            this.match(InstructionSetParser.LABEL);
            this.state = 86;
            this.match(InstructionSetParser.T__4);
            this.state = 87;
            this.match(InstructionSetParser.T__5);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 88;
            this.match(InstructionSetParser.T__2);
            this.state = 89;
            this.match(InstructionSetParser.T__3);
            this.state = 90;
            this.match(InstructionSetParser.LABEL);
            this.state = 91;
            this.match(InstructionSetParser.T__4);
            this.state = 92;
            this.match(InstructionSetParser.T__6);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 93;
            this.match(InstructionSetParser.T__2);
            this.state = 94;
            this.match(InstructionSetParser.T__3);
            this.state = 95;
            this.match(InstructionSetParser.LABEL);
            this.state = 96;
            this.match(InstructionSetParser.T__4);
            this.state = 97;
            this.match(InstructionSetParser.T__7);
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
    this.ruleIndex = InstructionSetParser.RULE_pushInstruction;
    return this;
}

PushInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PushInstructionContext.prototype.constructor = PushInstructionContext;

PushInstructionContext.prototype.LABEL = function() {
    return this.getToken(InstructionSetParser.LABEL, 0);
};

PushInstructionContext.prototype.LITERAL = function() {
    return this.getToken(InstructionSetParser.LITERAL, 0);
};

PushInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(InstructionSetParser.SYMBOL, 0);
};

PushInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterPushInstruction(this);
	}
};

PushInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitPushInstruction(this);
	}
};

PushInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitPushInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.PushInstructionContext = PushInstructionContext;

InstructionSetParser.prototype.pushInstruction = function() {

    var localctx = new PushInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, InstructionSetParser.RULE_pushInstruction);
    try {
        this.state = 112;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 100;
            this.match(InstructionSetParser.T__8);
            this.state = 101;
            this.match(InstructionSetParser.T__9);
            this.state = 102;
            this.match(InstructionSetParser.LABEL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 103;
            this.match(InstructionSetParser.T__8);
            this.state = 104;
            this.match(InstructionSetParser.T__10);
            this.state = 105;
            this.match(InstructionSetParser.LITERAL);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 106;
            this.match(InstructionSetParser.T__8);
            this.state = 107;
            this.match(InstructionSetParser.T__11);
            this.state = 108;
            this.match(InstructionSetParser.SYMBOL);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 109;
            this.match(InstructionSetParser.T__8);
            this.state = 110;
            this.match(InstructionSetParser.T__12);
            this.state = 111;
            this.match(InstructionSetParser.SYMBOL);
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
    this.ruleIndex = InstructionSetParser.RULE_popInstruction;
    return this;
}

PopInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PopInstructionContext.prototype.constructor = PopInstructionContext;


PopInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterPopInstruction(this);
	}
};

PopInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitPopInstruction(this);
	}
};

PopInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitPopInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.PopInstructionContext = PopInstructionContext;

InstructionSetParser.prototype.popInstruction = function() {

    var localctx = new PopInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, InstructionSetParser.RULE_popInstruction);
    try {
        this.state = 118;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,8,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 114;
            this.match(InstructionSetParser.T__13);
            this.state = 115;
            this.match(InstructionSetParser.T__9);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 116;
            this.match(InstructionSetParser.T__13);
            this.state = 117;
            this.match(InstructionSetParser.T__14);
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
    this.ruleIndex = InstructionSetParser.RULE_loadInstruction;
    return this;
}

LoadInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LoadInstructionContext.prototype.constructor = LoadInstructionContext;

LoadInstructionContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};

LoadInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterLoadInstruction(this);
	}
};

LoadInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitLoadInstruction(this);
	}
};

LoadInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitLoadInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.LoadInstructionContext = LoadInstructionContext;

InstructionSetParser.prototype.loadInstruction = function() {

    var localctx = new LoadInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, InstructionSetParser.RULE_loadInstruction);
    try {
        this.state = 132;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 120;
            this.match(InstructionSetParser.T__15);
            this.state = 121;
            this.match(InstructionSetParser.T__16);
            this.state = 122;
            this.variable();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 123;
            this.match(InstructionSetParser.T__15);
            this.state = 124;
            this.match(InstructionSetParser.T__17);
            this.state = 125;
            this.variable();
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 126;
            this.match(InstructionSetParser.T__15);
            this.state = 127;
            this.match(InstructionSetParser.T__18);
            this.state = 128;
            this.variable();
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 129;
            this.match(InstructionSetParser.T__15);
            this.state = 130;
            this.match(InstructionSetParser.T__19);
            this.state = 131;
            this.variable();
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
    this.ruleIndex = InstructionSetParser.RULE_storeInstruction;
    return this;
}

StoreInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StoreInstructionContext.prototype.constructor = StoreInstructionContext;

StoreInstructionContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};

StoreInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterStoreInstruction(this);
	}
};

StoreInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitStoreInstruction(this);
	}
};

StoreInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitStoreInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.StoreInstructionContext = StoreInstructionContext;

InstructionSetParser.prototype.storeInstruction = function() {

    var localctx = new StoreInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, InstructionSetParser.RULE_storeInstruction);
    try {
        this.state = 146;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 134;
            this.match(InstructionSetParser.T__20);
            this.state = 135;
            this.match(InstructionSetParser.T__16);
            this.state = 136;
            this.variable();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 137;
            this.match(InstructionSetParser.T__20);
            this.state = 138;
            this.match(InstructionSetParser.T__17);
            this.state = 139;
            this.variable();
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 140;
            this.match(InstructionSetParser.T__20);
            this.state = 141;
            this.match(InstructionSetParser.T__18);
            this.state = 142;
            this.variable();
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 143;
            this.match(InstructionSetParser.T__20);
            this.state = 144;
            this.match(InstructionSetParser.T__19);
            this.state = 145;
            this.variable();
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
    this.ruleIndex = InstructionSetParser.RULE_invokeInstruction;
    return this;
}

InvokeInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InvokeInstructionContext.prototype.constructor = InvokeInstructionContext;

InvokeInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(InstructionSetParser.SYMBOL, 0);
};

InvokeInstructionContext.prototype.NUMBER = function() {
    return this.getToken(InstructionSetParser.NUMBER, 0);
};

InvokeInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterInvokeInstruction(this);
	}
};

InvokeInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitInvokeInstruction(this);
	}
};

InvokeInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitInvokeInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.InvokeInstructionContext = InvokeInstructionContext;

InstructionSetParser.prototype.invokeInstruction = function() {

    var localctx = new InvokeInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, InstructionSetParser.RULE_invokeInstruction);
    try {
        this.state = 160;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 148;
            this.match(InstructionSetParser.T__21);
            this.state = 149;
            this.match(InstructionSetParser.SYMBOL);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 150;
            this.match(InstructionSetParser.T__21);
            this.state = 151;
            this.match(InstructionSetParser.SYMBOL);
            this.state = 152;
            this.match(InstructionSetParser.T__22);
            this.state = 153;
            this.match(InstructionSetParser.T__23);
            this.state = 154;
            this.match(InstructionSetParser.T__12);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 155;
            this.match(InstructionSetParser.T__21);
            this.state = 156;
            this.match(InstructionSetParser.SYMBOL);
            this.state = 157;
            this.match(InstructionSetParser.T__22);
            this.state = 158;
            this.match(InstructionSetParser.NUMBER);
            this.state = 159;
            this.match(InstructionSetParser.T__24);
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

function SendInstructionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = InstructionSetParser.RULE_sendInstruction;
    return this;
}

SendInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SendInstructionContext.prototype.constructor = SendInstructionContext;

SendInstructionContext.prototype.SYMBOL = function() {
    return this.getToken(InstructionSetParser.SYMBOL, 0);
};

SendInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterSendInstruction(this);
	}
};

SendInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitSendInstruction(this);
	}
};

SendInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitSendInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.SendInstructionContext = SendInstructionContext;

InstructionSetParser.prototype.sendInstruction = function() {

    var localctx = new SendInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, InstructionSetParser.RULE_sendInstruction);
    try {
        this.state = 182;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 162;
            this.match(InstructionSetParser.T__25);
            this.state = 163;
            this.match(InstructionSetParser.SYMBOL);
            this.state = 164;
            this.match(InstructionSetParser.T__3);
            this.state = 165;
            this.match(InstructionSetParser.T__14);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 166;
            this.match(InstructionSetParser.T__25);
            this.state = 167;
            this.match(InstructionSetParser.SYMBOL);
            this.state = 168;
            this.match(InstructionSetParser.T__3);
            this.state = 169;
            this.match(InstructionSetParser.T__14);
            this.state = 170;
            this.match(InstructionSetParser.T__22);
            this.state = 171;
            this.match(InstructionSetParser.T__24);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 172;
            this.match(InstructionSetParser.T__25);
            this.state = 173;
            this.match(InstructionSetParser.SYMBOL);
            this.state = 174;
            this.match(InstructionSetParser.T__3);
            this.state = 175;
            this.match(InstructionSetParser.T__19);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 176;
            this.match(InstructionSetParser.T__25);
            this.state = 177;
            this.match(InstructionSetParser.SYMBOL);
            this.state = 178;
            this.match(InstructionSetParser.T__3);
            this.state = 179;
            this.match(InstructionSetParser.T__19);
            this.state = 180;
            this.match(InstructionSetParser.T__22);
            this.state = 181;
            this.match(InstructionSetParser.T__24);
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
    this.ruleIndex = InstructionSetParser.RULE_handleInstruction;
    return this;
}

HandleInstructionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
HandleInstructionContext.prototype.constructor = HandleInstructionContext;


HandleInstructionContext.prototype.enterRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.enterHandleInstruction(this);
	}
};

HandleInstructionContext.prototype.exitRule = function(listener) {
    if(listener instanceof InstructionSetListener ) {
        listener.exitHandleInstruction(this);
	}
};

HandleInstructionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof InstructionSetVisitor ) {
        return visitor.visitHandleInstruction(this);
    } else {
        return visitor.visitChildren(this);
    }
};




InstructionSetParser.HandleInstructionContext = HandleInstructionContext;

InstructionSetParser.prototype.handleInstruction = function() {

    var localctx = new HandleInstructionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, InstructionSetParser.RULE_handleInstruction);
    try {
        this.state = 188;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,13,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 184;
            this.match(InstructionSetParser.T__26);
            this.state = 185;
            this.match(InstructionSetParser.T__27);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 186;
            this.match(InstructionSetParser.T__26);
            this.state = 187;
            this.match(InstructionSetParser.T__28);
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


exports.InstructionSetParser = InstructionSetParser;
