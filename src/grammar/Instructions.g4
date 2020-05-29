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

// Load the value from a local variable, message bag, draft or document onto
// the top of the component stack.
loadInstruction:
    'LOAD' (
        'VARIABLE' |
        'DRAFT' |
        'DOCUMENT' |
        'MESSAGE'
    ) SYMBOL
;

// Save the value that is on the top of the component stack in the
// local variable, message bag, draft or document.
saveInstruction:
    'SAVE' (
        'VARIABLE' |
        'DRAFT' |
        'DOCUMENT' |
        'MESSAGE'
    ) SYMBOL
;

// Drop the value that is currently associated with the local variable,
// message bag, draft or document.
dropInstruction:
    'DROP' (
        'VARIABLE' |
        'DRAFT' |
        'DOCUMENT' |
        'MESSAGE'
    ) SYMBOL
;

// Call the specified intrinsic function using the [0..3] arguments that
// are on the component stack. The resulting value of the invocation
// replaces the arguments that were on the top of the component stack.
callInstruction:
    'CALL' SYMBOL (
        'WITH' (
            '1' 'ARGUMENT' |
            NUMBER 'ARGUMENTS'
        )
    )?
;

// Send a message with an optional list of arguments to the component or
// committed document name that is on top of the component stack. If the
// recipient is a named document, a new procedure context containing the
// message, arguments, and document name is placed in a bag to be executed
// by the next available processor. Otherwise, the current processor loads the
// bytecode for the procedure associated with the message defined in the
// component's type definition into a new procedure context and begins
// executing it using the target component and array of arguments.  When the
// new procedure context completes its execution, the resulting value replaces
// the component and array of arguments that were on the top of the component
// stack.
sendInstruction:
    'SEND' SYMBOL 'TO' (
        'COMPONENT' ('WITH' 'ARGUMENTS')? |
        'DOCUMENT' ('WITH' 'ARGUMENTS')?
    )
;