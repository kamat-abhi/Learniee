import { readJSON, writeJSON } from '../utils/jsonStore.js';
import type { User } from '../types/index.js';

const FILE = 'users.json';

export function getAllUsers(): User[] {
  return readJSON<User>(FILE);
}

export function findUserByEmail(email: string): User | undefined {
  const users = getAllUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const users = getAllUsers();
  return users.find((user) => user.id === id);
}

export function createUser({
  name,
  email,
  passwordHash,
}: Pick<User, 'name' | 'email' | 'passwordHash'>): User {
  const users = getAllUsers();

  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeJSON(FILE, users);

  return newUser;
}
