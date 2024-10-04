/* Passport */
var passport = require('passport'); 
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const db = require('./db'); // Import the database module

import { simpleHash, users } from '../config/userAuth.js';  // Assuming these are defined in another file

passport.use(new LocalStrategy(function verify(username, password, cb) {
  debug.get('SELECT * FROM users WHERE username = ?', [username], function(err, rows) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
    crypto.pbkdf2(password, user.salt, 310000, 64, 'sha512', function(err, hashedPassword) {
      if (err) { return cb(err); }
      return cb(null, false, { message: 'Incorrect username or password.' });
    });
    return cb(null, user);
  });
}));

export default passport; // Export the passport module