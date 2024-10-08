// Import required modules and packages
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport'; // Passport.js for authentication
import { Strategy as LocalStrategy } from 'passport-local'; // Local strategy for authentication
import routes from '../app/src/routes/routes.js'; // Import your custom routes
import { simpleHash } from '../app/src/utils/index.js'; // Hashing function for passwords
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // For loading environment variables

// Load environment variables from the .env file
dotenv.config(); 

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware setup
// Serve static files from the 'static' directory for static resources like CSS, images, etc.
app.use(express.static(path.join(__dirname, '../app/src/static')));

// Parse incoming request bodies in a middleware before handlers, available under req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session management configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',  // It's important to keep this key secure
    resave: false,  // Prevents unnecessary session data from being saved if nothing changed
    saveUninitialized: false  // Ensures no session is saved for unauthenticated users
}));

// Passport initialization for handling authentication
app.use(passport.initialize());
app.use(passport.session());

// Dummy user credentials for demonstration purposes
// Ideally, these should come from a database in a production environment
const users = [
    { username: 'admin', password: simpleHash('password') },
    { username: 'user', password: simpleHash('password') },
    { username: 'user1', password: simpleHash('password1') },
    { username: 'user2', password: simpleHash('password2') }
];

// Set up Passport Local Strategy for authentication
passport.use(new LocalStrategy(
    function (username, password, done) {
        try {
            const user = users.find(user => user.username === username);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== simpleHash(password)) {  // Password check
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user); // User authenticated successfully
        } catch (error) {
            return done(error); // Handle unexpected errors
        }
    }
));

// Serialize user data to store in session
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// Deserialize user data from the session for retrieval
passport.deserializeUser((username, done) => {
    try {
        const user = users.find(user => user.username === username);
        done(null, user || false);
    } catch (error) {
        done(error, false); // Error handling during deserialization
    }
});

// Use routes from the routes.js file for handling different endpoints
app.use('/', routes);

// Catch-all error handler for debugging
app.use((err, req, res, next) => {
    console.error('An unexpected error occurred:', err);
    res.status(500).send('Internal Server Error');
});

// Graceful shutdown on Ctrl+C to handle process termination safely
process.on('SIGINT', () => {
    console.log('Gracefully shutting down (Ctrl-C)');
    process.exit();
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server with improved error handling and debugging
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    console.error('Server error:', err); // Error handling during server startup
});

export default app;
