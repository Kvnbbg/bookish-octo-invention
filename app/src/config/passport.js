// Import required modules
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { simpleHash } from '../utils/utils.js';

// Load environment variables
dotenv.config();

// Dummy user database (replace with actual database in production)
const users = [
    { id: 1, username: 'admin', password: simpleHash('password') },
    { id: 2, username: 'user', password: simpleHash('password') },
    { id: 3, username: 'user1', password: simpleHash('password1') },
    { id: 4, username: 'user2', password: simpleHash('password2') }
];

// Configure Passport strategies
export function configurePassport() {
    // Local Strategy
    passport.use(new LocalStrategy(
        function (username, password, done) {
            try {
                const user = users.find(user => user.username === username);
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.password !== simpleHash(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        // In a production app, you would look for the user in your database
        // If user exists, return the user
        // If not, create a new user with the profile information
        
        // For this example, we'll create a simple user object
        const user = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            provider: 'google'
        };
        
        return done(null, user);
    }));

    // GitHub OAuth Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        // Similar to Google strategy, in production you would:
        // 1. Check if the user exists in your database
        // 2. If not, create a new user with the profile information
        
        const user = {
            id: profile.id,
            username: profile.username,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
            provider: 'github'
        };
        
        return done(null, user);
    }));

    // Serialize user to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from the session
    passport.deserializeUser((id, done) => {
        try {
            // In production, you would query your database
            const user = users.find(user => user.id === id);
            
            // If user not found in local users, check if it's an OAuth user
            if (!user) {
                // This is a simplified example. In production, you would query your database
                // for users authenticated via OAuth
                return done(null, { id: id, provider: 'oauth' });
            }
            
            done(null, user || false);
        } catch (error) {
            done(error, false);
        }
    });
}

export default passport;