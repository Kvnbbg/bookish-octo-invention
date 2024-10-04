import express from 'express';
import path from 'path';
import passport from 'passport';  // Use passport for authentication
import { simpleHash, users } from '../config/userAuth.js';  // Assuming these are defined in another file
import { fileURLToPath } from 'url';  // To handle __dirname with ES modules

const router = express.Router();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the template directory
const templateDir = path.join(__dirname, '..', 'static', 'templates');

// Routes

// Home page route
router.get('/', (req, res) => {
    res.send('Welcome to the home page!');
});

// About page route
router.get('/about', (req, res) => {
    res.send('About us page');
});

// Serve login page
router.get('/login', (req, res) => {
    const error = req.query.error;
    res.sendFile(path.join(templateDir, 'login.html'));
});

// Handle login authentication with Passport
router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=invalid_credentials'
}));

// Signup route (GET)
router.get('/signup', (req, res) => {
    res.sendFile(path.join(templateDir, 'signup.html'));
});

// Handle user signup (POST)
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.redirect('/signup?error=user_exists');
    }

    // Hash the password and save the user
    users[username] = simpleHash(password);

    // Redirect to login after signup
    res.redirect('/login');
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    });
});

// Error handling for 404
router.use((req, res) => {
    res.status(404).sendFile(path.join(templateDir, '404.html'));
});

// Error handling for other errors
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
});

export default router;
