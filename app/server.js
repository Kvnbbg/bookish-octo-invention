import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport'; // Passport.js for authentication
import { Strategy as LocalStrategy } from 'passport-local'; // Local strategy for authentication
import routes from '..//app/src/routes/routes.js' // Routes for the application
import { simpleHash } from '../app/src/utils/index.js'; // Assuming this is defined correctly
// Handle __dirname in ES module
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Dummy user credentials (for demo purposes)
const users = [
    { username: 'admin', password: 'password' },
    { username: 'user', password: 'password' },
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Posts by users (for demo purposes)
const posts = [
    { title: 'Post 1', content: 'This is the first post by admin', date: new Date() },
    { title: 'Post 2', content: 'This is the second post by user', date: new Date() },
    { title: 'Post 3', content: 'This is the third post by user1', date: new Date() },
    { title: 'Post 4', content: 'This is the fourth post by user2', date: new Date() }
];

// Using simple hashing
const simpleHashValue = simpleHash('example data');
console.log('Simple Hash:', simpleHashValue);

// Using secure hashing
const { salt, hash } = simpleHash('examplePassword', true);
console.log('Secure Hash:', hash, 'Salt:', salt);


// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
    console.log("Gracefully shutting down (Ctrl-C)");
    process.exit();
});

// Use the routes
app.use('/', routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;