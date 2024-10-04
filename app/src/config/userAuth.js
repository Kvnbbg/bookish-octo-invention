import crypto from 'crypto';
import db from './db.js'; // AWS-based database connection
// server.js
import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { simpleHash } from '../utils/index.js';
 

// Verify if user exists and authenticate password
export function verifyUser(username, password, done) {
  db.query('SELECT * FROM users WHERE username = ?', [username], function (err, results) {
    if (err) {
      return done(new Error('Database error occurred while verifying user.'));
    }

    if (!results || results.length === 0) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    const user = results[0];
    
    try {
      const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 310000, 64, 'sha512').toString('hex');
      if (user.hash !== hashedPassword) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
    } catch (cryptoError) {
      return done(new Error('Error during password hashing.'));
    }

    return done(null, user); // Successful login
  });
}

// Register a new user with salted and hashed password
export function registerUser(username, password, done) {
  const { salt, hash } = simpleHash(password);

  db.query('INSERT INTO users (username, salt, hash) VALUES (?, ?, ?)', [username, salt, hash], function (err) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') { // Handle duplicate username errors
        return done(null, false, { message: 'Username already exists.' });
      }
      return done(new Error('Database error occurred during registration.'));
    }

    return done(null); // Successfully registered
  });
}

// Simple check if username exists (optional)
export function checkUsernameExists(username, done) {
  db.query('SELECT username FROM users WHERE username = ?', [username], function (err, results) {
    if (err) {
      return done(new Error('Database error occurred while checking username.'));
    }

    if (results && results.length > 0) {
      return done(null, true); // Username exists
    }

    return done(null, false); // Username does not exist
  });
}
