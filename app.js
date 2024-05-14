const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

// Serve static files from the "app/myapp/templates" directory
app.use(express.static(path.join(__dirname, 'app', 'myapp', 'templates')));

// Route to handle incoming requests
app.get('/', (req, res) => {
    // Run your Python script using spawn
    const pythonProcess = spawn('python3', ['app/app.py']);

    let scriptOutput = '';

    // Handle data from Python script
    pythonProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
    });

    // Handle errors from Python script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
    });

    // Handle Python script exit
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // Send data from Python script to client
            res.send(scriptOutput);
        } else {
            res.status(500).send(`Python script exited with code ${code}`);
        }
        console.log(`Python script exited with code ${code}`);
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
