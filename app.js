const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key', 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware to serve static files from the "app/myapp/static" directory
app.use(express.static(path.join(__dirname, 'app', 'myapp', 'static')));

// Template files location
const templateDir = path.join(__dirname, 'app', 'myapp', 'templates');

// User credentials (for demo purposes)
const users = {
    user1: 'password1',
    user2: 'password2'
};

// Use math to hash and verify passwords (simple example, not for production)
const simpleHash = (password) => {
    return Array.from(password).reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

// Route to serve the index.html file
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(templateDir, 'index.html'));
    } else {
        res.redirect('/login');
    }
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(templateDir, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && simpleHash(users[username]) === simpleHash(password)) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/');
    } else {
        res.redirect('/login?error=invalid_credentials');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

// Dynamically serve other HTML files
const pages = ['index', 'about_us', 'contact', 'signup'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(templateDir, `${page}.html`));
    });
});

// Error Handling for 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(templateDir, '404.html'));
});

// Error Handling for other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown in case of critical failure
process.on('SIGINT', () => {
    console.log("Gracefully shutting down from SIGINT (Ctrl-C)");
    process.exit();
});