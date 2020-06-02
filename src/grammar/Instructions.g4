grammar Instructions;
import Tokens;

instructions: (step EOL)*;

step: label? instruction;

label: EOL LABEL ':' EOL;

instruction:
    comment |
    skipInstruction |
    jumpInstruction |
    pushInstruction |
    pullInstruction |
    loadInstruction |
    saveInstruction |
    dropInstruction |
    callInstruction |
    sendInstruction
;

comment: COMMENT;

// Skip this instruction and continue with the next instruction.
skipInstruction: 'SKIP' 'INSTRUCTION';

// Jump to the address at the label if the value on the component stack
// matches the condition. Otherwise, continue execution at the next
// instruction. If there is no condition then jump unconditionally.
jumpInstruction:
    'JUMP' 'TO' LABEL (
        'ON' (
            'NONE' |
            'TRUE' |
            'FALSE'
        )
    )?
;

// Push a literal component, constant or parameter onto the component stack,
// or push the handler address for the current exception handlers onto the
// handler stack.
pushInstruction:
    'PUSH' (
        'HANDLER' LABEL |
        'LITERAL' LITERAL |
        'CONSTANT' SYMBOL |
        'ARGUMENT' SYMBOL
    )
;

// Pull whatever is currently on top of the handler or component stack off
// and either discard it or use it accordingly.
pullInstruction:
    'PULL' (
        'HANDLER' |
        'COMPONENT' |
        'RESULT' |
        'EXCEPTION'
    )
;

// Load onto the component stack a register value, document, contract or random message from a bag
loadInstruction:
    'LOAD' (
        'REGISTER' |
        'DOCUMENT' |
        'CONTRACT' |
        'MESSAGE'
    ) SYMBOL
;

// Save the top of the component stack to a register value, document, contract or message bag
saveInstruction:
    'SAVE' (
        'REGISTER' |
        'DOCUMENT' |
        'CONTRACT' |
        'MESSAGE'
    ) SYMBOL
;

// Drop a register value, document, contract or message
dropInstruction:
    'DROP' (
        'REGISTER' |
        'DOCUMENT' |
        'CONTRACT' |
        'MESSAGE'
    ) SYMBOL
;

// Call the specified intrinsic function using the [0..3] arguments that
// are on the component stack. The resulting value of the invocation
// replaces the arguments that were on the top of the component stack.
callInstruction:
    'CALL' SYMBOL ( 'WITH' ( '1' 'ARGUMENT' | NUMBER 'ARGUMENTS'))?;

// Send a message with an optional list of arguments to the local component or
// committed contract whose name is on top of the component stack. If the
// recipient is a named contract, a new procedure context containing the
// message, arguments, and contract name is placed in a bag to be executed
// by the next available processor. Otherwise, the current processor loads the
// bytecode for the procedure associated with the message defined in the
// component's type definition into a new procedure context and begins
// executing it using the target component and array of arguments.  When the
// new procedure context completes its execution, the resulting value replaces
// the component and array of arguments that were on the top of the component
// stack.
sendInstruction:
    'SEND' SYMBOL 'TO' ('COMPONENT' | 'DOCUMENT') ('WITH' 'ARGUMENTS')?;
