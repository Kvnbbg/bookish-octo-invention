import express from 'express';
import path from 'path';
import passport from 'passport';  // Use passport for authentication
import { simpleHash } from '../utils/index.js';  // Assuming this is defined correctly
import { fileURLToPath } from 'url';  // To handle __dirname with ES modules

const router = express.Router();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the template directory (make it global)
const templateDir = path.join(__dirname, '..', 'src', 'static', 'templates');

// Serve static files from the 'static' folder (CSS, JS, images)
router.use(express.static(path.join(templateDir)));

// Special route for the home page
router.get('/', (req, res) => {

    res.sendFile(path.join(templateDir, 'index.html'));
});

// Serve login page and handle login errors (if any)
router.get('/login', (req, res) => {
    const error = req.query.error; // Check for any login error
    res.sendFile(path.join(templateDir, 'login.html'));
});

// Handle user authentication with Passport for login
router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/', // Redirect to home on successful login
    failureRedirect: '/login?error=invalid_credentials' // Redirect to login with error on failure
}));

// Signup route (GET)
router.get('/signup', (req, res) => {
    res.sendFile(path.join(templateDir, 'signup.html'));
});

// Handle user signup (POST)
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists in the database (pseudo-code)
    const userExists = false; // You should check this from your database
    if (userExists) {
        return res.redirect('/signup?error=user_exists');
    }

    // Hash the password using simpleHash (e.g., pbkdf2 or simple hash)
    const hashedPassword = simpleHash(password, true); // Assuming you pass 'true' for secure hash

    // Save the user into your database here (pseudo-code)
    // db.query('INSERT INTO users ...', [username, hashedPassword], ...);

    // Redirect to login after successful signup
    res.redirect('/login');
});

// Logout route
router.get('/logout', (req, res, next) => {
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

// About page route (example dynamic route)
router.get('/about', (req, res) => {
    res.send('About us page');
});

// Error handling for 404 (Not Found)
router.use((req, res) => {
    res.status(404).sendFile(path.join(templateDir, '404.html'));
});

// Error handling for 500 (Internal Server Error)
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
});

export default router;
