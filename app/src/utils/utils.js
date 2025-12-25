import crypto from 'crypto';

// Improved simpleHash function with multiple hashing strategies
export function simpleHash(data, useSecureHash = false) {
  if (useSecureHash) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, salt, 310000, 64, 'sha512').toString('hex');
    return { salt, hash };
  }

  data = String(data);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash += data.charCodeAt(i);
  }
  return hash.toString(16);
}

export function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  if (!salt || !hash) {
    return false;
  }
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha512').toString('hex');
  if (hashedPassword.length !== hash.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashedPassword, 'hex'));
}
