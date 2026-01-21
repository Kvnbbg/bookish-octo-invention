import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import routes from '../app/src/routes/routes.js';
import gamificationRouter from '../app/src/routes/gamification.js';
import crmRouter from '../app/src/routes/crm.js';
import { configurePassport } from '../app/src/config/passport.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSTANTS = {
    defaultPort: 3000,
    sessionMaxAgeMs: 24 * 60 * 60 * 1000,
    bindAddress: '0.0.0.0',
};

const logger = {
    info: (message, meta) => console.info(message, meta ?? ''),
    warn: (message, meta) => console.warn(message, meta ?? ''),
    error: (message, meta) => console.error(message, meta ?? ''),
};

/**
 * Returns a session secret for signing cookies.
 * @returns {string} Session secret.
 */
const getSessionSecret = () => {
    const sessionSecret = process.env.SESSION_SECRET;
    if (sessionSecret) {
        return sessionSecret;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('SESSION_SECRET must be set in production.');
    }

    logger.warn('SESSION_SECRET is not set. Using an insecure default for non-production.');
    return 'development-insecure-secret';
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../app/src/static')));

app.use(session({
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: CONSTANTS.sessionMaxAgeMs,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/', routes);
app.use('/api/gamification', gamificationRouter);
app.use('/api/crm', crmRouter);

app.use((err, req, res, next) => {
    logger.error('An unexpected error occurred:', err);
    res.status(500).send('Internal Server Error');
});

process.on('SIGINT', () => {
    logger.info('Gracefully shutting down (Ctrl-C)');
    process.exit();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
});

const shouldStartServer = process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true';

if (shouldStartServer) {
    const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
    const port = Number.isNaN(parsedPort) ? CONSTANTS.defaultPort : parsedPort;
    app.listen(port, CONSTANTS.bindAddress, () => {
        logger.info(`Server is running on port ${port}`);
    }).on('error', (err) => {
        logger.error('Server error:', err);
    });
}

export default app;
