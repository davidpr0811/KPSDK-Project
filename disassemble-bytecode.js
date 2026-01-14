/**
 * Simple Bytecode Disassembler
 *
 * This script attempts to disassemble the first portion of the bytecode
 * into human-readable pseudo-operations.
 *
 * Note: This is a simplified disassembler that shows the structure.
 * Full decompilation would require analyzing all opcode handlers.
 */

const fs = require('fs');

// Load the bytecode
const data = JSON.parse(fs.readFileSync('bytecode.json', 'utf8'));
const bytecode = data.bytecode;

console.log('=== BYTECODE DISASSEMBLER ===\n');
console.log(`Total bytecode elements: ${bytecode.length}`);
console.log(`Analyzing first 200 instructions...\n`);

// Constant type markers
const MARKERS = {
    22: 'TRUE',
    36: 'NULL',
    50: 'SPECIAL',
    46: 'FLOAT',
    38: 'FALSE',
    2: 'STRING'
};

// Simplified opcode names (based on handler analysis)
const OPCODES = {
    0: 'STRICT_EQUAL',      // ===
    1: 'INSTANCEOF',        // instanceof
    2: 'MULTIPLY',          // *
    3: 'EQUAL',             // ==
    4: 'NOT_EQUAL',         // !=
    5: 'LESS_THAN',         // <
    6: 'GREATER_THAN',      // >
    7: 'ADD',               // +
    8: 'SUBTRACT',          // -
    9: 'DIVIDE',            // /
    10: 'MODULO',           // %
    11: 'BITWISE_AND',      // &
    12: 'BITWISE_OR',       // |
    13: 'BITWISE_XOR',      // ^
    14: 'LEFT_SHIFT',       // <<
    15: 'RIGHT_SHIFT',      // >>
    16: 'LOGICAL_NOT',      // !
    17: 'UNARY_PLUS',       // +
    18: 'PROPERTY_GET',     // obj[key]
    19: 'PROPERTY_SET',     // obj[key] = val
    20: 'CALL_FUNCTION',    // func()
    21: 'NEW_ARRAY',        // new Array()
    22: 'NEW_OBJECT',       // {}
    23: 'JUMP',             // goto
    24: 'JUMP_IF_FALSE',    // if (!cond) goto
    25: 'RETURN',           // return
    26: 'THROW',            // throw
    27: 'LOAD_VAR',         // load variable
    28: 'STORE_VAR',        // store variable
    29: 'LOAD_CONST',       // load constant
};

let ip = 0; // Instruction pointer
let disassembled = [];

/**
 * Read next bytecode value
 */
function readByte() {
    if (ip >= bytecode.length) return null;
    return bytecode[ip++];
}

/**
 * Decode a constant value
 */
function decodeConstant(value) {
    // Small integer (odd number)
    if (value & 1) {
        return { type: 'INT', value: value >> 1 };
    }

    // Check type markers
    if (MARKERS[value]) {
        return { type: MARKERS[value], value: null };
    }

    // Variable reference
    return { type: 'VAR', index: value >> 5 };
}

/**
 * Disassemble instructions
 */
function disassemble(limit = 50) {
    let count = 0;

    while (ip < bytecode.length && count < limit) {
        const startIP = ip;
        const opcode = readByte();

        if (opcode === null) break;

        let instruction = {
            address: startIP,
            opcode: opcode,
            name: OPCODES[opcode] || `UNKNOWN_${opcode}`,
            operands: []
        };

        // For demonstration, read potential operands
        // In reality, different opcodes have different operand counts
        // This is a simplified view

        disassembled.push(instruction);
        count++;
    }

    return disassembled;
}

// Disassemble first 50 instructions
const instructions = disassemble(50);

// Display disassembly
console.log('ADDRESS | OPCODE | INSTRUCTION');
console.log('--------|--------|------------------');

instructions.forEach(inst => {
    const addr = inst.address.toString().padStart(6, ' ');
    const opcode = inst.opcode.toString().padStart(5, ' ');
    const name = inst.name;

    console.log(`${addr}  | ${opcode}  | ${name}`);
});

console.log('\n=== ANALYSIS ===\n');

// Count opcode frequency
const opcodeFreq = {};
bytecode.forEach(code => {
    opcodeFreq[code] = (opcodeFreq[code] || 0) + 1;
});

// Sort by frequency
const sorted = Object.entries(opcodeFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

console.log('Top 20 most frequent bytecode values:\n');
console.log('VALUE   | COUNT  | PERCENTAGE');
console.log('--------|--------|------------');

sorted.forEach(([value, count]) => {
    const pct = (count / bytecode.length * 100).toFixed(2);
    const v = value.padStart(6, ' ');
    const c = count.toString().padStart(6, ' ');

    const name = OPCODES[value] || MARKERS[value] || '';
    console.log(`${v}  | ${c}  | ${pct}%  ${name}`);
});

console.log('\n=== BYTECODE STRUCTURE ===\n');

// Analyze value distribution
let intCount = 0;
let opcodeCount = 0;
let refCount = 0;

bytecode.forEach(val => {
    if (val & 1) intCount++;
    else if (val >= 0 && val < 100) opcodeCount++;
    else refCount++;
});

console.log(`Small integers (odd values): ${intCount} (${(intCount/bytecode.length*100).toFixed(1)}%)`);
console.log(`Likely opcodes (0-99):       ${opcodeCount} (${(opcodeCount/bytecode.length*100).toFixed(1)}%)`);
console.log(`Other values (refs/data):    ${refCount} (${(refCount/bytecode.length*100).toFixed(1)}%)`);

console.log('\n=== FIRST 100 BYTECODE VALUES ===\n');
console.log(bytecode.slice(0, 100).join(', '));

console.log('\n\nNote: This is a simplified disassembler.');
console.log('Full decompilation requires analyzing all ~86 opcode handlers.');
console.log('See DEOBFUSCATION_ANALYSIS.md for complete VM documentation.');
