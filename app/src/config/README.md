# OAuth 2.0 Authentication Implementation

This directory contains the configuration for OAuth 2.0 authentication with Google and GitHub providers.

## Files

- `passport.js`: Contains the Passport.js configuration for local, Google, and GitHub authentication strategies.
- `db.js`: Database configuration (to be implemented for production use).
- `userAuth.js`: User authentication utilities.

## OAuth Configuration

To use OAuth authentication, you need to set up the following environment variables in your `.env` file:

```
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
```

## Setting Up OAuth Providers

### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set the application type to "Web application"
6. Add authorized redirect URIs (e.g., `http://localhost:3000/auth/google/callback`)
7. Copy the Client ID and Client Secret to your `.env` file

### GitHub OAuth

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the application details
5. Set the Authorization callback URL (e.g., `http://localhost:3000/auth/github/callback`)
6. Register the application
7. Copy the Client ID and generate a Client Secret
8. Add these values to your `.env` file

## Implementation Details

The OAuth implementation uses Passport.js strategies to handle authentication with different providers. When a user authenticates with an OAuth provider, their profile information is retrieved and can be used to create or update a user account in your application's database.

In a production environment, you should implement proper database storage for user accounts and sessions.