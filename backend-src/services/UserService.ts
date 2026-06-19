import { DB } from '../db/team-db';
import { User } from '../types/index';

const escape = (str: string) => str.replace(/'/g, "''");

export class UserService {
  static async getUser(userId: string): Promise<User | null> {
    const results = await DB.query(`SELECT * FROM users WHERE id = '${escape(userId)}'`);
    if (results.length === 0) return null;
    return results[0];
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const results = await DB.query(`SELECT * FROM users WHERE email = '${escape(email)}'`);
    return results.length > 0 ? results[0] : null;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const results = await DB.query(`SELECT * FROM users WHERE username = '${escape(username)}'`);
    return results.length > 0 ? results[0] : null;
  }

  static async getAllUsers(): Promise<User[]> {
    return await DB.query(`SELECT id, username, email, tier, role, created_at FROM users`);
  }

  static async createUser(id: string, username: string, tier: string, email?: string, password?: string, role: string = 'user'): Promise<void> {
    const emailVal = email ? `'${escape(email)}'` : 'NULL';
    const passwordVal = password ? `'${escape(password)}'` : 'NULL';
    await DB.execute(`INSERT INTO users (id, username, tier, email, password, role) VALUES ('${escape(id)}', '${escape(username)}', '${escape(tier)}', ${emailVal}, ${passwordVal}, '${escape(role)}')`);
  }

  static async updateProfile(userId: string, data: { username?: string, email?: string, avatar?: string, banner?: string }): Promise<void> {
    const updates: string[] = [];
    if (data.username) updates.push(`username = '${escape(data.username)}'`);
    if (data.email) updates.push(`email = '${escape(data.email)}'`);
    if (data.avatar !== undefined) updates.push(`avatar = ${data.avatar ? `'${escape(data.avatar)}'` : 'NULL'}`);
    if (data.banner !== undefined) updates.push(`banner = ${data.banner ? `'${escape(data.banner)}'` : 'NULL'}`);
    
    if (updates.length > 0) {
      await DB.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = '${escape(userId)}'`);
    }
  }

  static async updateSecurity(userId: string, data: { password?: string }): Promise<void> {
    if (data.password) {
      await DB.execute(`UPDATE users SET password = '${escape(data.password)}' WHERE id = '${escape(userId)}'`);
    }
  }

  static async updateCustomization(userId: string, customization: any): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');
    await DB.execute(`UPDATE users SET customization = '${escape(JSON.stringify(customization))}' WHERE id = '${escape(userId)}'`);
  }
}
