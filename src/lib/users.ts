import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  mustChangePassword: boolean;
  role: string;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export function getUsers(): User[] {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function updateUser(updatedUser: User): void {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }
}
