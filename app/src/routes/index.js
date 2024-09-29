// This file is in the foler routes and is named routes.js

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Route to serve the index.html file
app.get('/', (req, res) => {
  try {
    var get = app.get;
    get = () => app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(templateDir, `${page}.html`));
    });
} catch (error) {
    console.error(`Error serving ${page} page:`, error);
}
});

// Login route
app.get('/login', (req, res, next) => {
  const error = req.query.error;
  res.render('login', { error });
  res.sendFile(path.join(templateDir, 'login.html'));
});

app.post('/login/password', async (req, res) => {
  const { username, password } = req.body;
  if (users[username] && simpleHash(users[username]) === simpleHash(password)) {
      req.session.loggedIn = true;
      req.session.username = username;
      req.session.save(() => {
          res.redirect('/');
      });
      res.redirect('/');
  } else {
      res.redirect('/login?error=invalid_credentials');
  }
});

app.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?error=invalid_credentials'
}));

// Signup route
app.get('/signup', (req, res) => {
  res.sendFile(path.join(templateDir, 'signup.html'));
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
      res.redirect('/signup?error=user_exists');
  }
  users[username] = password;
  res.redirect('/login');
});



// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
      }
      res.redirect('/login');
  });
});

// Error Handling for 404 - Page Not Found
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(templateDir, '404.html'));
});

// Error Handling for other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(templateDir, '500.html'));
});

export default index;