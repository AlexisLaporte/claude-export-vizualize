import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function fixExportsTable() {
  try {
    console.log("Checking exports table schema...");

    // Get current table info
    const result = await db.execute("PRAGMA table_info(exports)");
    const columns = result.rows.map((row: any) => row.name);

    console.log("Current columns:", columns);

    if (!columns.includes("user_id")) {
      console.log("Adding user_id column...");
      await db.execute("ALTER TABLE exports ADD COLUMN user_id TEXT");
      console.log("✓ user_id column added");
    } else {
      console.log("✓ user_id column already exists");
    }

    console.log("\n✅ Exports table is ready!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixExportsTable();
