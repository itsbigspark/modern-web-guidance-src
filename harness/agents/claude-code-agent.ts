import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { createIsolatedHome, cleanupIsolatedHome, parseAgentArgs, copyFileIfExists, updateMcpConfig, copyAgentContext } from '../lib/agent-shared.ts';
import config from '../config.ts';

// Usage: node claude-code-agent.ts <directory> <prompt> [runType]
const { userPrompt, runType, absoluteTargetDir, projectRoot } = parseAgentArgs('claude-code-agent.ts');

/**
 * Sets up an isolated HOME directory to ensure test isolation.
 * @returns {string} The path to the temporary HOME directory.
 */
function setupIsolatedHome(): string {
  const tempHome = createIsolatedHome('ghh-claude');

  // Copy GCP credentials (for Vertex auth)
  const gcloudConfigDest = path.join(tempHome, '.config/gcloud');
  fs.mkdirSync(gcloudConfigDest, { recursive: true });
  copyFileIfExists(config.gcpCredentials, path.join(gcloudConfigDest, 'application_default_credentials.json'));

  // Set environment variables for the current process (and children)
  process.env.HOME = tempHome;

  // Add CLAUDE context and MCP servers for guided runs
  if (runType === 'guided') {
    copyAgentContext(projectRoot, tempHome, true);

    updateMcpConfig(
      path.join(tempHome, '.claude.json'),
      config.mcpServersToEnable,
      config.modernWebServerPath,
      config.mcpApiKey,
      'claude-code'
    );
  }

  return tempHome;
}

/**
 * Executes the Claude CLI command and captures output.
 */
async function run() {
  let tempHome: string | null = null;
  try {
    console.log(`Starting Claude Code agent in: ${absoluteTargetDir}`);

    // Setup isolated environment
    tempHome = setupIsolatedHome();

    // Ensure the target directory exists
    if (!fs.existsSync(absoluteTargetDir)) {
      fs.mkdirSync(absoluteTargetDir, { recursive: true });
    }

    const command = config.claudeCodeCliBin;
    const commandArgs = [
      '-p', userPrompt,
      '--dangerously-skip-permissions',
      '--verbose'
    ];

    console.log(`Executing: ${command} ${commandArgs.join(' ')}`);

    const child = spawn(command, commandArgs, {
      cwd: absoluteTargetDir,
      env: { ...process.env }, // Pass through environment variables (including new HOME)
      stdio: ['ignore', 'pipe', 'pipe'] // Capture stdout/stderr
    });

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (data) => {
      const chunk = data.toString();
      stdoutData += chunk;
      process.stdout.write(chunk); // Mirror to console
    });

    child.stderr.on('data', (data) => {
      const chunk = data.toString();
      stderrData += chunk;
      process.stderr.write(chunk); // Mirror to console
    });

    const exitCode = await new Promise((resolve) => {
      child.on('close', resolve);
    });

    if (exitCode !== 0) {
      throw new Error(`Claude Code exited with code ${exitCode}`);
    }

    // Save output to chat_log.txt
    const chatLogPath = path.join(absoluteTargetDir, 'chat_log.txt');
    fs.writeFileSync(chatLogPath, stdoutData, 'utf8');
    console.log(`Saved output to: ${chatLogPath}`);

    console.log("Claude Code agent finished successfully.");

  } catch (err) {
    console.error("Error during Claude Code execution:", err);
    process.exit(1);
  } finally {
    if (tempHome) {
      cleanupIsolatedHome(tempHome);
    }
  }
}

run();
