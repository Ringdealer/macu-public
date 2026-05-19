import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your build folder
const distDir = path.join(__dirname, 'dist');

// Function to recursively read files
function readFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(readFiles(filePath));
        } else if (file.endsWith('.js') || file.endsWith('.html')) {
            results.push(filePath);
        }
    }
    return results;
}

// Scan files for VITE_ variables
function scanForViteVars() {
    const files = readFiles(distDir);
    const found = new Set();

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(/VITE_[A-Z0-9_]+/g);
        if (matches) {
            matches.forEach(m => found.add(m));
        }
    }

    if (found.size === 0) {
        console.log('✅ No VITE_ variables found in build files.');
    } else {
        console.log('⚠️ VITE_ variables exposed in build:');
        found.forEach(v => console.log(' -', v));
    }
}

scanForViteVars();