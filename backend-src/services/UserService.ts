import { DB } from '../db/team-db';
import { User } from '../types/index';

export class UserService {
  static getUser(userId: string): User | null {
    const results = DB.query(`SELECT * FROM users WHERE id = '${userId}'`);
    return results.length > 0 ? results[0] : null;
  }

  static getUserByEmail(email: string): User | null {
    const results = DB.query(`SELECT * FROM users WHERE email = '${email}'`);
    return results.length > 0 ? results[0] : null;
  }

  static getAllUsers(): User[] {
    return DB.query(`SELECT id, username, email, tier, role, created_at FROM users`);
  }

  static createUser(id: string, username: string, tier: string, email?: string, password?: string, role: string = 'user'): void {
    const emailVal = email ? `'${email}'` : 'NULL';
    const passwordVal = password ? `'${password}'` : 'NULL';
    DB.execute(`INSERT INTO users (id, username, tier, email, password, role) VALUES ('${id}', '${username}', '${tier}', ${emailVal}, ${passwordVal}, '${role}')`);
  }

  static updateCustomization(userId: string, customization: any): void {
    const user = this.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Aesthetic Customization is only available for the Collective tier.');
    }
    DB.execute(`UPDATE users SET customization = '${JSON.stringify(customization)}' WHERE id = '${userId}'`);
  }
}
