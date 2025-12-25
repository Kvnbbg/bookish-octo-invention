import { createPasswordHash } from '../utils/utils.js';

const usersByUsername = new Map();
const usersById = new Map();
let nextId = 1;

export function getMemoryUserByUsername(username) {
  return usersByUsername.get(username) || null;
}

export function getMemoryUserById(id) {
  return usersById.get(Number(id)) || null;
}

export function addMemoryUser(username, password) {
  if (usersByUsername.has(username)) {
    const error = new Error('USERNAME_EXISTS');
    error.code = 'USERNAME_EXISTS';
    throw error;
  }

  const { hash, salt } = createPasswordHash(password);
  const user = {
    id: nextId++,
    username,
    password_hash: hash,
    password_salt: salt,
    source: 'memory'
  };

  usersByUsername.set(username, user);
  usersById.set(user.id, user);
  return user;
}
