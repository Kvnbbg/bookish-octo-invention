import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import { findUserById, findUserByUsername } from './userRepository.js';
import { verifyPassword } from '../utils/utils.js';

dotenv.config();

export function configurePassport() {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const passwordIsValid = verifyPassword(password, user.password_salt, user.password_hash);
      if (!passwordIsValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      const user = {
        id: profile.id,
        username: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
        provider: 'google'
      };

      return done(null, user);
    }));
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      const user = {
        id: profile.id,
        username: profile.username,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
        provider: 'github'
      };

      return done(null, user);
    }));
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      if (!user) {
        return done(null, { id, provider: 'oauth' });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });
}

export default passport;
