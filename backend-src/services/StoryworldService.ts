import { DB } from '../db/team-db';
import { Storyworld, User, StoryworldMember } from '../types/index';
import { UserService } from './UserService';

const escape = (str: string) => str.replace(/'/g, "''");

export class StoryworldService {
  static async getStoryworlds(userId: string): Promise<Storyworld[]> {
    const user = await UserService.getUser(userId);
    if (user?.role === 'admin') {
      return await DB.query(`SELECT * FROM storyworlds`);
    }
    // Return storyworlds owned by user OR where they are a member
    return await DB.query(`
      SELECT DISTINCT s.* FROM storyworlds s
      LEFT JOIN storyworld_members sm ON s.id = sm.storyworld_id
      WHERE s.user_id = '${escape(userId)}' OR sm.user_id = '${escape(userId)}'
    `);
  }

  static async getAllStoryworlds(): Promise<Storyworld[]> {
    return await DB.query(`SELECT * FROM storyworlds`);
  }

  static async getStoryworld(id: string): Promise<Storyworld | undefined> {
    const results = await DB.query(`SELECT * FROM storyworlds WHERE id = '${escape(id)}'`);
    return results[0];
  }

  static async createStoryworld(userId: string, id: string, title: string, description?: string): Promise<void> {
    const user = await UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    
    if (user.role !== 'admin') {
      const worlds = await this.getStoryworlds(userId);
      if (user.tier === 'Draftsman' && worlds.length >= 1) {
        throw new Error('Draftsman tier is limited to 1 storyworld. Upgrade to Architect for unlimited storyworlds.');
      }
    }

    await DB.execute(`INSERT INTO storyworlds (id, user_id, title, description) VALUES ('${escape(id)}', '${escape(userId)}', '${escape(title)}', '${escape(description || '')}')`);
  }

  static async updateStoryworld(id: string, title: string, description?: string): Promise<void> {
    await DB.execute(`UPDATE storyworlds SET title = '${escape(title)}', description = '${escape(description || '')}' WHERE id = '${escape(id)}'`);
  }

  static async addMember(ownerId: string, storyworldId: string, memberId: string, role: string = 'member'): Promise<void> {
    const user = await UserService.getUser(ownerId);
    if (!user) throw new Error('User not found');
    
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Collaborative worldbuilding is only available for Collective tier.');
    }
    
    const storyworld = await this.getStoryworld(storyworldId);
    if (user.role !== 'admin' && (!storyworld || storyworld.user_id !== ownerId)) {
      throw new Error('Only the storyworld owner can add members.');
    }
    
    await DB.execute(`INSERT INTO storyworld_members (storyworld_id, user_id, role) VALUES ('${escape(storyworldId)}', '${escape(memberId)}', '${escape(role)}')`);
  }

  static async getMembers(storyworldId: string): Promise<StoryworldMember[]> {
    return await DB.query(`SELECT * FROM storyworld_members WHERE storyworld_id = '${escape(storyworldId)}'`);
  }

  static async removeMember(ownerId: string, storyworldId: string, memberId: string): Promise<void> {
    const user = await UserService.getUser(ownerId);
    if (!user) throw new Error('User not found');
    
    const storyworld = await this.getStoryworld(storyworldId);
    if (user.role !== 'admin' && (!storyworld || storyworld.user_id !== ownerId)) {
      throw new Error('Only the storyworld owner can remove members.');
    }
    
    await DB.execute(`DELETE FROM storyworld_members WHERE storyworld_id = '${escape(storyworldId)}' AND user_id = '${escape(memberId)}'`);
  }

  static async checkAccess(userId: string, storyworldId: string, requiredRole: 'Architect' | 'Draftsman' = 'Draftsman'): Promise<void> {
    const user = await UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') return;

    const storyworld = await this.getStoryworld(storyworldId);
    if (storyworld && storyworld.user_id === userId) return;

    const memberships = await DB.query(`SELECT role FROM storyworld_members WHERE storyworld_id = '${escape(storyworldId)}' AND user_id = '${escape(userId)}'`);
    const membership = memberships[0];
    
    if (!membership) throw new Error('Access denied: Not a member of this storyworld.');

    if (requiredRole === 'Architect' && membership.role !== 'Architect') {
      throw new Error('Access denied: Architect role (Full Access) required for this action.');
    }
  }

  static async inviteMember(ownerId: string, storyworldId: string, identifier: string, role: string = 'Draftsman'): Promise<void> {
    const targetUser = identifier.includes('@') 
      ? await UserService.getUserByEmail(identifier) 
      : await UserService.getUserByUsername(identifier);
    
    if (!targetUser) {
      throw new Error('User not found');
    }
    
    await this.addMember(ownerId, storyworldId, targetUser.id, role);
  }
}
