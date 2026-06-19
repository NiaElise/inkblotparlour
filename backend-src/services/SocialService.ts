import { DB } from '../db/team-db';
import { Post, Comment, Ask } from '../types/index';

const escape = (str: string) => str.replace(/'/g, "''");

export class SocialService {
  // Posts
  static async createPost(userId: string, id: string, content: string, storyworldId?: string, loreId?: string, characterId?: string): Promise<void> {
    const metadata = { storyworldId, loreId, characterId };
    const metadataVal = `'${escape(JSON.stringify(metadata))}'`;
    await DB.execute(`INSERT INTO posts (id, user_id, content, format, metadata) VALUES ('${escape(id)}', '${escape(userId)}', '${escape(content)}', 'fragment', ${metadataVal})`);
  }

  static async getFeed(userId?: string, limit: number = 20, offset: number = 0): Promise<any[]> {
    // Basic feed: all public posts
    return await DB.query(`
      SELECT p.*, u.username, u.avatar 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.is_archived = 0
      ORDER BY p.created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);
  }

  static async getUserPosts(userId: string): Promise<Post[]> {
    return await DB.query(`SELECT * FROM posts WHERE user_id = '${escape(userId)}' ORDER BY created_at DESC`);
  }

  static async getAllPosts(): Promise<Post[]> {
    return await DB.query(`SELECT * FROM posts ORDER BY created_at DESC`);
  }

  static async archivePost(postId: string, isArchived: boolean): Promise<void> {
    await DB.execute(`UPDATE posts SET is_archived = ${isArchived ? 1 : 0} WHERE id = '${escape(postId)}'`);
  }

  static async hidePost(userId: string, postId: string): Promise<void> {
    // In a real app, this would add to a 'hidden_posts' table for the user
    // For now, let's just log it or ignore
    console.log(`User ${userId} hid post ${postId}`);
  }

  static async flagPost(userId: string, postId: string, reason: string): Promise<void> {
    await DB.execute(`INSERT INTO flagged_posts (user_id, post_id, reason) VALUES ('${escape(userId)}', '${escape(postId)}', '${escape(reason)}')`);
  }

  // Asks
  static async createAsk(fromUserId: string, toUserId: string, id: string, content: string): Promise<void> {
    await DB.execute(`INSERT INTO asks (id, from_user_id, to_user_id, content, is_anonymous) VALUES ('${escape(id)}', '${escape(fromUserId)}', '${escape(toUserId)}', '${escape(content)}', 0)`);
  }

  static async getAllAsks(userId: string): Promise<Ask[]> {
    return await DB.query(`
      SELECT a.*, u.username as from_username, u.avatar as from_avatar 
      FROM asks a 
      LEFT JOIN users u ON a.from_user_id = u.id 
      WHERE a.to_user_id = '${escape(userId)}'
      ORDER BY a.created_at DESC
    `);
  }

  static async answerAsk(userId: string, askId: string, answer: string, isPublic: boolean = true): Promise<void> {
    await DB.execute(`UPDATE asks SET answer = '${escape(answer)}', answered_at = CURRENT_TIMESTAMP WHERE id = '${escape(askId)}' AND to_user_id = '${escape(userId)}'`);
    
    if (isPublic) {
      const askResult = await DB.query(`SELECT content FROM asks WHERE id = '${escape(askId)}'`);
      const ask = askResult[0];
      if (ask) {
        const id = Math.random().toString(36).substring(2, 11);
        await DB.execute(`INSERT INTO posts (id, user_id, content, format, metadata) VALUES ('${id}', '${escape(userId)}', '${escape(ask.content)}\n\nAnswer: ${escape(answer)}', 'ask', '{"askId": "${escape(askId)}"}')`);
      }
    }
  }

  // Journals
  static async getJournals(userId: string, type?: 'standalone' | 'story'): Promise<any[]> {
    let query = `SELECT * FROM journals WHERE user_id = '${escape(userId)}'`;
    if (type) {
      query += ` AND type = '${escape(type)}'`;
    }
    return await DB.query(query + ` ORDER BY created_at DESC`);
  }

  static async createJournal(userId: string, id: string, title: string, content: string, type: 'standalone' | 'story', chapterNumber?: number, parentId?: string): Promise<void> {
    const parentIdVal = parentId ? `'${escape(parentId)}'` : 'NULL';
    const chapVal = chapterNumber !== undefined ? chapterNumber : 'NULL';
    await DB.execute(`INSERT INTO journals (id, user_id, title, content, type, chapter_number, parent_id) VALUES ('${escape(id)}', '${escape(userId)}', '${escape(title)}', '${escape(content)}', '${escape(type)}', ${chapVal}, ${parentIdVal})`);
  }

  static async getStoryChapters(parentId: string): Promise<any[]> {
    return await DB.query(`SELECT * FROM journals WHERE parent_id = '${escape(parentId)}' ORDER BY chapter_number ASC`);
  }

  // Support
  static async getSupportMessages(userId: string): Promise<any[]> {
    return await DB.query(`SELECT * FROM support_messages WHERE user_id = '${escape(userId)}' ORDER BY created_at ASC`);
  }

  static async createSupportMessage(userId: string, message: string, sender: 'user' | 'admin'): Promise<void> {
    const id = Math.random().toString(36).substring(2, 11);
    await DB.execute(`INSERT INTO support_messages (id, user_id, message, sender) VALUES ('${id}', '${escape(userId)}', '${escape(message)}', '${escape(sender)}')`);
  }

  // Interactions
  static async likePost(userId: string, postId: string): Promise<void> {
    await DB.execute(`INSERT OR IGNORE INTO likes (user_id, post_id) VALUES ('${escape(userId)}', '${escape(postId)}')`);
  }

  static async addComment(userId: string, postId: string, content: string): Promise<void> {
    const id = Math.random().toString(36).substring(2, 11);
    await DB.execute(`INSERT INTO comments (id, user_id, post_id, content) VALUES ('${id}', '${escape(userId)}', '${escape(postId)}', '${escape(content)}')`);
  }

  static async getComments(postId: string): Promise<Comment[]> {
    return await DB.query(`
      SELECT c.*, u.username, u.avatar 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = '${escape(postId)}' 
      ORDER BY c.created_at ASC
    `);
  }
}
