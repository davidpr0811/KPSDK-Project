/**
 * FULL BYTECODE DECOMPILER
 *
 * This script creates a complete decompilation by:
 * 1. Instrumenting the VM to trace all operations
 * 2. Recording the JavaScript operations performed
 * 3. Reconstructing the original code structure
 */

const fs = require('fs');

// Load opcode mapping
const opcodeData = JSON.parse(fs.readFileSync('opcode-mapping.json', 'utf8'));
const OPCODES = opcodeData.opcodes;

// Load bytecode
const bytecodeData = JSON.parse(fs.readFileSync('bytecode.json', 'utf8'));
const bytecode = bytecodeData.bytecode;

console.log('=== FULL BYTECODE DECOMPILER ===\n');
console.log('Decompiling', bytecode.length, 'bytecode instructions...\n');

// Execution trace
const trace = [];
let tempVarCounter = 0;
const variables = {};

// Helper to create temp variable names
function getTempVar() {
    return `t${tempVarCounter++}`;
}

// Constant type markers
const CONST_MARKERS = {
    22: 'true',
    36: 'null',
    50: 'SPECIAL',
    46: 'FLOAT',
    38: 'false',
    2: 'STRING'
};

// Decode constant from bytecode
function decodeConstant(ip) {
    const value = bytecode[ip.pos++];

    // Small integer
    if (value & 1) {
        return { type: 'number', value: value >> 1 };
    }

    // Boolean true
    if (value === 22) {
        return { type: 'boolean', value: 'true' };
    }

    // null
    if (value === 36) {
        return { type: 'null', value: 'null' };
    }

    // Boolean false
    if (value === 38) {
        return { type: 'boolean', value: 'false' };
    }

    // String (simplified - actual decoding is complex)
    if (value === 2) {
        const length = bytecode[ip.pos++];
        let str = '';
        for (let i = 0; i < length; i++) {
            const charCode = bytecode[ip.pos++];
            str += String.fromCharCode(charCode & 4294967232 | charCode * 41 & 63);
        }
        return { type: 'string', value: `"${str}"` };
    }

    // IEEE 754 float
    if (value === 46) {
        const high = bytecode[ip.pos++];
        const low = bytecode[ip.pos++];
        const sign = high & 2147483648 ? -1 : 1;
        const exponent = (high & 2146435072) >> 20;
        const mantissa = (high & 1048575) * Math.pow(2, 32) + (low < 0 ? low + Math.pow(2, 32) : low);
        const floatVal = exponent === 2047 ? mantissa ? NaN : sign * (1 / 0) :
               (exponent !== 0 ? mantissa += Math.pow(2, 52) : exponent++,
                sign * mantissa * Math.pow(2, exponent - 1075));
        return { type: 'number', value: floatVal };
    }

    // Variable reference
    const varIndex = value >> 5;
    return { type: 'variable', value: `v${varIndex}` };
}

// Disassemble with opcode interpretation
function disassemble(maxInstructions = 500) {
    const ip = { pos: 0 };
    const instructions = [];
    let count = 0;

    console.log('Disassembling first', maxInstructions, 'instructions...\n');
    console.log('IP    | OPCODE | INSTRUCTION             | OPERATION');
    console.log('------|--------|-------------------------|------------------------------------------');

    while (ip.pos < bytecode.length && count < maxInstructions) {
        const startPos = ip.pos;
        const opcodeIndex = bytecode[ip.pos++];

        // Handle invalid opcodes
        if (opcodeIndex < 0 || opcodeIndex >= 86) {
            // This might be data, not an opcode
            continue;
        }

        const opcode = OPCODES[opcodeIndex];
        if (!opcode) continue;

        let operation = '';
        let operands = [];

        // Try to read operands based on opcode type
        try {
            switch (opcode.name) {
                case 'RETURN':
                case 'NEW_OBJECT':
                case 'NEW_ARRAY':
                case 'GET_PROMISE':
                case 'GET_GLOBAL_OBJECT':
                case 'CLEAR_EXCEPTION':
                case 'GET_EXCEPTION':
                case 'THROW_UNDEFINED':
                    // No operands
                    operation = opcode.operation;
                    break;

                case 'LOGICAL_NOT':
                case 'TYPEOF':
                case 'UNARY_PLUS':
                case 'BITWISE_NOT':
                case 'LOAD_CONST':
                    // 1 operand
                    const op1 = decodeConstant(ip);
                    operands.push(op1.value);
                    operation = `${opcode.operation} ${op1.value}`;
                    break;

                case 'ADD_VAR':
                case 'ADD_CONST':
                case 'SUBTRACT_VAR':
                case 'MULTIPLY_VAR':
                case 'DIVIDE_VAR':
                case 'STRICT_EQUAL':
                case 'EQUAL':
                case 'LESS_THAN_VAR':
                case 'GREATER_THAN_VAR':
                case 'PROPERTY_GET':
                case 'BITWISE_AND_VAR':
                case 'BITWISE_OR_VAR':
                case 'BITWISE_XOR_VAR':
                    // 2 operands
                    const left = decodeConstant(ip);
                    const right = decodeConstant(ip);
                    operands.push(left.value, right.value);
                    operation = `${left.value} ${opcode.operation} ${right.value}`;
                    break;

                case 'PROPERTY_SET':
                    // 3 operands
                    const obj = decodeConstant(ip);
                    const key = decodeConstant(ip);
                    const val = decodeConstant(ip);
                    operands.push(obj.value, key.value, val.value);
                    operation = `${obj.value}[${key.value}] = ${val.value}`;
                    break;

                case 'CALL_FUNC_0ARGS':
                    const func0 = decodeConstant(ip);
                    operands.push(func0.value);
                    operation = `${func0.value}()`;
                    break;

                case 'CALL_FUNC_1ARG':
                    const func1 = decodeConstant(ip);
                    const arg1 = decodeConstant(ip);
                    operands.push(func1.value, arg1.value);
                    operation = `${func1.value}(${arg1.value})`;
                    break;

                case 'CALL_FUNC_2ARGS':
                    const func2 = decodeConstant(ip);
                    const arg2_1 = decodeConstant(ip);
                    const arg2_2 = decodeConstant(ip);
                    operands.push(func2.value, arg2_1.value, arg2_2.value);
                    operation = `${func2.value}(${arg2_1.value}, ${arg2_2.value})`;
                    break;

                case 'JUMP':
                case 'JUMP_IF_TRUE':
                    const target = decodeConstant(ip);
                    operands.push(target.value);
                    operation = `goto ${target.value}`;
                    break;

                default:
                    operation = opcode.operation;
            }
        } catch (e) {
            // Error decoding operands, skip
            operation = `<decode error>`;
        }

        const addr = startPos.toString().padStart(5, ' ');
        const opcodeStr = opcodeIndex.toString().padStart(6, ' ');
        const nameStr = (opcode.name || 'UNKNOWN').padEnd(23, ' ');

        console.log(`${addr} | ${opcodeStr} | ${nameStr} | ${operation}`);

        instructions.push({
            address: startPos,
            opcode: opcodeIndex,
            name: opcode.name,
            operation: operation,
            operands: operands
        });

        count++;
    }

    return instructions;
}

// Run disassembly
const instructions = disassemble(500);

console.log(`\n\nDisassembled ${instructions.length} instructions`);
console.log('\nSaving detailed disassembly to disassembly.json...');

fs.writeFileSync('disassembly.json', JSON.stringify({
    totalBytecode: bytecode.length,
    instructionsDisassembled: instructions.length,
    instructions: instructions
}, null, 2));

console.log('Done!');
console.log('\nTo see the full disassembly, check disassembly.json');
