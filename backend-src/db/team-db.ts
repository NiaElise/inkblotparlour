import { execSync } from 'child_process';
import { createClient } from '@libsql/client';

const rawUrl = process.env.TEAM_DB_URL || '';
const remoteUrl = rawUrl.startsWith('libsql://') 
  ? rawUrl.replace('libsql://', 'https://') 
  : rawUrl;

const authToken = process.env.TEAM_DB_AUTH_TOKEN?.trim();
const useRemote = remoteUrl && authToken;

let client: any = null;

function getClient() {
  if (!client && useRemote) {
    client = createClient({
      url: remoteUrl,
      authToken: authToken,
    });
  }
  return client;
}

export class DB {
  static async query(sql: string): Promise<any> {
    if (useRemote) {
      try {
        const c = getClient();
        const result = await c.execute(sql);
        return result.rows.map((row: any) => {
          const obj: any = {};
          result.columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
      } catch (error) {
        throw error;
      }
    } else {
      const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
      return JSON.parse(output);
    }
  }

  static async execute(sql: string): Promise<void> {
    if (useRemote) {
      const c = getClient();
      await c.execute(sql);
    } else {
      execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
    }
  }
}
