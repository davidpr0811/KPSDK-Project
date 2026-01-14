# JavaScript Deobfuscation Project

## Overview

This repository contains a highly obfuscated JavaScript file (`p.js`) and the tools/documentation to analyze it.

## Obfuscation Type

**Bytecode Virtualization** - One of the most advanced JavaScript obfuscation techniques available.

The original JavaScript code has been:
1. Compiled into a custom bytecode format
2. Compressed using base-43 encoding
3. Embedded in a JavaScript Virtual Machine that interprets the bytecode at runtime

## Files

### Original File
- **`p.js`** - The obfuscated code (208 KB, 483 lines, but line 16 alone is 198 KB!)

### Analysis Tools
- **`analyze-bytecode.js`** - Extracts the bytecode array from the obfuscated code
- **`disassemble-bytecode.js`** - Disassembles and analyzes the bytecode structure

### Generated Data
- **`bytecode.json`** - Extracted bytecode array (98,340 numeric elements)

### Documentation
- **`DEOBFUSCATION_ANALYSIS.md`** - Comprehensive analysis of the VM architecture
- **`p-deobfuscated.js`** - Heavily annotated version with detailed comments
- **`README_DEOBFUSCATION.md`** - This file

## Quick Start

### Extract the Bytecode
```bash
node analyze-bytecode.js
```

Output:
- Creates `bytecode.json` with the decoded bytecode
- Displays statistics (98,340 elements, 5,397 unique values)

### Analyze the Bytecode
```bash
node disassemble-bytecode.js
```

Output:
- Disassembles first 50 instructions
- Shows frequency analysis of bytecode values
- Displays bytecode structure statistics

## Key Findings

### Bytecode Statistics
- **Total Instructions**: 98,340 elements
- **Unique Values**: 5,397
- **Encoded Size**: 198,916 characters (line 16 of p.js)
- **Compression**: Base-43 encoding with custom alphabet
- **Value Range**: -1,868,562,432 to 2,130,706,432

### VM Architecture

#### Components
1. **Decoder (`S`)** - Base-43 decoder for compressed bytecode
2. **Bytecode Array** - 98,340 numeric instructions
3. **VM Executor (`l`)** - Main fetch-decode-execute loop
4. **Opcode Handlers** - ~86 functions implementing JavaScript operations
5. **Constant Decoder (`A`)** - Decodes strings, numbers, booleans from bytecode

#### Supported Operations
- ✓ Arithmetic: `+`, `-`, `*`, `/`, `%`
- ✓ Comparison: `==`, `===`, `<`, `>`, `>=`, `<=`, `!=`, `!==`
- ✓ Bitwise: `&`, `|`, `^`, `<<`, `>>`, `>>>`
- ✓ Logical: `!`, `&&`, `||`
- ✓ Object/Array: Property access, array creation, object creation
- ✓ Control Flow: Jumps, conditionals, function calls, returns
- ✓ Special: `typeof`, `instanceof`, `in`, `delete`, `new`

### Bytecode Composition
- **34.1%** - Small integers (immediate values)
- **28.0%** - Opcodes (0-99 range)
- **38.0%** - References and other data

### Most Frequent Opcodes
1. Value 128 (6.29%) - Unknown operation
2. Value 2 (5.11%) - Likely MULTIPLY or STRING marker
3. Value 160 (5.10%) - Unknown operation
4. Value 72 (4.72%) - Unknown operation
5. Value 3 (2.97%) - Likely EQUAL (==)

## How It Works

### Execution Flow

```
1. Load p.js
   ↓
2. Decode base-43 encoded string (line 16)
   ↓
3. Create bytecode array (98,340 elements)
   ↓
4. Initialize VM context (variables, globals, instruction pointer)
   ↓
5. Main Loop:
   - Fetch: Read opcode from bytecode[IP]
   - Decode: Get handler from opcode array
   - Execute: Run handler (modifies context)
   - Repeat until exit opcode
   ↓
6. Program execution complete
```

### Example Opcode Handler

```javascript
// Handler for strict equality (===)
function(context, readConst, writeVar, getVar, globals, utils) {
    var readVarRef = utils[5];
    writeVar(context, readVarRef(context) === readVarRef(context));
}
```

This handler:
1. Reads two values from the bytecode
2. Compares them with `===`
3. Writes the result back to a variable

## Limitations of This Analysis

### ✓ Completed
- [x] Identify obfuscation technique
- [x] Extract bytecode array
- [x] Document VM architecture
- [x] Annotate the code
- [x] Analyze bytecode structure

### ⏳ Not Completed (Would Require Significant Additional Work)
- [ ] Map all 86 opcode handlers to their operations
- [ ] Fully disassemble bytecode into readable pseudo-code
- [ ] Reconstruct control flow (loops, functions, conditionals)
- [ ] Decompile bytecode back to original JavaScript
- [ ] Determine the actual purpose/functionality of the program

## Why Is This Code Obfuscated?

Bytecode virtualization is typically used for:

1. **Intellectual Property Protection** - Hide proprietary algorithms
2. **License Enforcement** - Make it harder to remove license checks
3. **Anti-Tampering** - Prevent code modification
4. **Security Through Obscurity** - Hide sensitive logic
5. **Anti-Reverse Engineering** - Deter analysis
6. **Malware Obfuscation** - Unfortunately, also used to hide malicious code

⚠️ **Without full decompilation, we cannot determine the actual purpose of this code.**

## Security Considerations

- The VM accesses `window` and `Promise` objects → Browser environment
- Uses random string generation → Possible anti-debugging mechanism
- Very large bytecode (98K elements) → Complex functionality
- No obvious suspicious patterns in VM structure
- **Recommendation**: Do not execute this code unless you trust the source

## Further Analysis

To fully understand what this program does, you would need to:

1. **Map Opcode Handlers** - Reverse engineer all ~86 handler functions
2. **Build Disassembler** - Create complete opcode → operation mapping
3. **Trace Execution** - Instrument the VM to log operations
4. **Reconstruct AST** - Build abstract syntax tree from bytecode
5. **Decompile** - Generate readable JavaScript source

This would be a significant reverse engineering effort, potentially requiring:
- Custom disassembler development (100+ hours)
- Dynamic analysis / instrumentation (50+ hours)
- Control flow reconstruction (50+ hours)
- Decompiler development (100+ hours)

**Total estimated effort**: 300+ hours for a complete decompilation.

## Tools Used

- **Node.js** - For executing analysis scripts
- **Static Analysis** - Reading and annotating the code
- **Pattern Recognition** - Identifying VM components

## References

- [JavaScript Obfuscation Techniques](https://en.wikipedia.org/wiki/Obfuscation_(software))
- [Virtual Machine-based Code Obfuscation](https://en.wikipedia.org/wiki/Virtual_machine)
- [Code Protection Mechanisms](https://en.wikipedia.org/wiki/Software_protection)

## License

This deobfuscation analysis is provided for educational purposes only.

## Author

Deobfuscation Analysis - 2026

---

**Note**: This analysis demonstrates the structure and mechanism of the obfuscation, but does not reveal what the original program actually does. For that, a full decompilation would be required.
