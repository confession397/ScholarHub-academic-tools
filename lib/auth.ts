import { cookies } from 'next/headers';
import { getDb } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const db = getDb();
  const id = uuidv4();
  const hashedPassword = await hashPassword(password);

  const stmt = db.prepare(`
    INSERT INTO users (id, email, password, name)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(id, email, hashedPassword, name || null);

  return {
    id,
    email,
    name: name || null,
    avatar: null,
    bio: null,
    created_at: new Date().toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as User | undefined;
  return user || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id) as User | undefined;
  return user || null;
}

export async function updateUser(id: string, data: Partial<Pick<User, 'name' | 'avatar' | 'bio'>>): Promise<User | null> {
  const db = getDb();
  const updates: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.avatar !== undefined) {
    updates.push('avatar = ?');
    values.push(data.avatar);
  }
  if (data.bio !== undefined) {
    updates.push('bio = ?');
    values.push(data.bio);
  }

  if (updates.length === 0) return getUserById(id);

  values.push(id);
  const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getUserById(id);
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) return null;
  return getUserById(session.value);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
