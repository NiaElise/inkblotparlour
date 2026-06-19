import { DB } from '../db/team-db';
import { WriterCircle, CircleMember, WritingRoom } from '../types/index';
import { UserService } from './UserService';
import { StoryworldService } from './StoryworldService';

export class CircleService {
  static getCircles(): WriterCircle[] {
    return DB.query(`SELECT * FROM writer_circles`);
  }

  static createCircle(userId: string, id: string, name: string, description?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Only Collective tier members can create Writer Circles.');
    }
    DB.execute(`INSERT INTO writer_circles (id, creator_id, name, description) VALUES ('${id}', '${userId}', '${name}', '${description || ''}')`);
    // Creator is automatically a member
    this.joinCircle(userId, id);
  }

  static joinCircle(userId: string, circle_id: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Draftsman tier members cannot join Writer Circles. Upgrade to Architect.');
    }
    DB.execute(`INSERT INTO circle_members (circle_id, user_id) VALUES ('${circle_id}', '${userId}')`);
  }

  static getMembers(circleId: string): CircleMember[] {
    return DB.query(`SELECT * FROM circle_members WHERE circle_id = '${circleId}'`);
  }

  static createWritingRoom(userId: string, circleId: string, id: string, name: string, description?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    
    const circle = DB.query(`SELECT creator_id FROM writer_circles WHERE id = '${circleId}'`)[0];
    if (!circle) throw new Error('Circle not found');

    // Only Collective tier can create writing rooms, and must be a member (or creator) of the circle
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Writing Rooms are only available for Collective tier.');
    }

    const isMember = DB.query(`SELECT 1 FROM circle_members WHERE circle_id = '${circleId}' AND user_id = '${userId}'`)[0];
    if (!isMember && user.role !== 'admin') {
      throw new Error('Only circle members can create writing rooms.');
    }

    const storyworldId = 'world_' + Math.random().toString(36).substring(2, 11);
    StoryworldService.createStoryworld(userId, storyworldId, `${name} (Room)`, description);

    // Automatically add all circle members to the storyworld?
    // Or maybe just the creator for now, and they can invite others.
    // Actually, "Writing Rooms" are collaboration spaces for the circle.
    // Let's add all current members.
    const members = this.getMembers(circleId);
    for (const member of members) {
      if (member.user_id !== userId) {
        StoryworldService.addMember(userId, storyworldId, member.user_id, 'Architect');
      }
    }

    DB.execute(`INSERT INTO writing_rooms (id, circle_id, name, description, storyworld_id) VALUES ('${id}', '${circleId}', '${name}', '${description || ''}', '${storyworldId}')`);
  }

  static getWritingRooms(circleId: string): WritingRoom[] {
    return DB.query(`SELECT * FROM writing_rooms WHERE circle_id = '${circleId}'`);
  }
}
