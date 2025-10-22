import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkSchema() {
  try {
    console.log("Checking database schema...\n");

    const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables:", tables.rows.map(r => r.name));

    for (const table of tables.rows) {
      if (table.name !== 'sqlite_sequence' && table.name !== '_litestream_seq' && table.name !== '_litestream_lock') {
        console.log(`\n${table.name}:`);
        const info = await db.execute(`PRAGMA table_info(${table.name})`);
        console.log(info.rows);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkSchema();
