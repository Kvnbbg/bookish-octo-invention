const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const passport = require('./src/config/passport'); // Import the passport module
const LocalStrategy = require('passport-local').Strategy;

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    name: 'session-id',
    rolling: true,
    renew: true,
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session()); 

// Template files location
const templateDir = path.join(__dirname, 'app', 'myapp', 'templates');

// User credentials (for demo purposes)
const users = [
    { username: 'admin', password: 'password' },
    { username: 'user', password: 'password' },
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// User date (for demo purposes)
const date = new Date();

// Posts by users (for demo purposes)
const posts = [
    { title: 'Post 1', content: 'This is the first post. By.${username}', date: date },
    { title: 'Post 2', content: 'This is the second post. By ${username}', date: date },
    { title: 'Post 3', content: 'This is the third post. By ${username}', date: date },
    { title: 'Post 4', content: 'This is the fourth post. By ${username}', date: date }
];

export default posts;


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
app.get('/login', (req, res, next) => {
    const error = req.query.error;
    res.render('login', { error });
    res.sendFile(path.join(templateDir, 'login.html'));
});

app.post('/login/password', async (req, res) => {
    const { username, password } = req.body;
    if (users[username] && simpleHash(users[username]) === simpleHash(password)) {
        req.session.loggedIn = true;
        req.session.username = username;
        req.session.save(() => {
            res.redirect('/');
        });
        res.redirect('/');
    } else {
        res.redirect('/login?error=invalid_credentials');
    }
});

app.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=invalid_credentials'
}));

// Signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(templateDir, 'signup.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        res.redirect('/signup?error=user_exists');
    }
    users[username] = password;
    res.redirect('/login');
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