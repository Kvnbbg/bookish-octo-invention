import { spawn } from 'child_process';

function startServer() {
  const serverProcess = spawn('node', ['./app/server.js']);

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server Output: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  serverProcess.on('error', (error) => {
    console.error(`Failed to start the server process: ${error.message}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    // Automatically restart the server if it exits with an error code
    if (code !== 0) {
      console.log('Restarting server...');
      startServer();
    }
  });
}

// Start the server
startServer();
