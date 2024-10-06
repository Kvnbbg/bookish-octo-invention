import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport'; // Passport.js for authentication
import { Strategy as LocalStrategy } from 'passport-local'; // Local strategy for authentication
import routes from '../app/src/routes/routes.js'; // Corrected route import
import { simpleHash } from '../app/src/utils/index.js'; // Assuming this is defined correctly
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';  // Use dotenv for environment variables

dotenv.config();  // Load environment variables from .env

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',  // Use env variable for secret
    resave: false,
    saveUninitialized: false,  // Don't create session until something is stored
}));

app.use(passport.initialize());
app.use(passport.session());

// Dummy user credentials (for demo purposes) - Replace with a proper database in production
const users = [
    { username: 'admin', password: simpleHash('password') },
    { username: 'user', password: simpleHash('password') },
    { username: 'user1', password: simpleHash('password1') },
    { username: 'user2', password: simpleHash('password2') }
];

// Passport Local Strategy for user authentication
passport.use(new LocalStrategy(
    function (username, password, done) {
        const user = users.find(user => user.username === username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== simpleHash(password)) {  // Assuming simpleHash is synchronous
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// Deserialize user from session
passport.deserializeUser((username, done) => {
    const user = users.find(user => user.username === username);
    done(null, user || false);
});

// Use routes from the routes.js file
app.use('/', routes);

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
    console.log("Gracefully shutting down (Ctrl-C)");
    process.exit();
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
