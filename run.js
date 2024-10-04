// run.js
import { spawn } from 'child_process';

const serverProcess = spawn('node', ['./app/server.js']); 

serverProcess.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

// ... (rest of the code remains the same)

serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server  
   process exited with code ${code}`);  
  
  });