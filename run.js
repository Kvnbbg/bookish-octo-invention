import { spawn } from 'child_process';
import { accessSync, constants as fsConstants } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSTANTS = {
  SERVER_COMMAND: 'node',
  SERVER_ENTRY: path.resolve(__dirname, 'app', 'server.js'),
  RESTART_DELAY_MS: 1000,
};

const logger = {
  info(message, metadata = {}) {
    console.info(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      }),
    );
  },
  error(message, metadata = {}) {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      }),
    );
  },
};

function validateServerEntry() {
  try {
    accessSync(CONSTANTS.SERVER_ENTRY, fsConstants.R_OK);
  } catch (error) {
    logger.error('Server entry is not accessible.', {
      entryPath: CONSTANTS.SERVER_ENTRY,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }

  return true;
}

function scheduleRestart() {
  logger.info('Restarting server after delay.', {
    delayMs: CONSTANTS.RESTART_DELAY_MS,
  });
  setTimeout(() => {
    startServer();
  }, CONSTANTS.RESTART_DELAY_MS);
}

function startServer() {
  if (!validateServerEntry()) {
    return;
  }

  const serverProcess = spawn(CONSTANTS.SERVER_COMMAND, [CONSTANTS.SERVER_ENTRY], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', (data) => {
    logger.info('Server output received.', { output: data.toString().trim() });
  });

  serverProcess.stderr.on('data', (data) => {
    logger.error('Server error output received.', { output: data.toString().trim() });
  });

  serverProcess.on('error', (error) => {
    logger.error('Failed to start the server process.', {
      error: error.message,
    });
  });

  serverProcess.on('close', (code, signal) => {
    logger.info('Server process exited.', {
      exitCode: code,
      signal,
    });
    if (typeof code === 'number' && code !== 0) {
      scheduleRestart();
    }
  });
}

startServer();
