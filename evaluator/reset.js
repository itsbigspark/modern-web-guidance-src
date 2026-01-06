const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;

function clearDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    // Intentionally removing .DS_Store as well to ensure truly empty state
    const fullPath = path.join(dirPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

function main() {
  console.log('Starting reset...');
  
  const testRunsDir = path.join(PROJECT_ROOT, 'test_runs');
  console.log('Clearing test_runs directory...');
  
  // Ensure test_runs exists, then clear it
  if (!fs.existsSync(testRunsDir)) {
    fs.mkdirSync(testRunsDir, { recursive: true });
  } else {
    clearDirectory(testRunsDir);
  }
  
  console.log('Reset complete.');
}

main();
