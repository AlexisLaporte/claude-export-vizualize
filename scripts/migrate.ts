import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  try {
    console.log("Starting migration...");

    const schema = readFileSync(join(process.cwd(), "schema.sql"), "utf-8");
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log("Executing:", statement.substring(0, 50) + "...");
      try {
        await db.execute(statement);
        console.log("✓ Success");
      } catch (error: any) {
        if (error.message?.includes("duplicate column name")) {
          console.log("⚠ Column already exists, skipping");
        } else {
          console.error("✗ Error:", error.message);
        }
      }
    }

    console.log("\n✅ Migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
