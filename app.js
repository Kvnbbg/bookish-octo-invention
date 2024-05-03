const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

const app = express();

// Define a proxy route to forward requests to your Flask app
app.use('/api', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }));

// Serve your Node.js application's static files or define other routes as needed
// Example:
// app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Start Python script
const python = spawn('python', ['path/to/your/script.py']);

python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

python.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});