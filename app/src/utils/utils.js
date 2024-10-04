import crypto from 'crypto'; // Import the crypto module
import users from '../routes/user.js'

// Improved simpleHash function with multiple hashing strategies
export function simpleHash(data, useSecureHash = false) {
    console.log('simpleHash defined:', typeof simpleHash); // Log function definition for debugging

    if (useSecureHash) {
        // Generate a random salt if not provided
        const salt = crypto.randomBytes(16).toString('hex');
        
        // Secure hashing using PBKDF2
        const hash = crypto.pbkdf2Sync(data, salt, 310000, 64, 'sha512').toString('hex');
        return { salt, hash }; // Return both salt and hashed value
    } else {
        // Simple hash logic
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash += data.charCodeAt(i);
        }
        return hash.toString(16); // Return simple hash as hexadecimal string
    }
}
