# Deobfuscation Analysis of p.js

## Summary

The file `p.js` contains a **JavaScript Virtual Machine (VM)** implementation that executes obfuscated bytecode. This is an advanced obfuscation technique that compiles JavaScript code into a custom bytecode format and interprets it at runtime.

## Obfuscation Technique

**Type**: Bytecode Virtualization / VM-based Obfuscation

**Components**:
1. **Decoder Function (`S`)**: Decodes the compressed bytecode string
2. **Bytecode Array (`NumberArray`)**: 98,340 numeric values representing instructions
3. **Virtual Machine (`l`)**: Main execution loop that interprets the bytecode
4. **Opcode Handlers (`N`)**: ~86 functions implementing different operations
5. **Constant Decoder (`A`)**: Decodes embedded constants (strings, numbers, booleans)

## Architecture

### 1. Initialization Phase (Lines 1-16)

```javascript
"use strict";
(function() {
    // Decoder function S(encoded_string, alphabet, base)
    var S = function(v, u, f) { ... };

    // Line 16: MASSIVE encoded string (198,916 characters!)
    var h = "cNhDМOFwvhTf2jB|51S1v1RNh...";

    // Line 17: Decode to get bytecode array
    var NumberArray = S(h, "OhМufJ5StvER1M~QCXWryDKi^dHqgGx0c9<k6a2I>$meP3onTB=LwlZj+Ns|VY4AbU78zpF", 43);
```

**Result**: NumberArray with 98,340 elements

### 2. Virtual Machine Components

#### Execution Context (Lines 40-52)
```javascript
function f() {
    var e = [1, {
        Z: windowvar,      // Global object (window)
        o: null,           // Current object context
        v: [],             // Local variables
        d: [0],            // Instruction pointer
        m: void 0          // Module/imports
    }, void 0];
    return { d: e, B: void 0 };
}
```

#### Bytecode Reading Functions
- **`g(e)`** (Line 36-38): Reads a number from bytecode and shifts it right by 5
- **`b(e)`** (Line 112-114): Decodes a constant value from bytecode
- **`y(e)`** (Line 461-463): Reads a variable reference from bytecode

#### Bytecode Writing Function
- **`w(e, r)`** (Line 73-75): Writes a value to a variable slot

#### Exception Handling
- **`v(e, r)`** (Line 54-69): Propagates exceptions up the call stack
- **`m(e, r)`** (Line 116-127): Catches exceptions and updates instruction pointer

### 3. Constant Decoder (Lines 76-101)

The `A` function decodes different types of constants embedded in the bytecode:

- **Odd numbers** (r & 1): Small integers (shifted right by 1)
- **NuberArrayShort[3]** (value 46): IEEE 754 double-precision floats
- **NuberArrayShort[0]** (value 22): Boolean `true`
- **NuberArrayShort[5]** (value 2): Strings (XOR-encoded characters)
- **NuberArrayShort[1]** (value 36): `null`
- **NuberArrayShort[4]** (value 38): Boolean `false`
- **Other values**: Variable references (shifted right by 5)

### 4. Opcode Handlers (Lines 128-459)

The VM has **~86 opcode handlers** stored in a Proxy array. Each handler implements a JavaScript operation:

**Identified Operations**:
- **Comparison**: `===`, `==`, `<`, `>`, `>=`, `instanceof`, `in`
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`, `**`
- **Bitwise**: `&`, `|`, `^`, `<<`, `>>`
- **Logical**: `!`, `&&`, `||`
- **Object/Array**: Property access, property assignment, array creation, `new` operator
- **Control Flow**: Jump instructions, function calls, exception handling
- **Other**: `typeof`, `delete`, iteration (`for...in`)

Example handlers:
```javascript
// Handler 0: Strict equality (===)
function(n, e, a, v, i, r) {
    var o = r[5];
    a(n, o(n) === o(n))
}

// Handler 1: instanceof
function(n, e, a, v, i, r) {
    var o = r[5];
    a(n, o(n) instanceof o(n))
}

// Handler 2: Multiplication (*)
function(n, e, a, v, i, r) {
    var o = r[5];
    a(n, o(n) * o(n))
}
```

### 5. Main Execution Loop (Lines 466-482)

```javascript
function l(e) {
    var r = [windowvar, [windowpromise, H], NumberArray, N];
    var T = [m, v, f, l, i, y];

    while (true) {
        // Fetch next opcode
        _ = N[NumberArray[e.d[0]++]];

        try {
            // Execute opcode handler
            var o = _(e, b, w, L, r, T);

            // Break if handler returns null
            if (o === null) {
                break;
            }
        } catch (C) {
            v(e, C);  // Handle exceptions
        }
    }
}
```

**Execution Flow**:
1. Read opcode index from NumberArray at current instruction pointer
2. Fetch corresponding handler from opcode array N
3. Execute handler with context
4. Handler updates instruction pointer
5. Repeat until handler returns null (exit instruction)

### 6. Program Entry Point (Line 483)

```javascript
l(d)  // Start VM with initial context
```

## Bytecode Statistics

- **Total Instructions**: 98,340 elements
- **Unique Values**: 5,397
- **Value Range**: -1,868,562,432 to 2,130,706,432
- **Encoded String Size**: 198,916 characters (Line 16)

## Security Analysis

This code demonstrates:
- ✓ Advanced obfuscation through bytecode virtualization
- ✓ No obvious malicious patterns detected in VM structure
- ⚠ Actual behavior depends on the bytecode content (requires full deobfuscation)
- ℹ The VM accesses `window` and `Promise` objects, suggesting browser environment

## Deobfuscation Approach

To fully deobfuscate this code:

1. **✓ Extract bytecode** - Complete (see `bytecode.json`)
2. **⏳ Disassemble bytecode** - Map opcodes to operations
3. **⏳ Reconstruct control flow** - Build execution graph
4. **⏳ Decompile to JavaScript** - Convert bytecode back to readable JS

The current analysis provides:
- VM architecture documentation
- Bytecode extraction
- Opcode handler identification
- Execution flow understanding

## Files Generated

- `bytecode.json` - Extracted bytecode array (98,340 elements)
- `analyze-bytecode.js` - Bytecode extraction script
- `DEOBFUSCATION_ANALYSIS.md` - This document
- `p-deobfuscated.js` - Annotated version (next step)
