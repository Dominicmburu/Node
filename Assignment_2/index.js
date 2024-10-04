import fs from 'fs';
import path from 'path';


function getSize(itemPath) {
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
        return fs.readdirSync(itemPath).reduce((totalSize, child) => {
            const childPath = path.join(itemPath, child);
            return totalSize + getSize(childPath);
        }, 4096);
    } else {
        return stats.size;
    }
}

export function directoryToTree(rootDir, depth) {
    // Recursive function to build the tree structure
    function buildTree(currentPath, currentDepth) {
        const stats = fs.statSync(currentPath);

        const node = {
            name: path.basename(currentPath),
            path: path.relative(process.cwd(), currentPath),
            type: stats.isDirectory() ? 'dir' : 'file',
            size: getSize(currentPath)
        };

        if (stats.isDirectory() && currentDepth > 0) {
            // Read the directory and build child nodes for each file/subdirectory
            node.children = fs.readdirSync(currentPath).map(child => {
                const childPath = path.join(currentPath, child);
                return buildTree(childPath, currentDepth - 1);
            });
        }

        return node;
    }

    return buildTree(rootDir, depth); // Start the tree-building process from the root directory
}


console.log("Test 1")
const tree = directoryToTree('dummy_dir/a_dir', 5);
console.log(JSON.stringify(tree, null, 2)); 

