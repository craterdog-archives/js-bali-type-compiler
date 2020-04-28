grammar Tokens;

/* TOKEN RULES
 It's important to remember that tokens are recognized by the
 lexer in the order declared. The longest first matching token
 is returned regardless of how many others might match. Also,
 prefix any tokens that are just used as subtokens with the
 "fragment" keyword.
*/

LABEL: (NUMBER '.')+ IDENTIFIER;

NUMBER: '1'..'9' ('0'..'9')*;

LITERAL: '`' ('\\`' | CHARACTER)*? '`';

SYMBOL: '$' IDENTIFIER ('-' NUMBER)?;

EOL: '\r'? '\n';

// remove white space
SPACE: ('\t'..'\r' | ' ') -> channel(HIDDEN);

fragment
IDENTIFIER: ('a'..'z'|'A'..'Z') ('a'..'z'|'A'..'Z'|'0'..'9')*;

fragment
CHARACTER: .;

