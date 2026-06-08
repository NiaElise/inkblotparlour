import { DB } from '../db/team-db';
import { Storyworld, User } from '../types/index';
import { UserService } from './UserService';

export class StoryworldService {
  static getStoryworlds(userId: string): Storyworld[] {
    return DB.query(`SELECT * FROM storyworlds WHERE user_id = '${userId}'`);
  }

  static getStoryworld(id: string): Storyworld | undefined {
    const results = DB.query(`SELECT * FROM storyworlds WHERE id = '${id}'`);
    return results[0];
  }

  static createStoryworld(userId: string, id: string, title: string, description?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');

    const worlds = this.getStoryworlds(userId);

    if (user.tier === 'Draftsman' && worlds.length >= 1) {
      throw new Error('Draftsman tier is limited to 1 storyworld. Upgrade to Architect for unlimited storyworlds.');
    }

    DB.execute(`INSERT INTO storyworlds (id, user_id, title, description) VALUES ('${id}', '${userId}', '${title}', '${description || ''}')`);
  }

  static updateStoryworld(id: string, title: string, description?: string): void {
    DB.execute(`UPDATE storyworlds SET title = '${title}', description = '${description || ''}' WHERE id = '${id}'`);
  }
}
