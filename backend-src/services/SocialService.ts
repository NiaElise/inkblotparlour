import { DB } from '../db/team-db';
import { Post, Ask, Journal } from '../types/index';
import { UserService } from './UserService';

export class SocialService {
  static createPost(userId: string, id: string, content: string, storyworldId?: string, loreId?: string, characterId?: string): void {
    DB.execute(`
      INSERT INTO posts (id, user_id, storyworld_id, lore_id, character_id, content)
      VALUES (
        '${id}',
        '${userId}',
        ${storyworldId ? `'${storyworldId}'` : 'NULL'},
        ${loreId ? `'${loreId}'` : 'NULL'},
        ${characterId ? `'${characterId}'` : 'NULL'},
        '${content}'
      )
    `);
  }

  static createAsk(senderId: string, recipientId: string, id: string, question: string): void {
    const user = UserService.getUser(senderId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Sending Asks is only available for Architect and Collective tiers.');
    }
    DB.execute(`INSERT INTO asks (id, sender_id, recipient_id, question) VALUES ('${id}', '${senderId}', '${recipientId}', '${question}')`);
  }

  static answerAsk(userId: string, askId: string, answer: string, isPublic: boolean): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Answering Asks is only available for Architect and Collective tiers.');
    }
    DB.execute(`UPDATE asks SET answer = '${answer}', is_public = ${isPublic ? 1 : 0} WHERE id = '${askId}'`);
  }

  static createJournal(userId: string, id: string, title: string, content: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Writing Journals is only available for Architect and Collective tiers.');
    }
    DB.execute(`INSERT INTO journals (id, user_id, title, content) VALUES ('${id}', '${userId}', '${title}', '${content}')`);
  }

  static getFeed(): Post[] {
    return DB.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT 50`);
  }

  static getAllPosts(): Post[] {
    return DB.query(`SELECT * FROM posts ORDER BY created_at DESC`);
  }

  static getPostsByStoryworld(storyworldId: string): Post[] {
    return DB.query(`SELECT * FROM posts WHERE storyworld_id = '${storyworldId}' ORDER BY created_at DESC`);
  }

  static updatePost(id: string, content: string): void {
    DB.execute(`UPDATE posts SET content = '${content}' WHERE id = '${id}'`);
  }

  static getPublicAsks(userId: string): Ask[] {
    return DB.query(`SELECT * FROM asks WHERE recipient_id = '${userId}' AND is_public = 1`);
  }

  static getAllAsks(userId: string): Ask[] {
    return DB.query(`SELECT * FROM asks WHERE recipient_id = '${userId}' OR sender_id = '${userId}'`);
  }

  static getJournals(userId: string): Journal[] {
    return DB.query(`SELECT * FROM journals WHERE user_id = '${userId}'`);
  }

  static updateJournal(id: string, title: string, content: string): void {
    DB.execute(`UPDATE journals SET title = '${title}', content = '${content}' WHERE id = '${id}'`);
  }
}
