import fs from 'fs';
import path from 'path';

// Helper function to get the size of a file or directory (sum of file sizes in case of directory)
function getSize(itemPath) {
    const stats = fs.statSync(itemPath); // Get stats (info) about the file or directory
    if (stats.isDirectory()) {
        // If it's a directory, calculate the size recursively by summing the sizes of all files within it
        return fs.readdirSync(itemPath).reduce((totalSize, child) => {
            const childPath = path.join(itemPath, child);
            return totalSize + getSize(childPath); // Recursively get size of child items
        }, 4096); // Default directory size in Linux
    } else {
        return stats.size; // For files, simply return the file size
    }
}

// Main function to generate the directory tree
function directoryToTree(rootDir, depth) {
    // Recursive function to build the tree structure
    function buildTree(currentPath, currentDepth) {
        const stats = fs.statSync(currentPath); // Get stats of the current item (file or directory)

        // Create a node (object) with the required properties
        const node = {
            name: path.basename(currentPath), // The name of the file or directory (without leading path)
            path: path.relative(process.cwd(), currentPath), // The relative path from the root directory
            type: stats.isDirectory() ? 'dir' : 'file', // Determine if it's a directory or file
            size: getSize(currentPath) // Get the size of the file or directory
        };

        // If the item is a directory and the depth limit has not been reached, process its children
        if (stats.isDirectory() && currentDepth > 0) {
            // Read the directory and build child nodes for each file/subdirectory
            node.children = fs.readdirSync(currentPath).map(child => {
                const childPath = path.join(currentPath, child);
                return buildTree(childPath, currentDepth - 1); // Recurse to process the child node
            });
        }

        return node; // Return the node (representing a file or directory)
    }

    return buildTree(rootDir, depth); // Start the tree-building process from the root directory
}

// Example usage
console.log("Test 1")
const tree = directoryToTree('dummy_dir/a_dir', 5);
console.log(JSON.stringify(tree, null, 2)); 


// Example 2: Test case for "dummy_dir" with depth 5
console.log("\nTest 2");
const example2Output = directoryToTree('dummy_dir', 5);
console.log(JSON.stringify(example2Output, null, 2));

// Example 3: Test case for "dummy_dir" with depth 1
console.log("\Test 3");
const example3Output = directoryToTree('dummy_dir', 1);
console.log(JSON.stringify(example3Output, null, 2));