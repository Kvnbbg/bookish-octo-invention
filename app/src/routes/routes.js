// Import required modules
import express from 'express';
import path from 'path';
import passport from 'passport';
import { simpleHash } from '../utils/index.js';
import { fileURLToPath } from 'url';

const router = express.Router();

// ES module workaround for __dirname to make paths compatible in all environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the global template directory using path.join for cross-platform compatibility
const templateDir = path.resolve(__dirname, '..', 'templates');

// Home page route - Serves the main index.html file
router.get('/', (req, res) => {
    try {
        res.sendFile(path.join(templateDir, 'index.html'));
    } catch (error) {
        console.error('Error serving the home page:', error);
        res.status(500).sendFile(path.join(templateDir, '500.html'));
    }
});

// Login page route
router.get('/login', (req, res) => {
    try {
        res.sendFile(path.join(templateDir, 'login.html'));
    } catch (error) {
        console.error('Error serving the login page:', error);
        res.status(500).sendFile(path.join(templateDir, '500.html'));
    }
});

// Passport.js login handling
router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=invalid_credentials',
    failureFlash: true
}));

// Google OAuth routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { 
        successRedirect: '/',
        failureRedirect: '/login?error=google_auth_failed'
    })
);

// GitHub OAuth routes
router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
    passport.authenticate('github', { 
        successRedirect: '/',
        failureRedirect: '/login?error=github_auth_failed'
    })
);

// Signup page route
router.get('/signup', (req, res) => {
    try {
        res.sendFile(path.join(templateDir, 'signup.html'));
    } catch (error) {
        console.error('Error serving the signup page:', error);
        res.status(500).sendFile(path.join(templateDir, '500.html'));
    }
});

// Handle user signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Replace with actual database check if the user already exists
    const userExists = false; // This is a placeholder for the database query
    if (userExists) {
        return res.redirect('/signup?error=user_exists');
    }

    try {
        const hashedPassword = await simpleHash(password);

        // Placeholder for saving the user to the database
        // await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.redirect('/login');
    } catch (error) {
        console.error('Signup error:', error);
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

// User profile route (protected)
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(templateDir, 'profile.html'));
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Additional routes for static pages (e.g., About, Contact)
router.get('/about', (req, res) => {
    res.sendFile(path.join(templateDir, 'about_us.html'));
});

router.get('/contact', (req, res) => {
    res.sendFile(path.join(templateDir, 'contact.html'));
});

// 404 Error handling
router.use((req, res) => {
    res.status(404).sendFile(path.join(templateDir, '404.html'));
});

// Centralized error handling middleware for 500 errors
router.use((err, req, res, next) => {
    console.error('Internal server error:', err.stack);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
});

export default router;
