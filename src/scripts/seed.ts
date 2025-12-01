import { db } from "../db/index.js";
import { urlRecords } from "../db/schema.js";

async function seed() {
  console.log("Seeding/Resetting database...");
  // Clear data
  await db.delete(urlRecords);
  console.log("Database cleared.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
