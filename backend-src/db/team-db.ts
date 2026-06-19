import { execSync } from 'child_process';
import { createClient } from '@libsql/client';

/**
 * Robust Database Connection for Inkblot Parlour
 * 
 * Handles the difference between local 'team-db' CLI 
 * and production Turso HTTPS connection on Render.
 */

// 1. Sanitize the URL: Force HTTPS to prevent 'libsql://' protocol issues on Render
const rawUrl = process.env.TEAM_DB_URL || '';
let remoteUrl = rawUrl.trim();
if (remoteUrl.startsWith('libsql://')) {
  remoteUrl = remoteUrl.replace('libsql://', 'https://');
}

// 2. Sanitize the Token: Ensure no extra spaces or 'Bearer ' prefix
let authToken = process.env.TEAM_DB_AUTH_TOKEN?.trim() || '';
if (authToken.startsWith('Bearer ')) {
  authToken = authToken.replace('Bearer ', '');
}

const useRemote = remoteUrl !== '' && authToken !== '';

// Singleton client
let client: any = null;

function getClient() {
  if (!client && useRemote) {
    try {
      client = createClient({
        url: remoteUrl,
        authToken: authToken,
      });
    } catch (e) {
      console.error("Failed to initialize Libsql client:", e);
      throw e;
    }
  }
  return client;
}

export class DB {
  static async query(sql: string): Promise<any> {
    if (useRemote) {
      try {
        const c = getClient();
        const result = await c.execute(sql);
        // Map rows to match the JSON format the app expects
        return result.rows.map((row: any) => {
          const obj: any = {};
          result.columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
      } catch (error: any) {
        console.error(`Production DB Query Error: ${error.message}`);
        // Rethrow with a cleaner message for the UI
        throw new Error(`Database Error: ${error.message}`);
      }
    } else {
      // Local fallback (CTO.new Sandbox)
      try {
        const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
        return JSON.parse(output);
      } catch (error: any) {
        console.error(`Local CLI Query Error: ${error.message}`);
        throw error;
      }
    }
  }

  static async execute(sql: string): Promise<void> {
    if (useRemote) {
      try {
        const c = getClient();
        await c.execute(sql);
      } catch (error: any) {
        console.error(`Production DB Execute Error: ${error.message}`);
        throw new Error(`Database Error: ${error.message}`);
      }
    } else {
      try {
        execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
      } catch (error: any) {
        console.error(`Local CLI Execute Error: ${error.message}`);
        throw error;
      }
    }
  }
}
