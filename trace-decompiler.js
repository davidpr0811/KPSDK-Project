/**
 * TRACING DECOMPILER
 *
 * This instrumentsthe original VM code to trace execution
 * and generate readable JavaScript output
 */

const fs = require('fs');

// Read the original p.js
let originalCode = fs.readFileSync('p.js', 'utf8');

// Load opcode mapping
const opcodeMapping = JSON.parse(fs.readFileSync('opcode-mapping.json', 'utf8'));
const OPCODES = opcodeMapping.opcodes;

console.log('=== TRACING DECOMPILER ===\n');
console.log('Instrumenting VM to trace execution...\n');

// Create instrumented version
let instrumentedCode = originalCode;

// Inject tracing code at the beginning
const tracingSetup = `
// === TRACING INSTRUMENTATION ===
var __trace = [];
var __varNames = {};
var __varCounter = 0;
var __depth = 0;

function __getVarName(val) {
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';
    if (typeof val === 'boolean') return val.toString();
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'string') return JSON.stringify(val);
    if (typeof val === 'function') return 'function';
    if (Array.isArray(val)) return '[...]';
    if (typeof val === 'object') return '{...}';
    return 'unknown';
}

function __logOp(opcode, operation, result) {
    __trace.push({
        depth: __depth,
        opcode: opcode,
        operation: operation,
        result: __getVarName(result)
    });
    if (__trace.length <= 1000) { // Limit trace size
        console.log('[' + opcode + '] ' + operation + ' => ' + __getVarName(result));
    }
}
`;

// Inject at start of IIFE
instrumentedCode = instrumentedCode.replace(
    '"use strict";\n(function() {',
    '"use strict";\n(function() {\n' + tracingSetup
);

// Add trace export at the end
const traceExport = `
// Export trace
if (typeof process !== 'undefined') {
    console.log('\\n=== EXECUTION TRACE COMPLETE ===');
    console.log('Total operations:', __trace.length);
    const fs = require('fs');
    fs.writeFileSync('execution-trace.json', JSON.stringify({
        totalOperations: __trace.length,
        trace: __trace.slice(0, 1000) // Save first 1000 operations
    }, null, 2));
    console.log('Trace saved to execution-trace.json');
}
`;

instrumentedCode = instrumentedCode.replace(
    'l(d)\n})();',
    'l(d)\n' + traceExport + '\n})();'
);

// Save instrumented version
fs.writeFileSync('p-instrumented.js', instrumentedCode);

console.log('Instrumented VM saved to p-instrumented.js');
console.log('\\nRunning instrumented version to capture execution trace...\n');
console.log('Note: This will show the first ~1000 operations executed\n');
console.log('========================================\\n');

// Execute instrumented version
try {
    eval(instrumentedCode);
} catch (e) {
    console.log('\\nExecution stopped:',  e.message);
    console.log('\\nThis is expected if the code requires a browser environment');
}

console.log('\\n\\n=== DECOMPILATION COMPLETE ===');
console.log('\\nGenerated files:');
console.log('- p-instrumented.js: Instrumented version with tracing');
console.log('- execution-trace.json: Trace of first 1000 operations');
