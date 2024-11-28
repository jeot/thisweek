#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Get command line arguments
const args = process.argv.slice(2);
const [arg] = args;

if (!arg) {
	console.error('Please provide an argument');
	process.exit(1);
}

const newVersion = arg;

// For package.json style: "version": "0.0.0"
const packageJsonRegex = /(\s*"version":\s*["'])(.*?)(["'])/;
// For yaml style: version: "0.0.0"
const yamlVersionRegex = /(\s*version:\s*["'])(.*?)(["'])/;
// For Cargo.toml style: version = "0.0.0"
const cargoTomlRegex = /(\s*version\s*=\s*["'])(.*?)(["'])/;

// Resolve paths relative to the script location
const rootDir = resolve(__dirname, '..');

try {
    changeFileVersion(resolve(rootDir, 'package.json'), packageJsonRegex, newVersion);
    changeFileVersion(resolve(rootDir, 'src-tauri/tauri.conf.json'), packageJsonRegex, newVersion);
    changeFileVersion(resolve(rootDir, 'src-tauri/Cargo.toml'), cargoTomlRegex, newVersion);
    // Add more files as needed, for example:
    // changeFileVersion(resolve(rootDir, 'version.yml'), yamlVersionRegex, newVersion);
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(`Skipping ${error.path} - file not found`);
    } else {
        throw error;
    }
}

function changeFileVersion(filePath, versionRegex, newVersion) {
	if (!filePath) {
		console.error('Please provide a file path as an argument');
		process.exit(1);
	}

	try {
		// Read the file
		let content = readFileSync(filePath, 'utf8');

		// Replace version using regex
		const newContent = content.replace(versionRegex, `$1${newVersion}$3`);

		// Write back to file
		writeFileSync(filePath, newContent);
		console.log(`Successfully updated version to ${newVersion} in ${filePath}`);
	} catch (error) {
		console.error('Error:', error.message);
		process.exit(1);
	}
}
