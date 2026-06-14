import { DB } from '../db/team-db';
import { WriterCircle, CircleMember } from '../types/index';
import { UserService } from './UserService';

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
}
