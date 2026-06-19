import { execSync } from 'child_process';
import { createClient } from '@libsql/client';

// On Render, we use the direct HTTPS connection to Turso
// We also sanitize the URL to ensure it uses https:// instead of libsql:// which can cause 400 errors in some environments
const rawUrl = process.env.TEAM_DB_URL || '';
const remoteUrl = rawUrl.startsWith('libsql://') 
  ? rawUrl.replace('libsql://', 'https://') 
  : rawUrl;

const authToken = process.env.TEAM_DB_AUTH_TOKEN?.trim();
const useRemote = remoteUrl && authToken;

// In-memory cache for the client
let client: any = null;

function getClient() {
  if (!client && useRemote) {
    console.log(`Connecting to remote DB at ${remoteUrl.split('@')[0]}...`);
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
        console.error(`Remote Query Error: ${error}`);
        throw error;
      }
    } else {
      try {
        const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
        return JSON.parse(output);
      } catch (error) {
        console.error(`CLI Query Error: ${error}`);
        throw error;
      }
    }
  }

  static async execute(sql: string): Promise<void> {
    if (useRemote) {
      try {
        const c = getClient();
        await c.execute(sql);
      } catch (error) {
        console.error(`Remote Execution Error: ${error}`);
        throw error;
      }
    } else {
      try {
        execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
      } catch (error) {
        console.error(`CLI Execution Error: ${error}`);
        throw error;
      }
    }
  }
}
