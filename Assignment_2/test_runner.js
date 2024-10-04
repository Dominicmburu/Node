import { assert } from 'chai';
import { directoryToTree } from './index.js';

// Function to run a test case
export function runTest(dir, depth, expected) {
    // Generate the actual output using the directoryToTree function
    const actual = directoryToTree(dir, depth);

    // Compare the actual output with the expected output
    assert.deepEqual(actual, expected, `Test failed for directory: ${dir} with depth: ${depth}`);

    console.log(`Test passed for directory: ${dir} with depth: ${depth}`);
}
