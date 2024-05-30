const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the "app/myapp/templates" directory
app.use(express.static(path.join(__dirname, 'app', 'myapp', 'templates')));
app.use(express.static(path.join(__dirname, 'app', 'myapp', 'static')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'myapp', 'templates', 'index.html'));
});

// Additional routes for other HTML files
app.get('/features', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'myapp', 'templates', 'features.html'));
});

app.get('/about_us', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'myapp', 'templates', 'about_us.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'myapp', 'templates', 'contact.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'myapp', 'templates', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'myapp', 'templates', 'signup.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
