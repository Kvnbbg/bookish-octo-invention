const express = require('express');
const { spawn } = require('child_process');

const app = express();

// Route to handle incoming requests
app.get('/', (req, res) => {
    // Run your Python script using spawn
    const pythonProcess = spawn('python3', ['app/app.py']);

    // Handle data from Python script
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Data from Python script: ${data}`);
        // Send data from Python script to client
        res.send(data.toString());
        pythonProcess.kill(); // Kill the process after sending response to prevent sending multiple responses
    });

    // Handle errors from Python script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        pythonProcess.kill(); // Kill the process on error to prevent sending multiple responses
    });

    // Handle Python script exit
    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});