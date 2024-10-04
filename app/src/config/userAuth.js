import crypto from 'crypto';
import db from './db'; // Import the database module

// Hashing function to securely store passwords
export function simpleHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

// Verify if user exists and password is correct
export function verifyUser(username, password, done) {
  db.get('SELECT * FROM users WHERE username = ?', [username], function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    // Compare provided password with stored hashed password
    const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 310000, 64, 'sha512').toString('hex');
    if (user.hash !== hashedPassword) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    return done(null, user); // Successful login
  });
}

// Simple function to register a new user in the database
export function registerUser(username, password, done) {
  const { salt, hash } = simpleHash(password);

  db.run('INSERT INTO users (username, salt, hash) VALUES (?, ?, ?)', [username, salt, hash], function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
}

// Use math to hash and verify passwords (simple example, not for production)
const simpleHash = (password) => {
    return Array.from(password).reduce((acc, char) => acc + char.charCodeAt(0), 0);
};