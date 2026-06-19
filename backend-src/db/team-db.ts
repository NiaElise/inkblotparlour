import { execSync } from 'child_process';
import { createClient } from '@libsql/client';

const useRemote = process.env.TEAM_DB_URL && process.env.TEAM_DB_AUTH_TOKEN;

// In-memory cache for the client to avoid repeated connections
let client: any = null;

function getClient() {
  if (!client && useRemote) {
    client = createClient({
      url: process.env.TEAM_DB_URL!,
      authToken: process.env.TEAM_DB_AUTH_TOKEN!,
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
        // Map rows to a simpler format that looks like the CLI output
        return result.rows.map((row: any) => {
          const obj: any = {};
          result.columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
      } catch (error) {
        console.error(`Remote SQL error: ${sql}`, error);
        throw error;
      }
    } else {
      try {
        const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
        return JSON.parse(output);
      } catch (error) {
        console.error(`CLI SQL error: ${sql}`, error);
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
        console.error(`Remote SQL error: ${sql}`, error);
        throw error;
      }
    } else {
      try {
        execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
      } catch (error) {
        console.error(`CLI SQL error: ${sql}`, error);
        throw error;
      }
    }
  }
}
