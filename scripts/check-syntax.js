import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const roots = ['src', 'scripts'];

async function listJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return listJavaScriptFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  }));

  return files.flat();
}

function checkFile(file) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--check', file], { stdio: 'inherit' });
    child.on('close', (code) => resolve(code === 0));
  });
}

const files = (await Promise.all(roots.map(listJavaScriptFiles))).flat().sort();
let hasFailure = false;

for (const file of files) {
  const ok = await checkFile(file);
  hasFailure ||= !ok;
}

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log(`Syntaxe OK pour ${files.length} fichier(s) JS.`);
}
