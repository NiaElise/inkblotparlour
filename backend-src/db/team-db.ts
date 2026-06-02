import { execSync } from 'child_process';

export class DB {
  static query(sql: string): any {
    try {
      const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
      return JSON.parse(output);
    } catch (error) {
      console.error(`Error executing SQL: ${sql}`, error);
      throw error;
    }
  }

  static execute(sql: string): void {
    try {
      execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
    } catch (error) {
      console.error(`Error executing SQL: ${sql}`, error);
      throw error;
    }
  }
}
