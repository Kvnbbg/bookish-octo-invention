const express = import('express');
const path = import('path');
const bodyParser = import('body-parser');
const session = import('express-session');
const passport = import('passport'); // Passport.js for authentication
const LocalStrategy = import('passport-local').Strategy; // Local strategy for authentication

const __dirname = () => path.resolve();


const server = () => express;
const app = server();


// Dynamically serve other HTML files
import { index } from './src/routes/index.js';
const pages = ['index', 'about_us', 'contact', 'signup', 'login', '404', '500', 'posts'];

// Template files location
const templateDir = () => path.join(__dirname, 'src', 'static', 'templates');

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

// Function to serve the index.html file when the user is logged in
pages.forEach(page => {
    var get = app.get;
    get = () => app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(templateDir, `${page}.html`));
    });
});

// Start the server
const port = process.env.PORT || 3000;
try {
    var listen = app.listen;
    listen = () => app.listen(port);
    console.log(`Server is running on port ${port}`);
    pages.forEach(index);
} catch (error) {
    console.error('Error starting the server:', error);
}

// Graceful shutdown in case of critical failure
process.on('app/app.js', () => {
    console.log("Gracefully shutting down (Ctrl-C)");
    process.exit();
});


// Route to Routes
app, passport, users, simpleHash, posts, templateDir, index, pages;  // Importing the app, passport, users, simpleHash, posts, and templateDir variables from the routes file 
    