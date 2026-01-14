// Bytecode Analysis Script
// This script extracts and analyzes the obfuscated bytecode from p.js

const fs = require('fs');

// Read the obfuscated file
const code = fs.readFileSync('p.js', 'utf8');

// Execute it in a controlled environment to get the NumberArray
console.log('=== EXECUTING OBFUSCATED CODE TO EXTRACT BYTECODE ===\n');

// Intercept console.log to capture NumberArray
let capturedNumberArray = null;
let capturedRandomString = null;
let logCount = 0;

const originalLog = console.log;
console.log = function(...args) {
    logCount++;
    if (logCount === 1) {
        // First log is NumberArray
        capturedNumberArray = args[0];
        originalLog('NumberArray captured:', capturedNumberArray.length, 'elements');
        originalLog('First 50 elements:', capturedNumberArray.slice(0, 50));
    } else if (logCount === 2) {
        // Second log is the random string
        capturedRandomString = args[0];
        originalLog('Random string:', capturedRandomString);
        // Stop execution after capturing both values
        throw new Error('CAPTURE_COMPLETE');
    } else {
        originalLog(...args);
    }
};

// Execute the code
try {
    eval(code);
} catch (e) {
    if (e.message !== 'CAPTURE_COMPLETE') {
        // Re-throw if it's not our intentional stop
        originalLog('Execution stopped (expected):', e.message);
    }
}

// Restore original console.log
console.log = originalLog;

console.log('\n=== BYTECODE STATISTICS ===');
console.log('Total bytecode elements:', capturedNumberArray.length);
console.log('Unique values:', new Set(capturedNumberArray).size);
console.log('Min value:', Math.min(...capturedNumberArray));
console.log('Max value:', Math.max(...capturedNumberArray));

// Save the bytecode to a file
fs.writeFileSync('bytecode.json', JSON.stringify({
    bytecode: capturedNumberArray,
    randomString: capturedRandomString,
    stats: {
        length: capturedNumberArray.length,
        unique: new Set(capturedNumberArray).size,
        min: Math.min(...capturedNumberArray),
        max: Math.max(...capturedNumberArray)
    }
}, null, 2));

console.log('\nBytecode saved to bytecode.json');
