grammar Instructions;
import Tokens;

instructions: step (EOL step)*;

step: label? instruction;

label: EOL? LABEL ':' EOL;

variable: SYMBOL;

instruction:
    skipInstruction |
    jumpInstruction |
    pushInstruction |
    popInstruction |
    loadInstruction |
    storeInstruction |
    invokeInstruction |
    sendInstruction |
    handleInstruction
;

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

// Pop the component or handler address that is currently on top of it
// stack off of it.
popInstruction:
    'POP' (
        'HANDLER' |
        'COMPONENT'
    )
;

// Load the value from a variable, message queue, draft or document onto
// the top of the component stack.
loadInstruction:
    'LOAD' (
        'VARIABLE' |
        'MESSAGE' |
        'DRAFT' |
        'DOCUMENT'
    ) variable
;

// Store the value that is on the top of the component stack into the
// local variable, message queue, draft or document.
storeInstruction:
    'STORE' (
        'VARIABLE' |
        'MESSAGE' |
        'DRAFT' |
        'DOCUMENT'
    ) variable
;

// Invoke the specified intrinsic function using the [0..3] arguments that
// are on the component stack. The resulting value of the invocation
// replaces the arguments that were on the top of the component stack.
invokeInstruction:
    'INVOKE' SYMBOL (
        'WITH' (
            '1' 'ARGUMENT' |
            NUMBER 'ARGUMENTS'
        )
    )?
;

// Send a message with an optional list of arguments to the component or
// committed document name that is on top of the component stack. If the
// recipient is a named document, a new procedure context containing the
// message, arguments, and document name is placed on a queue to be executed
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

// Pop the result that is currently on top of the component stack off
// and return it to the calling procedure as the result.  Or, pop the
// handler address that is currently on top of the handler stack off
// and transfer control to the first exception handler at that address.
handleInstruction:
    'HANDLE' (
        'EXCEPTION' |
        'RESULT'
    )
;

