import { DB } from '../db/team-db';
import { Storyworld, User, StoryworldMember } from '../types/index';
import { UserService } from './UserService';

export class StoryworldService {
  static getStoryworlds(userId: string): Storyworld[] {
    // Return storyworlds owned by user OR where they are a member
    return DB.query(`
      SELECT DISTINCT s.* FROM storyworlds s
      LEFT JOIN storyworld_members sm ON s.id = sm.storyworld_id
      WHERE s.user_id = '${userId}' OR sm.user_id = '${userId}'
    `);
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

  static addMember(ownerId: string, storyworldId: string, memberId: string, role: string = 'member'): void {
    const user = UserService.getUser(ownerId);
    if (!user) throw new Error('User not found');

    if (user.tier !== 'Collective') {
      throw new Error('Collaborative worldbuilding is only available for Collective tier.');
    }

    const storyworld = this.getStoryworld(storyworldId);
    if (!storyworld || storyworld.user_id !== ownerId) {
      throw new Error('Only the storyworld owner can add members.');
    }

    DB.execute(`INSERT INTO storyworld_members (storyworld_id, user_id, role) VALUES ('${storyworldId}', '${memberId}', '${role}')`);
  }

  static getMembers(storyworldId: string): StoryworldMember[] {
    return DB.query(`SELECT * FROM storyworld_members WHERE storyworld_id = '${storyworldId}'`);
  }
}
