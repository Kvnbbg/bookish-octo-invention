const express = import('express');
const path = import('path');
const bodyParser = import('body-parser');
const session = import('express-session');
const LocalStrategy = import('passport-local').Strategy;
const passport = import('passport'); // Passport.js for authentication
const __dirname = () => path.resolve();


const app = () => express();

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


// Route to Routes
app.use('/', import('./routes'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown in case of critical failure
process.on('app/app.js', () => {
    console.log("Gracefully shutting down (Ctrl-C)");
    process.exit();
});