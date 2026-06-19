import { DB } from '../db/team-db';
import { Post, Ask, Journal } from '../types/index';
import { UserService } from './UserService';

const genId = () => Math.random().toString(36).substring(2, 11);

export class SocialService {
  static createPost(userId: string, id: string, content: string, storyworldId?: string, loreId?: string, characterId?: string): void {
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`
      INSERT INTO posts (id, user_id, storyworld_id, lore_id, character_id, content, is_archived)
      VALUES (
        '${esc(id)}',
        '${esc(userId)}',
        ${storyworldId ? `'${esc(storyworldId)}'` : 'NULL'},
        ${loreId ? `'${esc(loreId)}'` : 'NULL'},
        ${characterId ? `'${esc(characterId)}'` : 'NULL'},
        '${esc(content)}',
        0
      )
    `);
  }

  static archivePost(id: string, isArchived: boolean): void {
    DB.execute(`UPDATE posts SET is_archived = ${isArchived ? 1 : 0} WHERE id = '${id}'`);
  }

  static hidePost(userId: string, postId: string): void {
    const id = 'hide_' + genId();
    DB.execute(`INSERT INTO hidden_posts (id, user_id, post_id) VALUES ('${id}', '${userId}', '${postId}')`);
  }

  static flagPost(userId: string, postId: string, reason: string): void {
    const id = 'flag_' + genId();
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO flagged_posts (id, user_id, post_id, reason, status) VALUES ('${id}', '${userId}', '${postId}', '${esc(reason)}', 'pending')`);
  }

  static createAsk(senderId: string, recipientId: string, id: string, question: string): void {
    const user = UserService.getUser(senderId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Sending Asks is only available for Architect and Collective tiers.');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO asks (id, sender_id, recipient_id, question) VALUES ('${esc(id)}', '${esc(senderId)}', '${esc(recipientId)}', '${esc(question)}')`);
  }

  static answerAsk(userId: string, askId: string, answer: string, isPublic: boolean): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Answering Asks is only available for Architect and Collective tiers.');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE asks SET answer = '${esc(answer)}', is_public = ${isPublic ? 1 : 0} WHERE id = '${esc(askId)}'`);
  }

  static createJournal(userId: string, id: string, title: string, content: string, type: 'standalone' | 'story' = 'standalone', chapterNumber?: number, parentId?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Writing Journals is only available for Architect and Collective tiers.');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`
      INSERT INTO journals (id, user_id, title, content, type, chapter_number, parent_id)
      VALUES (
        '${esc(id)}',
        '${esc(userId)}',
        '${esc(title)}',
        '${esc(content)}',
        '${esc(type)}',
        ${chapterNumber ?? 'NULL'},
        ${parentId ? `'${esc(parentId)}'` : 'NULL'}
      )
    `);
  }

  static getFeed(userId?: string): Post[] {
    if (userId) {
      return DB.query(`
        SELECT * FROM posts 
        WHERE is_archived = 0 
        AND id NOT IN (SELECT post_id FROM hidden_posts WHERE user_id = '${userId}')
        ORDER BY created_at DESC LIMIT 50
      `);
    }
    return DB.query(`SELECT * FROM posts WHERE is_archived = 0 ORDER BY created_at DESC LIMIT 50`);
  }

  static getAllPosts(): Post[] {
    return DB.query(`SELECT * FROM posts WHERE is_archived = 0 ORDER BY created_at DESC`);
  }

  static getPostsByStoryworld(storyworldId: string): Post[] {
    return DB.query(`SELECT * FROM posts WHERE storyworld_id = '${storyworldId}' AND is_archived = 0 ORDER BY created_at DESC`);
  }

  static updatePost(id: string, content: string): void {
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE posts SET content = '${esc(content)}' WHERE id = '${id}'`);
  }

  static getPublicAsks(userId: string): Ask[] {
    return DB.query(`SELECT * FROM asks WHERE recipient_id = '${userId}' AND is_public = 1`);
  }

  static getAllAsks(userId: string): Ask[] {
    return DB.query(`SELECT * FROM asks WHERE recipient_id = '${userId}' OR sender_id = '${userId}'`);
  }

  static getJournals(userId: string, type?: 'standalone' | 'story'): Journal[] {
    let query = `SELECT * FROM journals WHERE user_id = '${userId}'`;
    if (type) {
      query += ` AND type = '${type}'`;
    }
    query += ` ORDER BY created_at DESC`;
    return DB.query(query);
  }

  static getStoryChapters(parentId: string): Journal[] {
    return DB.query(`SELECT * FROM journals WHERE parent_id = '${parentId}' ORDER BY chapter_number ASC`);
  }

  static createSupportMessage(userId: string, message: string, sender: 'user' | 'librarian'): void {
    const id = genId();
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO support_messages (id, user_id, message, sender) VALUES ('${id}', '${userId}', '${esc(message)}', '${sender}')`);
  }

  static getSupportMessages(userId: string): any[] {
    return DB.query(`SELECT * FROM support_messages WHERE user_id = '${userId}' ORDER BY created_at ASC`);
  }

  static updateJournal(id: string, title: string, content: string): void {
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE journals SET title = '${esc(title)}', content = '${esc(content)}' WHERE id = '${id}'`);
  }
}
