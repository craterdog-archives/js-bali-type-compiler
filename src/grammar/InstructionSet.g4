grammar InstructionSet;

document: EOL* instructions EOL* EOF;

instructions: step (EOL step)*;

step: label? instruction;

label: EOL? LABEL ':' EOL;

variable: SYMBOL | RESERVED;

instruction:
    skipInstruction |
    jumpInstruction |
    pushInstruction |
    popInstruction |
    loadInstruction |
    storeInstruction |
    invokeInstruction |
    executeInstruction |
    handleInstruction
;

// Skip this instruction and continue with the next instruction.
skipInstruction: 'SKIP INSTRUCTION';

// Jump to the address at the label if the value on the component stack
// matches the condition. Otherwise, continue execution at the next
// instruction. If there is no condition then jump unconditionally.
jumpInstruction:
    'JUMP' 'TO' LABEL |
    'JUMP' 'TO' LABEL 'ON' 'NONE' |
    'JUMP' 'TO' LABEL 'ON' 'TRUE' |
    'JUMP' 'TO' LABEL 'ON' 'FALSE'
;

// Push a literal component, contant or parameter onto the component stack,
// or push the handler address for the current exception handlers onto the
// handler stack.
pushInstruction:
    'PUSH' 'HANDLER' LABEL |
    'PUSH' 'LITERAL' LITERAL |
    'PUSH' 'CONSTANT' SYMBOL |
    'PUSH' 'PARAMETER' SYMBOL
;

// Pop the component or handler address that is currently on top of it
// stack off of it.
popInstruction:
    'POP' 'HANDLER' |
    'POP' 'COMPONENT'
;

// Load the value from a variable, message queue, draft or document onto
// the top of the component stack.
loadInstruction:
    'LOAD' 'VARIABLE' variable |
    'LOAD' 'MESSAGE' variable |
    'LOAD' 'DRAFT' variable |
    'LOAD' 'DOCUMENT' variable
;

// Store the value that is on the top of the component stack into the
// local variable, message queue, draft or document.
storeInstruction:
    'STORE' 'VARIABLE' variable |
    'STORE' 'MESSAGE' variable |
    'STORE' 'DRAFT' variable |
    'STORE' 'DOCUMENT' variable
;

// Invoke the specified intrinsic function using the [0..3] parameters that
// are on the component stack. The resulting value of the invocation
// replaces the parameters that were on the top of the component stack.
invokeInstruction:
    'INVOKE' SYMBOL |
    'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
    'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
;

// Load the bytecode for the specified procedure into a new component context
// and begin executing it with the target component and array of parameters
// that are on the top of the component stack. When the new component context
// completes its execution, the resulting value replaces the target component
// and array of parameters that were on the top of the component stack.
executeInstruction:
    'EXECUTE' SYMBOL |
    'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
    'EXECUTE' SYMBOL 'ON' 'TARGET' |
    'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
;

// Pop the result that is currently on top of the component stack off
// and return it to the calling procedure as the result.  Or, pop the
// handler address that is currently on top of the handler stack off
// and transfer control to the first exception handler at that address.
handleInstruction:
    'HANDLE' 'EXCEPTION' |
    'HANDLE' 'RESULT'
;


// Tokens

LABEL: (NUMBER '.')+ IDENTIFIER;

NUMBER: '1'..'9' ('0'..'9')*;

LITERAL: '`' (ESCAPE | CHARACTER)*? '`';

SYMBOL: '$' IDENTIFIER;

RESERVED: '$$' IDENTIFIER ('-' NUMBER)?;

EOL: '\r'? '\n';

SPACE: ('\t'..'\r' | ' ') -> channel(HIDDEN);

fragment
IDENTIFIER: ('a'..'z'|'A'..'Z') ('a'..'z'|'A'..'Z'|'0'..'9')*;

fragment
CHARACTER: .;

fragment
BASE16: '0'..'9' | 'A'..'F';

// replace with actual characters when read
fragment
ESCAPE: '\\' ('u' BASE16+ | 'b' | 'f' | 'r' | 'n' | 't' | '`' | '\\');
