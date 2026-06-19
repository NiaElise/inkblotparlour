import { DB } from '../db/team-db';
import { Character, Lore, Secret, TensionMap, Timeline, LoreTemplate, LoreTemplateFragment, LoreTemplateCharacter } from '../types/index';
import { UserService } from './UserService';
import { StoryworldService } from './StoryworldService';

const genId = () => Math.random().toString(36).substring(2, 11);
const esc = (s: string) => s.replace(/'/g, "''");

export class WorldbuildingService {
  static async getLoreTemplates(): Promise<LoreTemplate[]> {
    return await DB.query(`SELECT * FROM lore_templates`);
  }

  static async getLoreTemplate(id: string): Promise<LoreTemplate | undefined> {
    const results = await DB.query(`SELECT * FROM lore_templates WHERE id = '${esc(id)}'`);
    return results[0];
  }

  static async createLoreTemplate(id: string, name: string, genre?: string, description?: string): Promise<void> {
    await DB.execute(`INSERT INTO lore_templates (id, name, genre, description) VALUES ('${esc(id)}', '${esc(name)}', '${esc(genre || '')}', '${esc(description || '')}')`);
  }

  static async addTemplateFragment(id: string, templateId: string, title: string, content: string, category?: string): Promise<void> {
    await DB.execute(`INSERT INTO lore_template_fragments (id, template_id, title, content, category) VALUES ('${esc(id)}', '${esc(templateId)}', '${esc(title)}', '${esc(content)}', '${esc(category || '')}')`);
  }

  static async addTemplateCharacter(id: string, templateId: string, name: string, role?: string, description?: string): Promise<void> {
    await DB.execute(`INSERT INTO lore_template_characters (id, template_id, name, role, description) VALUES ('${esc(id)}', '${esc(templateId)}', '${esc(name)}', '${esc(role || '')}', '${esc(description || '')}')`);
  }

  static async applyTemplate(userId: string, storyworldId: string, templateId: string): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    
    const fragments: LoreTemplateFragment[] = await DB.query(`SELECT * FROM lore_template_fragments WHERE template_id = '${esc(templateId)}'`);
    for (const frag of fragments) {
      await this.createLore(userId, storyworldId, 'lore_' + genId(), frag.title, frag.content, { category: frag.category });
    }

    const characters: LoreTemplateCharacter[] = await DB.query(`SELECT * FROM lore_template_characters WHERE template_id = '${esc(templateId)}'`);
    for (const char of characters) {
      await this.createCharacter(userId, storyworldId, 'char_' + genId(), char.name, char.description, { role: char.role });
    }
  }

  static async createCharacter(userId: string, storyworldId: string, id: string, name: string, description?: string, data?: any): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');

    const user = await UserService.getUser(userId);
    if (user && user.tier === 'Draftsman' && user.role !== 'admin') {
      const results = await DB.query(`SELECT count(*) as count FROM characters WHERE storyworld_id = '${esc(storyworldId)}'`);
      const charCount = results[0].count;
      if (charCount >= 5) {
        throw new Error('Draftsman tier is limited to 5 characters per storyworld. Upgrade to Architect for unlimited slots.');
      }
    }

    await DB.execute(`INSERT INTO characters (id, storyworld_id, name, description, data) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(name)}', '${esc(description || '')}', '${esc(JSON.stringify(data || {}))}')`);
  }

  static async createLore(userId: string, storyworldId: string, id: string, title: string, content?: string, data?: any): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');

    const user = await UserService.getUser(userId);
    if (user && user.tier === 'Draftsman' && user.role !== 'admin') {
      const results = await DB.query(`SELECT count(*) as count FROM lore WHERE storyworld_id = '${esc(storyworldId)}'`);
      const loreCount = results[0].count;
      if (loreCount >= 10) {
        throw new Error('Draftsman tier is limited to 10 lore entries per storyworld. Upgrade to Architect for unlimited slots.');
      }
    }

    await DB.execute(`INSERT INTO lore (id, storyworld_id, title, content, data, is_archived) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(title)}', '${esc(content || '')}', '${esc(JSON.stringify(data || {}))}', 0)`);
  }

  static async archiveLore(userId: string, id: string, isArchived: boolean): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM lore WHERE id = '${esc(id)}'`);
    const lore = results[0];
    if (lore) {
      await StoryworldService.checkAccess(userId, lore.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE lore SET is_archived = ${isArchived ? 1 : 0} WHERE id = '${esc(id)}'`);
  }

  static async createSecret(userId: string, storyworldId: string, id: string, title: string, content: string): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    await DB.execute(`INSERT INTO secrets (id, storyworld_id, title, content) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(title)}', '${esc(content)}')`);
  }

  static async createTensionMap(userId: string, storyworldId: string, id: string, data: any): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    await DB.execute(`INSERT INTO tension_maps (id, storyworld_id, data) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(JSON.stringify(data))}')`);
  }

  static async createTimeline(userId: string, storyworldId: string, id: string, title: string, events: any): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    await DB.execute(`INSERT INTO timelines (id, storyworld_id, title, events) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(title)}', '${esc(JSON.stringify(events))}')`);
  }

  static async getCharacters(userId: string, storyworldId: string): Promise<Character[]> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Draftsman');
    return await DB.query(`SELECT * FROM characters WHERE storyworld_id = '${esc(storyworldId)}'`);
  }

  static async updateCharacter(userId: string, id: string, name: string, description?: string, data?: any): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM characters WHERE id = '${esc(id)}'`);
    const char = results[0];
    if (char) {
      await StoryworldService.checkAccess(userId, char.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE characters SET name = '${esc(name)}', description = '${esc(description || '')}', data = '${esc(JSON.stringify(data || {}))}' WHERE id = '${esc(id)}'`);
  }

  static async getLore(userId: string, storyworldId: string): Promise<Lore[]> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Draftsman');
    return await DB.query(`SELECT * FROM lore WHERE storyworld_id = '${esc(storyworldId)}'`);
  }

  static async updateLore(userId: string, id: string, title: string, content?: string, data?: any): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM lore WHERE id = '${esc(id)}'`);
    const lore = results[0];
    if (lore) {
      await StoryworldService.checkAccess(userId, lore.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE lore SET title = '${esc(title)}', content = '${esc(content || '')}', data = '${esc(JSON.stringify(data || {}))}' WHERE id = '${esc(id)}'`);
  }

  static async getSecrets(userId: string, storyworldId: string): Promise<Secret[]> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return await DB.query(`SELECT * FROM secrets WHERE storyworld_id = '${esc(storyworldId)}'`);
  }

  static async updateSecret(userId: string, id: string, title: string, content: string): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM secrets WHERE id = '${esc(id)}'`);
    const secret = results[0];
    if (secret) {
      await StoryworldService.checkAccess(userId, secret.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE secrets SET title = '${esc(title)}', content = '${esc(content)}' WHERE id = '${esc(id)}'`);
  }

  static async getTensionMaps(userId: string, storyworldId: string): Promise<TensionMap[]> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return await DB.query(`SELECT * FROM tension_maps WHERE storyworld_id = '${esc(storyworldId)}'`);
  }

  static async updateTensionMap(userId: string, id: string, data: any): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM tension_maps WHERE id = '${esc(id)}'`);
    const map = results[0];
    if (map) {
      await StoryworldService.checkAccess(userId, map.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE tension_maps SET data = '${esc(JSON.stringify(data))}' WHERE id = '${esc(id)}'`);
  }

  static async getTimelines(userId: string, storyworldId: string): Promise<any[]> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return await DB.query(`SELECT * FROM timelines WHERE storyworld_id = '${esc(storyworldId)}'`);
  }

  static async updateTimeline(userId: string, id: string, title: string, events: any): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM timelines WHERE id = '${esc(id)}'`);
    const tl = results[0];
    if (tl) {
      await StoryworldService.checkAccess(userId, tl.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE timelines SET title = '${esc(title)}', events = '${esc(JSON.stringify(events))}' WHERE id = '${esc(id)}'`);
  }

  static async createSecretSociety(userId: string, storyworldId: string, id: string, name: string, description?: string): Promise<void> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    await DB.execute(`INSERT INTO secret_societies (id, storyworld_id, name, description) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(name)}', '${esc(description || '')}')`);
  }

  static async getSecretSocieties(userId: string, storyworldId: string): Promise<any[]> {
    await StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return await DB.query(`SELECT * FROM secret_societies WHERE storyworld_id = '${esc(storyworldId)}'`);
  }

  static async updateSecretSociety(userId: string, id: string, name: string, description?: string): Promise<void> {
    const results = await DB.query(`SELECT storyworld_id FROM secret_societies WHERE id = '${esc(id)}'`);
    const soc = results[0];
    if (soc) {
      await StoryworldService.checkAccess(userId, soc.storyworld_id, 'Architect');
    }
    await DB.execute(`UPDATE secret_societies SET name = '${esc(name)}', description = '${esc(description || '')}' WHERE id = '${esc(id)}'`);
  }
}
