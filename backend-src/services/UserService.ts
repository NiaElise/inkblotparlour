import { DB } from '../db/team-db';
import { User } from '../types/index';

export class UserService {
  static getUser(userId: string): User | null {
    const results = DB.query(`SELECT * FROM users WHERE id = '${userId}'`);
    return results.length > 0 ? results[0] : null;
  }

  static createUser(id: string, username: string, tier: string): void {
    DB.execute(`INSERT INTO users (id, username, tier) VALUES ('${id}', '${username}', '${tier}')`);
  }

  static updateCustomization(userId: string, customization: any): void {
    const user = this.getUser(userId);
    if (!user) throw new Error('User not found');

    if (user.tier !== 'Collective') {
      throw new Error('Aesthetic Customization is only available for the Collective tier.');
    }

    DB.execute(`UPDATE users SET customization = '${JSON.stringify(customization)}' WHERE id = '${userId}'`);
  }
}
