import express from 'express';
import path from 'path';
import passport from 'passport';
import { simpleHash } from '../utils/index.js';
import { fileURLToPath } from 'url';

const router = express.Router();

// ES module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global template directory
const templateDir = path.join(__dirname, '..', 'src', 'static', 'templates');

// Home page route
router.get('/', (req, res) => {
    res.sendFile(path.join(templateDir, 'index.html'));
});

// Login page
router.get('/login', (req, res) => {
    const error = req.query.error;
    res.sendFile(path.join(templateDir, 'login.html'), { error });
});

// Handle login with Passport.js
router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=invalid_credentials',
    failureFlash: true // Optionally use failure flash messages
}));

// Signup route (GET)
router.get('/signup', (req, res) => {
    res.sendFile(path.join(templateDir, 'signup.html'));
});

// Handle signup (POST)
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists (pseudo-code, replace with actual db query)
    const userExists = false; // Replace this with your database check
    if (userExists) {
        return res.redirect('/signup?error=user_exists');
    }

    try {
        // Hash the password securely
        const hashedPassword = await simpleHash(password, true); // Use async hash method

        // Save user to database (pseudo-code)
        // await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.redirect('/login');
    } catch (err) {
        console.error('Signup error:', err);
        res.redirect('/signup?error=server_error');
    }
});

// Logout route
router.get('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    });
});

// About page route
router.get('/about', (req, res) => {
    res.send('About us page');
});

// Handle 404 errors
router.use((req, res) => {
    res.status(404).sendFile(path.join(templateDir, '404.html'));
});

// Handle 500 errors
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
});

export default router;
