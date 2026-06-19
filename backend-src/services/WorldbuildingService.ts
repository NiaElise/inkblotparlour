import { DB } from '../db/team-db';
import { Character, Lore, Secret, TensionMap, Timeline, LoreTemplate, LoreTemplateFragment, LoreTemplateCharacter } from '../types/index';
import { UserService } from './UserService';
import { StoryworldService } from './StoryworldService';

const genId = () => Math.random().toString(36).substring(2, 11);

export class WorldbuildingService {
  static getLoreTemplates(): LoreTemplate[] {
    return DB.query(`SELECT * FROM lore_templates`);
  }

  static getLoreTemplate(id: string): LoreTemplate | undefined {
    const results = DB.query(`SELECT * FROM lore_templates WHERE id = '${id}'`);
    return results[0];
  }

  static createLoreTemplate(id: string, name: string, genre?: string, description?: string): void {
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO lore_templates (id, name, genre, description) VALUES ('${esc(id)}', '${esc(name)}', '${esc(genre || '')}', '${esc(description || '')}')`);
  }

  static addTemplateFragment(id: string, templateId: string, title: string, content: string, category?: string): void {
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO lore_template_fragments (id, template_id, title, content, category) VALUES ('${esc(id)}', '${esc(templateId)}', '${esc(title)}', '${esc(content)}', '${esc(category || '')}')`);
  }

  static addTemplateCharacter(id: string, templateId: string, name: string, role?: string, description?: string): void {
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO lore_template_characters (id, template_id, name, role, description) VALUES ('${esc(id)}', '${esc(templateId)}', '${esc(name)}', '${esc(role || '')}', '${esc(description || '')}')`);
  }

  static applyTemplate(userId: string, storyworldId: string, templateId: string): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    
    const fragments: LoreTemplateFragment[] = DB.query(`SELECT * FROM lore_template_fragments WHERE template_id = '${templateId}'`);
    for (const frag of fragments) {
      this.createLore(userId, storyworldId, 'lore_' + genId(), frag.title, frag.content, { category: frag.category });
    }

    const characters: LoreTemplateCharacter[] = DB.query(`SELECT * FROM lore_template_characters WHERE template_id = '${templateId}'`);
    for (const char of characters) {
      this.createCharacter(userId, storyworldId, 'char_' + genId(), char.name, char.description, { role: char.role });
    }
  }

  static createCharacter(userId: string, storyworldId: string, id: string, name: string, description?: string, data?: any): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');

    const user = UserService.getUser(userId);
    if (user && user.tier === 'Draftsman' && user.role !== 'admin') {
      const charCount = DB.query(`SELECT count(*) as count FROM characters WHERE storyworld_id = '${storyworldId}'`)[0].count;
      if (charCount >= 5) {
        throw new Error('Draftsman tier is limited to 5 characters per storyworld. Upgrade to Architect for unlimited slots.');
      }
    }

    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO characters (id, storyworld_id, name, description, data) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(name)}', '${esc(description || '')}', '${esc(JSON.stringify(data || {}))}')`);
  }

  static createLore(userId: string, storyworldId: string, id: string, title: string, content?: string, data?: any): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');

    const user = UserService.getUser(userId);
    if (user && user.tier === 'Draftsman' && user.role !== 'admin') {
      const loreCount = DB.query(`SELECT count(*) as count FROM lore WHERE storyworld_id = '${storyworldId}'`)[0].count;
      if (loreCount >= 10) {
        throw new Error('Draftsman tier is limited to 10 lore entries per storyworld. Upgrade to Architect for unlimited slots.');
      }
    }

    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO lore (id, storyworld_id, title, content, data, is_archived) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(title)}', '${esc(content || '')}', '${esc(JSON.stringify(data || {}))}', 0)`);
  }

  static archiveLore(userId: string, id: string, isArchived: boolean): void {
    const lore = DB.query(`SELECT storyworld_id FROM lore WHERE id = '${id}'`)[0];
    if (lore) {
      StoryworldService.checkAccess(userId, lore.storyworld_id, 'Architect');
    }
    DB.execute(`UPDATE lore SET is_archived = ${isArchived ? 1 : 0} WHERE id = '${id}'`);
  }

  static createSecret(userId: string, storyworldId: string, id: string, title: string, content: string): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO secrets (id, storyworld_id, title, content) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(title)}', '${esc(content)}')`);
  }

  static createTensionMap(userId: string, storyworldId: string, id: string, data: any): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO tension_maps (id, storyworld_id, data) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(JSON.stringify(data))}')`);
  }

  static createTimeline(userId: string, storyworldId: string, id: string, title: string, events: any): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO timelines (id, storyworld_id, title, events) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(title)}', '${esc(JSON.stringify(events))}')`);
  }

  static getCharacters(userId: string, storyworldId: string): Character[] {
    StoryworldService.checkAccess(userId, storyworldId, 'Draftsman');
    return DB.query(`SELECT * FROM characters WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateCharacter(userId: string, id: string, name: string, description?: string, data?: any): void {
    const char = DB.query(`SELECT storyworld_id FROM characters WHERE id = '${id}'`)[0];
    if (char) {
      StoryworldService.checkAccess(userId, char.storyworld_id, 'Architect');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE characters SET name = '${esc(name)}', description = '${esc(description || '')}', data = '${esc(JSON.stringify(data || {}))}' WHERE id = '${id}'`);
  }

  static getLore(userId: string, storyworldId: string): Lore[] {
    StoryworldService.checkAccess(userId, storyworldId, 'Draftsman');
    return DB.query(`SELECT * FROM lore WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateLore(userId: string, id: string, title: string, content?: string, data?: any): void {
    const lore = DB.query(`SELECT storyworld_id FROM lore WHERE id = '${id}'`)[0];
    if (lore) {
      StoryworldService.checkAccess(userId, lore.storyworld_id, 'Architect');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE lore SET title = '${esc(title)}', content = '${esc(content || '')}', data = '${esc(JSON.stringify(data || {}))}' WHERE id = '${id}'`);
  }

  static getSecrets(userId: string, storyworldId: string): Secret[] {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return DB.query(`SELECT * FROM secrets WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateSecret(userId: string, id: string, title: string, content: string): void {
    const secret = DB.query(`SELECT storyworld_id FROM secrets WHERE id = '${id}'`)[0];
    if (secret) {
      StoryworldService.checkAccess(userId, secret.storyworld_id, 'Architect');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE secrets SET title = '${esc(title)}', content = '${esc(content)}' WHERE id = '${id}'`);
  }

  static getTensionMaps(userId: string, storyworldId: string): TensionMap[] {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return DB.query(`SELECT * FROM tension_maps WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateTensionMap(userId: string, id: string, data: any): void {
    const map = DB.query(`SELECT storyworld_id FROM tension_maps WHERE id = '${id}'`)[0];
    if (map) {
      StoryworldService.checkAccess(userId, map.storyworld_id, 'Architect');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE tension_maps SET data = '${esc(JSON.stringify(data))}' WHERE id = '${id}'`);
  }

  static getTimelines(userId: string, storyworldId: string): any[] {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return DB.query(`SELECT * FROM timelines WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateTimeline(userId: string, id: string, title: string, events: any): void {
    const tl = DB.query(`SELECT storyworld_id FROM timelines WHERE id = '${id}'`)[0];
    if (tl) {
      StoryworldService.checkAccess(userId, tl.storyworld_id, 'Architect');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE timelines SET title = '${esc(title)}', events = '${esc(JSON.stringify(events))}' WHERE id = '${id}'`);
  }

  static createSecretSociety(userId: string, storyworldId: string, id: string, name: string, description?: string): void {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`INSERT INTO secret_societies (id, storyworld_id, name, description) VALUES ('${esc(id)}', '${esc(storyworldId)}', '${esc(name)}', '${esc(description || '')}')`);
  }

  static getSecretSocieties(userId: string, storyworldId: string): any[] {
    StoryworldService.checkAccess(userId, storyworldId, 'Architect');
    return DB.query(`SELECT * FROM secret_societies WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateSecretSociety(userId: string, id: string, name: string, description?: string): void {
    const soc = DB.query(`SELECT storyworld_id FROM secret_societies WHERE id = '${id}'`)[0];
    if (soc) {
      StoryworldService.checkAccess(userId, soc.storyworld_id, 'Architect');
    }
    const esc = (s: string) => s.replace(/'/g, "''");
    DB.execute(`UPDATE secret_societies SET name = '${esc(name)}', description = '${esc(description || '')}' WHERE id = '${id}'`);
  }
}
