/**
 * DEOBFUSCATED VERSION OF p.js
 *
 * This file is a heavily annotated version of the original obfuscated code.
 *
 * OBFUSCATION METHOD: JavaScript Virtual Machine (Bytecode Virtualization)
 *
 * The original JavaScript code has been compiled into a custom bytecode format
 * and is executed by a virtual machine implemented in JavaScript itself.
 *
 * This is one of the most advanced obfuscation techniques available.
 */

"use strict";

(function() {
    var encodedBytecodeString; // Will hold the massive 198KB encoded string

    /**
     * DECODER FUNCTION - Base-N decoding algorithm
     *
     * Converts the encoded string into an array of numbers (bytecode)
     *
     * @param {string} encodedData - The encoded bytecode string
     * @param {string} alphabet - Custom alphabet for base-N encoding
     * @param {number} base - The base of the encoding (43 in this case)
     * @returns {number[]} Decoded array of numbers (the bytecode)
     */
    var decodeBase43 = function(encodedData, alphabet, base) {
        for (var alphabetLength = alphabet.length,
                 radix = alphabetLength - base,
                 result = [],
                 inputIndex = 0;
             inputIndex < encodedData.length;) {

            for (var value = 0, multiplier = 1;;) {
                var charIndex = alphabet.indexOf(encodedData[inputIndex++]);

                if (value += multiplier * (charIndex % base), charIndex < base) {
                    result.push(value | 0);
                    break;
                }

                value += base * multiplier;
                multiplier *= radix;
            }
        }
        return result;
    };

    // NOTE: Line 16 in original file contains a 198,916 character encoded string!
    // It looks like: var h = "cNhDМOFwvhTf2jB|51S1v1RNh..."
    // This has been extracted to bytecode.json for analysis

    /**
     * BYTECODE ARRAY - The heart of the obfuscation
     *
     * This array contains 98,340 numeric values representing:
     * - Opcode indices (which operation to execute)
     * - Encoded constants (strings, numbers, booleans)
     * - Variable references
     * - Jump targets
     * - Function call arguments
     *
     * The decoder function above converts the compressed string into this array.
     */
    var bytecodeArray = decodeBase43(
        encodedBytecodeString,  // The massive encoded string from line 16
        "OhМufJ5StvER1M~QCXWryDKi^dHqgGx0c9<k6a2I>$meP3onTB=LwlZj+Ns|VY4AbU78zpF",  // Custom alphabet
        43  // Base-43 encoding
    );

    console.log(bytecodeArray); // Debug output

    /**
     * HELPER FUNCTION - Get variable from context
     */
    function getVariable(context) {
        return context.d[1];
    }

    // Anti-tampering mechanism: random string generation
    var randomString = "";
    var antiTamperValue = bytecodeArray.length + (randomString + true).length;
    var stringStorage = { R: "" };

    // Generate 28-character random string (anti-debugging)
    for (var i = 0; i < 28; i++) {
        randomString += String.fromCharCode(97 + Math.floor(26 * Math.random()));
    }
    console.log(randomString);

    // Store references to global objects
    var globalWindow = window;
    var globalPromise = globalWindow.Promise;

    /**
     * READ BYTECODE FUNCTION - Reads and decodes a number from bytecode
     *
     * Shifts the value right by 5 bits to get the actual value
     */
    function readBytecodeShifted(context) {
        return bytecodeArray[context.d[0]++] >> 5;
    }

    /**
     * CREATE EXECUTION CONTEXT
     *
     * Creates a new execution context (similar to a stack frame)
     * Each context contains:
     * - Instruction pointer (d[0])
     * - Environment record (d[1]) with locals, globals, etc.
     */
    function createContext() {
        var contextData = [1, {
            Z: globalWindow,    // Global object (window)
            o: null,            // Current 'this' context
            v: [],              // Local variable storage
            d: [0],             // Instruction pointer array
            m: void 0           // Module/import storage
        }, void 0];

        return {
            d: contextData,     // Context data
            B: void 0           // Exception storage
        };
    }

    /**
     * EXCEPTION PROPAGATION
     *
     * Walks up the call stack to find an exception handler
     */
    function propagateException(context, exception) {
        while (true) {
            var parentContext = context.d[1];
            if (!parentContext) {
                throw exception;  // No handler found, re-throw
            }
            if (parentContext.L) {
                // Exception handler found
                context.B = { r: exception };
                context.d[0] = parentContext.L;
                return;
            }
            context.d = parentContext.d;
        }
    }

    var undefinedValue;
    var initialContext = createContext();

    /**
     * WRITE TO CONTEXT
     *
     * Writes a value to a variable slot in the current context
     */
    function writeToContext(context, value) {
        context.d[readBytecodeShifted(context)] = value;
    }

    /**
     * CONSTANT VALUE DECODER
     *
     * Decodes different types of constants embedded in the bytecode:
     * - Small integers (odd numbers)
     * - IEEE 754 floats
     * - Strings (XOR-encoded)
     * - Booleans (true/false)
     * - null
     * - Variable references
     */
    var decodeConstant = function(bytecode, instructionPointer, constantTypeMarkers, stringDecoder) {
        var value = bytecode[instructionPointer[0]++];

        // Small integer (least significant bit is 1)
        if (value & 1) return value >> 1;

        // IEEE 754 double-precision float (marker = 46)
        if (value === constantTypeMarkers[3]) {
            var high = bytecode[instructionPointer[0]++],
                low = bytecode[instructionPointer[0]++],
                sign = high & 2147483648 ? -1 : 1,
                exponent = (high & 2146435072) >> 20,
                mantissa = (high & 1048575) * Math.pow(2, 32) + (low < 0 ? low + Math.pow(2, 32) : low);
            return exponent === 2047 ? mantissa ? NaN : sign * (1 / 0) :
                   (exponent !== 0 ? mantissa += Math.pow(2, 52) : exponent++,
                    sign * mantissa * Math.pow(2, exponent - 1075));
        }

        // Boolean true (marker = 22)
        if (value === constantTypeMarkers[0]) return true;

        // String (marker = 2)
        if (value === constantTypeMarkers[5]) {
            if (stringDecoder != null && stringDecoder.z)
                return stringDecoder.z(bytecode[instructionPointer[0]++], bytecode[instructionPointer[0]++]);

            var str = "",
                length = bytecode[instructionPointer[0]++];

            for (var i = 0; i < length; i++) {
                var charCode = bytecode[instructionPointer[0]++];
                // XOR decoding for characters
                str += String.fromCharCode(charCode & 4294967232 | charCode * 41 & 63);
            }
            console.log(str);
            return str;
        }

        // null (marker = 36)
        if (value === constantTypeMarkers[1]) return null;

        // Boolean false (marker = 38)
        if (value === constantTypeMarkers[4]) return false;

        // Variable reference (shift right by 5 to get index)
        if (value !== constantTypeMarkers[2]) return instructionPointer[value >> 5];
    };

    /**
     * CONSTANT TYPE MARKERS
     *
     * Special bytecode values that indicate the type of the following constant:
     * [0] = 22  -> true
     * [1] = 36  -> null
     * [2] = 50  -> (special marker)
     * [3] = 46  -> IEEE 754 float
     * [4] = 38  -> false
     * [5] = 2   -> String
     */
    var constantTypeMarkers = [22, 36, 50, 46, 38, 2];

    // Inline string decoder initialization
    {
        stringStorage.z = function(length, offset) {
            return stringStorage.R.slice(offset, offset + length);
        };

        var extractOffset = bytecodeArray[bytecodeArray.length + randomString.indexOf(".")] ^ antiTamperValue;
        var extractedData = bytecodeArray.splice(extractOffset, bytecodeArray[extractOffset + initialContext.d[0]] + 2);
        stringStorage.R = decodeConstant(extractedData, initialContext.d[1].d, constantTypeMarkers);
    }

    /**
     * READ CONSTANT FROM BYTECODE
     *
     * Wrapper function to decode a constant value
     */
    function readConstant(context) {
        return decodeConstant(bytecodeArray, context.d, constantTypeMarkers, stringStorage);
    }

    /**
     * EXCEPTION CATCH HANDLER
     *
     * Sets up exception handling for a context
     */
    function setupExceptionHandler(context, exceptionValue) {
        var parentContext = getVariable(context);
        parentContext.P = { r: exceptionValue };

        if (parentContext.j) {
            context.d[0] = parentContext.j;
        } else {
            context.d = parentContext.d;
            context.d[2] = exceptionValue;
        }
    }

    /**
     * OPCODE HANDLERS ARRAY
     *
     * This is a Proxy array containing ~86 handler functions.
     * Each function implements a specific JavaScript operation.
     *
     * The bytecode contains indices into this array to specify which operation to execute.
     *
     * Handler parameters:
     * - n: Current execution context
     * - e: readConstant function
     * - a: writeToContext function
     * - v: getVariable function
     * - i: Global objects array [window, [Promise, undefined], bytecodeArray, opcodeHandlers]
     * - r: Utility functions array [setupExceptionHandler, propagateException, createContext, executeVM, randomString, readVariableReference]
     *
     * Examples of operations:
     * - Handler 0: Strict equality (===)
     * - Handler 1: instanceof
     * - Handler 2: Multiplication (*)
     * - Handler 3: Equality (==)
     * - And ~83 more operations...
     */
    opcodeHandlers = new Proxy([
        // Handler 0: Strict equality (===)
        function(n, e, a, v, i, r) {
            var o = r[5];
            a(n, o(n) === o(n));
        },

        // Handler 1: instanceof
        function(n, e, a, v, i, r) {
            var o = r[5];
            a(n, o(n) instanceof o(n));
        },

        // Handler 2: Multiplication (*)
        function(n, e, a, v, i, r) {
            var o = r[5];
            a(n, o(n) * o(n));
        },

        // Handler 3: Equality (==)
        function(n, e, a, v, i, r) {
            var o = r[5];
            a(n, e(n) == o(n));
        },

        // ... ~82 more handlers (see original p.js lines 128-459)
        // Due to space constraints, showing structure rather than all handlers

    ], {
        // Proxy handler for the opcode array
        // This could be used for additional anti-debugging measures
    });

    /**
     * READ VARIABLE REFERENCE
     *
     * Reads a variable reference from the bytecode
     */
    function readVariableReference(context) {
        return context.d[bytecodeArray[context.d[0]++] >> 5];
    }

    var undefinedVariable = undefined;

    /**
     * VIRTUAL MACHINE MAIN EXECUTION LOOP
     *
     * This is the heart of the bytecode interpreter.
     * It repeatedly fetches opcodes from the bytecode array and executes them.
     *
     * Execution flow:
     * 1. Read opcode index from bytecode at current instruction pointer
     * 2. Fetch opcode handler function from opcodeHandlers array
     * 3. Execute handler with current context and helper functions
     * 4. Handler modifies context (variables, instruction pointer, etc.)
     * 5. If handler returns null, exit (program complete)
     * 6. Otherwise, continue to next instruction
     * 7. If exception occurs, propagate to exception handler
     */
    function executeVM(context) {
        var globalObjects = [globalWindow, [globalPromise, undefinedVariable], bytecodeArray, opcodeHandlers];
        var utilityFunctions = [setupExceptionHandler, propagateException, createContext, executeVM, randomString, readVariableReference];

        while (true) {
            var opcodeIndex, handlerFunction;
            var currentHandler = void 0;

            // FETCH: Read next opcode index from bytecode
            currentHandler = opcodeHandlers[bytecodeArray[context.d[0]++]];

            try {
                // EXECUTE: Run the opcode handler
                var result = currentHandler(context, readConstant, writeToContext, getVariable, globalObjects, utilityFunctions);

                // EXIT: If handler returns null, execution is complete
                if (result === null) {
                    break;
                }
            } catch (exception) {
                // EXCEPTION: Propagate exception to handler
                propagateException(context, exception);
            }
        }
    }

    /**
     * PROGRAM ENTRY POINT
     *
     * Start the virtual machine with the initial execution context
     */
    executeVM(initialContext);
})();

/**
 * =============================================================================
 * END OF DEOBFUSCATED CODE
 * =============================================================================
 *
 * SUMMARY:
 *
 * This file implements a complete JavaScript virtual machine that interprets
 * custom bytecode. The original JavaScript program has been:
 *
 * 1. Compiled into a custom bytecode format (98,340 numeric instructions)
 * 2. Compressed using base-43 encoding (resulting in 198KB string)
 * 3. Embedded into this VM implementation
 *
 * To fully understand what the program does, you would need to:
 * - Disassemble the bytecode into readable operations
 * - Reconstruct the control flow (loops, conditionals, function calls)
 * - Decompile back to JavaScript source code
 *
 * This is an extremely advanced obfuscation technique and is rarely seen
 * in legitimate code. It's most commonly used for:
 * - Protecting intellectual property
 * - Anti-tampering mechanisms
 * - License enforcement
 * - (Unfortunately) Hiding malicious code
 *
 * The extracted bytecode has been saved to bytecode.json for further analysis.
 *
 * For more details, see DEOBFUSCATION_ANALYSIS.md
 */
