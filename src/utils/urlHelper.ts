import cryptoRandomString from "crypto-random-string";
import { db } from "../db/index.js"; // Use .js extension for local imports in NodeNext/ESM if needed, but TS usually resolves without it or with .js in output. 
// In "module": "NodeNext", we MUST use .js extension for relative imports in TS files if we want to run them directly with tsx or compile to ESM.
// However, some tools allow omitting it. Let's try to use standard .js extension for imports.
import { urlRecords } from "../db/schema.js";
import { eq } from "drizzle-orm";

const PROJECT_URL = process.env.PROJECT_URL || "http://localhost:3000";
const SHORT_URL_LENGTH = Number(process.env.SHORT_URL_LENGTH || "6");

export async function generateShortUrl(customUrlCode: string = ""): Promise<string> {
  if (customUrlCode) {
    return `${PROJECT_URL}/${customUrlCode}`;
  }
  let urlCode: string;

  while (true) {
    urlCode = cryptoRandomString({
      length: SHORT_URL_LENGTH,
      type: "url-safe",
    });

    const urlRecord = await db.query.urlRecords.findFirst({
      where: eq(urlRecords.urlCode, urlCode),
    });

    if (!urlRecord) {
      break;
    }
  }
  return `${PROJECT_URL}/${urlCode}`;
}
