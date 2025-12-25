import express from 'express';
import path from 'path';
import passport from 'passport';
import { fileURLToPath } from 'url';
import rateLimiter from '../middleware/rateLimiter.js';
import { createUser, findUserByUsername } from '../config/userRepository.js';

const router = express.Router();

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, '..', 'templates');

router.get('/', (req, res) => {
  try {
    res.sendFile(path.join(templateDir, 'landing.html'));
  } catch (error) {
    console.error('Error serving the landing page:', error);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
  }
});

router.get('/app', ensureAuthenticated, (req, res) => {
  try {
    res.sendFile(path.join(templateDir, 'index.html'));
  } catch (error) {
    console.error('Error serving the index page:', error);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
  }
});

router.get('/index', ensureAuthenticated, (req, res) => {
  try {
    res.sendFile(path.join(templateDir, 'index.html'));
  } catch (error) {
    console.error('Error serving the index page:', error);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
  }
});

router.get('/login', (req, res) => {
  try {
    res.sendFile(path.join(templateDir, 'login.html'));
  } catch (error) {
    console.error('Error serving the login page:', error);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
  }
});

router.post('/login/password', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login?error=invalid_credentials');
    }
    return req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      const redirectTo = req.session.returnTo || '/app';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next);
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/login?error=google_auth_failed'
  })
);

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/app',
    failureRedirect: '/login?error=github_auth_failed'
  })
);

router.get('/signup', (req, res) => {
  try {
    res.sendFile(path.join(templateDir, 'signup.html'));
  } catch (error) {
    console.error('Error serving the signup page:', error);
    res.status(500).sendFile(path.join(templateDir, '500.html'));
  }
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/signup?error=missing_fields');
  }

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.redirect('/signup?error=user_exists');
  }

  try {
    const user = await createUser(username, password);
    return req.logIn(user, (err) => {
      if (err) {
        return res.redirect('/login?error=login_failed');
      }
      return res.redirect('/app');
    });
  } catch (error) {
    if (error.code === 'USERNAME_EXISTS') {
      return res.redirect('/signup?error=user_exists');
    }
    console.error('Signup error:', error);
    return res.redirect('/signup?error=server_error');
  }
});

router.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.session.destroy((sessionError) => {
      if (sessionError) {
        console.error('Error destroying session:', sessionError);
      }
      res.redirect('/login');
    });
  });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(templateDir, 'profile.html'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect('/signup?auth=required');
}

router.get('/about', (req, res) => {
  res.sendFile(path.join(templateDir, 'about_us.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(templateDir, 'contact.html'));
});

router.use((req, res) => {
  res.status(404).sendFile(path.join(templateDir, '404.html'));
});

router.use((err, req, res, next) => {
  console.error('Internal server error:', err.stack);
  res.status(500).sendFile(path.join(templateDir, '500.html'));
});

export default router;
