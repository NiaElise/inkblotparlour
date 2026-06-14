import { DB } from '../db/team-db';
import { Character, Lore, Secret, TensionMap, Timeline } from '../types/index';
import { UserService } from './UserService';

export class WorldbuildingService {
  static createCharacter(storyworldId: string, id: string, name: string, description?: string, data?: any): void {
    DB.execute(`INSERT INTO characters (id, storyworld_id, name, description, data) VALUES ('${id}', '${storyworldId}', '${name}', '${description || ''}', '${JSON.stringify(data || {})}')`);
  }

  static createLore(storyworldId: string, id: string, title: string, content?: string, data?: any): void {
    DB.execute(`INSERT INTO lore (id, storyworld_id, title, content, data) VALUES ('${id}', '${storyworldId}', '${title}', '${content || ''}', '${JSON.stringify(data || {})}')`);
  }

  static createSecret(userId: string, storyworldId: string, id: string, title: string, content: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Secret Web is only available for Architect and Collective tiers.');
    }
    DB.execute(`INSERT INTO secrets (id, storyworld_id, title, content) VALUES ('${id}', '${storyworldId}', '${title}', '${content}')`);
  }

  static createTensionMap(userId: string, storyworldId: string, id: string, data: any): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Tension Mapping is only available for Architect and Collective tiers.');
    }
    DB.execute(`INSERT INTO tension_maps (id, storyworld_id, data) VALUES ('${id}', '${storyworldId}', '${JSON.stringify(data)}')`);
  }

  static createTimeline(userId: string, storyworldId: string, id: string, title: string, events: any): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Timeline Orchestration is only available for Architect and Collective tiers.');
    }
    DB.execute(`INSERT INTO timelines (id, storyworld_id, title, events) VALUES ('${id}', '${storyworldId}', '${title}', '${JSON.stringify(events)}')`);
  }

  static getCharacters(storyworldId: string): Character[] {
    return DB.query(`SELECT * FROM characters WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateCharacter(id: string, name: string, description?: string, data?: any): void {
    DB.execute(`UPDATE characters SET name = '${name}', description = '${description || ''}', data = '${JSON.stringify(data || {})}' WHERE id = '${id}'`);
  }

  static getLore(storyworldId: string): Lore[] {
    return DB.query(`SELECT * FROM lore WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateLore(id: string, title: string, content?: string, data?: any): void {
    DB.execute(`UPDATE lore SET title = '${title}', content = '${content || ''}', data = '${JSON.stringify(data || {})}' WHERE id = '${id}'`);
  }

  static getSecrets(userId: string, storyworldId: string): Secret[] {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Secret Web is only available for Architect and Collective tiers.');
    return DB.query(`SELECT * FROM secrets WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateSecret(userId: string, id: string, title: string, content: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Secret Web is only available for Architect and Collective tiers.');
    DB.execute(`UPDATE secrets SET title = '${title}', content = '${content}' WHERE id = '${id}'`);
  }

  static getTensionMaps(userId: string, storyworldId: string): TensionMap[] {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Tension Mapping is only available for Architect and Collective tiers.');
    return DB.query(`SELECT * FROM tension_maps WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateTensionMap(userId: string, id: string, data: any): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Tension Mapping is only available for Architect and Collective tiers.');
    DB.execute(`UPDATE tension_maps SET data = '${JSON.stringify(data)}' WHERE id = '${id}'`);
  }

  static getTimelines(userId: string, storyworldId: string): any[] {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Timeline Orchestration is only available for Architect and Collective tiers.');
    return DB.query(`SELECT * FROM timelines WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateTimeline(userId: string, id: string, title: string, events: any): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Timeline Orchestration is only available for Architect and Collective tiers.');
    DB.execute(`UPDATE timelines SET title = '${title}', events = '${JSON.stringify(events)}' WHERE id = '${id}'`);
  }

  static createSecretSociety(userId: string, storyworldId: string, id: string, name: string, description?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') {
      throw new Error('Secret Societies are only available for Architect and Collective tiers.');
    }
    DB.execute(`INSERT INTO secret_societies (id, storyworld_id, name, description) VALUES ('${id}', '${storyworldId}', '${name}', '${description || ''}')`);
  }

  static getSecretSocieties(userId: string, storyworldId: string): any[] {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Secret Societies are only available for Architect and Collective tiers.');
    return DB.query(`SELECT * FROM secret_societies WHERE storyworld_id = '${storyworldId}'`);
  }

  static updateSecretSociety(userId: string, id: string, name: string, description?: string): void {
    const user = UserService.getUser(userId);
    if (!user) throw new Error('User not found');
    if (user.tier === 'Draftsman' && user.role !== 'admin') throw new Error('Secret Societies are only available for Architect and Collective tiers.');
    DB.execute(`UPDATE secret_societies SET name = '${name}', description = '${description || ''}' WHERE id = '${id}'`);
  }
}
