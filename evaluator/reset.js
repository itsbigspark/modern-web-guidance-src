const fs = require('fs');
const path = require('path');

const SCENARIOS = ['greenfield', 'brownfield', 'redfield'];
const PROMPT_TYPES = ['specific', 'vague'];
const AGENT_TYPES = ['guided', 'unguided'];

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

function resetScenario(scenario) {
  const sourceIndexHtml = path.join(PROJECT_ROOT, scenario, 'index.html');
  const hasSourceIndex = fs.existsSync(sourceIndexHtml);

  if (scenario !== 'greenfield' && !hasSourceIndex) {
    console.error(`Missing source index.html for ${scenario} at ${sourceIndexHtml}`);
    return;
  }

  PROMPT_TYPES.forEach(promptType => {
    AGENT_TYPES.forEach(agentType => {
      const targetDir = path.join(PROJECT_ROOT, scenario, promptType, agentType);

      console.log(`Resetting ${scenario}/${promptType}/${agentType}...`);

      // Ensure directory exists (create if missing), otherwise clear it
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      } else {
        clearDirectory(targetDir);
      }

      // If not greenfield, copy index.html
      if (scenario !== 'greenfield') {
        const destPath = path.join(targetDir, 'index.html');
        // Source checked at start of function
        fs.copyFileSync(sourceIndexHtml, destPath);
      }
    });
  });
}

function main() {
  console.log('Starting reset...');
  SCENARIOS.forEach(scenario => {
    resetScenario(scenario);
  });
  console.log('Reset complete.');
}

main();
