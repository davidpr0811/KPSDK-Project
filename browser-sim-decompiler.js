/**
 * BROWSER SIMULATION DECOMPILER
 *
 * Simulates browser environment and traces execution
 */

const fs = require('fs');

console.log('=== BROWSER SIMULATION DECOMPILER ===\n');

// Create minimal browser environment simulation
global.window = {
    Promise: Promise,
    // Add other browser APIs as needed
    document: {},
    navigator: {},
    location: {},
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval
};

// Make window properties available globally
global.document = global.window.document;
global.navigator = global.window.navigator;
global.Promise = global.window.Promise;

// Tracing variables
const executionTrace = [];
let operationCount = 0;
const maxTrace = 2000;

// Load opcode mapping
const opcodeMapping = JSON.parse(fs.readFileSync('opcode-mapping.json', 'utf8'));
const OPCODES = opcodeMapping.opcodes;

// Read original code
let code = fs.readFileSync('p.js', 'utf8');

// Instrument the VM's main execution loop
// We'll wrap the opcode handler execution to log operations

const instrumentationCode = `
var __executionLog = [];
var __opCount = 0;

// Store original opcode array creation
var __originalN = N;
`;

// Modify to inject logging
code = code.replace(
    'N = new Proxy([function',
    instrumentationCode + '\nN = new Proxy([function'
);

// Inject logging into the main execution loop
code = code.replace(
    '_ = N[NumberArray[e.d[0]++]];',
    `var __opcodeIndex = NumberArray[e.d[0] - 1];
     if (__opCount < 2000) {
         __executionLog.push({ op: __opcodeIndex, ip: e.d[0] - 1 });
         __opCount++;
     }
     _ = N[__opcodeIndex];`
);

// Add export at end
code = code.replace(
    'l(d)\n})();',
    `l(d);
    if (typeof process !== 'undefined') {
        const fs = require('fs');
        console.log('\\n=== EXECUTION COMPLETED ===');
        console.log('Operations executed:', __opCount);
        fs.writeFileSync('execution-log.json', JSON.stringify({
            totalOps: __opCount,
            operations: __executionLog
        }, null, 2));
        console.log('Execution log saved to execution-log.json');
    }
    })();`
);

console.log('Running instrumented code with browser simulation...\n');
console.log('========================================\n');

try {
    eval(code);
} catch (e) {
    console.log('\n[ERROR]', e.message);
    console.log('\nStack:', e.stack);
}

// Analyze the execution log if it exists
try {
    const logData = JSON.parse(fs.readFileSync('execution-log.json', 'utf8'));
    console.log('\n=== EXECUTION ANALYSIS ===\n');
    console.log(`Total operations: ${logData.totalOps}`);

    // Count opcode frequency
    const opcodeFreq = {};
    logData.operations.forEach(op => {
        opcodeFreq[op.op] = (opcodeFreq[op.op] || 0) + 1;
    });

    console.log('\nMost frequent operations:');
    Object.entries(opcodeFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .forEach(([opcode, count]) => {
            const opInfo = OPCODES[opcode] || { name: 'UNKNOWN', operation: '?' };
            console.log(`  [${opcode.padStart(2, ' ')}] ${opInfo.name.padEnd(30, ' ')} ${opInfo.operation.padEnd(15, ' ')} - ${count} times`);
        });

    // Show first 50 operations
    console.log('\n\n=== FIRST 50 OPERATIONS ===\n');
    console.log('IP     | OPCODE | NAME                      | OPERATION');
    console.log('-------|--------|---------------------------|-------------------------');

    logData.operations.slice(0, 50).forEach(op => {
        const opInfo = OPCODES[op.op] || { name: 'UNKNOWN', operation: '?', description: 'Unknown operation' };
        const ipStr = op.ip.toString().padStart(6, ' ');
        const opcodeStr = op.op.toString().padStart(6, ' ');
        const nameStr = opInfo.name.padEnd(25, ' ');
        console.log(`${ipStr} | ${opcodeStr} | ${nameStr} | ${opInfo.operation}`);
    });

} catch (e) {
    console.log('\nCould not analyze execution log:', e.message);
}

console.log('\n=== DECOMPILATION ANALYSIS COMPLETE ===');
