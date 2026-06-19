import { DB } from '../db/team-db';
import { WriterCircle, CircleMember, WritingRoom } from '../types/index';
import { UserService } from './UserService';
import { StoryworldService } from './StoryworldService';

const escape = (str: string) => str.replace(/'/g, "''");

export class CircleService {
  static async getCircles(): Promise<WriterCircle[]> {
    return await DB.query(`SELECT * FROM writer_circles`);
  }

  static async createCircle(userId: string, id: string, name: string, description?: string): Promise<void> {
    const user = await UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Only Collective tier members can create Writer Circles.');
    }
    await DB.execute(`INSERT INTO writer_circles (id, creator_id, name, description) VALUES ('${escape(id)}', '${escape(userId)}', '${escape(name)}', '${escape(description || '')}')`);
    // Creator is automatically a member
    await this.joinCircle(userId, id);
  }

  static async joinCircle(userId: string, circle_id: string): Promise<void> {
    const user = await UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Draftsman tier members cannot join Writer Circles. Upgrade to Architect.');
    }
    await DB.execute(`INSERT INTO circle_members (circle_id, user_id) VALUES ('${escape(circle_id)}', '${escape(userId)}')`);
  }

  static async getMembers(circleId: string): Promise<CircleMember[]> {
    return await DB.query(`SELECT * FROM circle_members WHERE circle_id = '${escape(circleId)}'`);
  }

  static async createWritingRoom(userId: string, circleId: string, id: string, name: string, description?: string): Promise<void> {
    const user = await UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    
    const circles = await DB.query(`SELECT creator_id FROM writer_circles WHERE id = '${escape(circleId)}'`);
    const circle = circles[0];
    if (!circle) throw new Error('Circle not found');

    // Only Collective tier can create writing rooms, and must be a member (or creator) of the circle
    if (user.tier !== 'Collective' && user.role !== 'admin') {
      throw new Error('Writing Rooms are only available for Collective tier.');
    }

    const membersInCircle = await DB.query(`SELECT 1 FROM circle_members WHERE circle_id = '${escape(circleId)}' AND user_id = '${escape(userId)}'`);
    const isMember = membersInCircle[0];
    if (!isMember && user.role !== 'admin') {
      throw new Error('Only circle members can create writing rooms.');
    }

    const storyworldId = 'world_' + Math.random().toString(36).substring(2, 11);
    await StoryworldService.createStoryworld(userId, storyworldId, `${name} (Room)`, description);

    // Automatically add all circle members to the storyworld?
    const members = await this.getMembers(circleId);
    for (const member of members) {
      if (member.user_id !== userId) {
        await StoryworldService.addMember(userId, storyworldId, member.user_id, 'Architect');
      }
    }

    await DB.execute(`INSERT INTO writing_rooms (id, circle_id, name, description, storyworld_id) VALUES ('${escape(id)}', '${escape(circleId)}', '${escape(name)}', '${escape(description || '')}', '${escape(storyworldId)}')`);
  }

  static async getWritingRooms(circleId: string): Promise<WritingRoom[]> {
    return await DB.query(`SELECT * FROM writing_rooms WHERE circle_id = '${escape(circleId)}'`);
  }
}
