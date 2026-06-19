import { DB } from '../db/team-db';
import { Storyworld, User, StoryworldMember } from '../types/index';
import { UserService } from './UserService';

export class StoryworldService {
  static getStoryworlds(userId: string): Storyworld[] {
    const user = UserService.getUser(userId);
    if (user?.role === 'admin') {
      return DB.query(`SELECT * FROM storyworlds`);
    }
    // Return storyworlds owned by user OR where they are a member
    return DB.query(`
      SELECT DISTINCT s.* FROM storyworlds s
      LEFT JOIN storyworld_members sm ON s.id = sm.storyworld_id
      WHERE s.user_id = '${userId}' OR sm.user_id = '${userId}'
    `);
  }

  static getAllStoryworlds(): Storyworld[] {
    return DB.query(`SELECT * FROM storyworlds`);
  }

  static getStoryworld(id: string): Storyworld | undefined {
    const results = DB.query(`SELECT * FROM storyworlds WHERE id = '${id}'`);
    return results[0];
  }

  static createStoryworld(userId: string, id: string, title: string, description?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    
    if (user.role !== 'admin') {
      const worlds = this.getStoryworlds(userId);
      if (user.tier === 'Draftsman' && worlds.length >= 1) {
        throw new Error('Draftsman tier is limited to 1 storyworld. Upgrade to Architect for unlimited storyworlds.');
      }
    }

    DB.execute(`INSERT INTO storyworlds (id, user_id, title, description) VALUES ('${id}', '${userId}', '${title}', '${description || ''}')`);
  }

  static updateStoryworld(id: string, title: string, description?: string): void {
    DB.execute(`UPDATE storyworlds SET title = '${title}', description = '${description || ''}' WHERE id = '${id}'`);
  }

  static addMember(ownerId: string, storyworldId: string, memberId: string, role: string = 'member'): void {
    const user = UserService.getUser(ownerId);
    if (!user) throw new Error('User not found');
    
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Collaborative worldbuilding is only available for Collective tier.');
    }
    
    const storyworld = this.getStoryworld(storyworldId);
    if (user.role !== 'admin' && (!storyworld || storyworld.user_id !== ownerId)) {
      throw new Error('Only the storyworld owner can add members.');
    }
    
    DB.execute(`INSERT INTO storyworld_members (storyworld_id, user_id, role) VALUES ('${storyworldId}', '${memberId}', '${role}')`);
  }

  static getMembers(storyworldId: string): StoryworldMember[] {
    return DB.query(`SELECT * FROM storyworld_members WHERE storyworld_id = '${storyworldId}'`);
  }

  static removeMember(ownerId: string, storyworldId: string, memberId: string): void {
    const user = UserService.getUser(ownerId);
    if (!user) throw new Error('User not found');
    
    const storyworld = this.getStoryworld(storyworldId);
    if (user.role !== 'admin' && (!storyworld || storyworld.user_id !== ownerId)) {
      throw new Error('Only the storyworld owner can remove members.');
    }
    
    DB.execute(`DELETE FROM storyworld_members WHERE storyworld_id = '${storyworldId}' AND user_id = '${memberId}'`);
  }

  static checkAccess(userId: string, storyworldId: string, requiredRole: 'Architect' | 'Draftsman' = 'Draftsman'): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') return;

    const storyworld = this.getStoryworld(storyworldId);
    if (storyworld && storyworld.user_id === userId) return;

    const memberships = DB.query(`SELECT role FROM storyworld_members WHERE storyworld_id = '${storyworldId}' AND user_id = '${userId}'`);
    const membership = memberships[0];
    
    if (!membership) throw new Error('Access denied: Not a member of this storyworld.');

    if (requiredRole === 'Architect' && membership.role !== 'Architect') {
      throw new Error('Access denied: Architect role (Full Access) required for this action.');
    }
  }

  static inviteMember(ownerId: string, storyworldId: string, identifier: string, role: string = 'Draftsman'): void {
    const targetUser = identifier.includes('@') 
      ? UserService.getUserByEmail(identifier) 
      : UserService.getUserByUsername(identifier);
    
    if (!targetUser) {
      throw new Error('User not found');
    }
    
    this.addMember(ownerId, storyworldId, targetUser.id, role);
  }
}
