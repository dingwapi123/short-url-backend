import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema.js"
import { logger } from "../utils/loggerHelper.js"

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

const poolConfig = connectionString
  ? {
      connectionString,
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }

const pool = new Pool(poolConfig)

export const db = drizzle(pool, { schema })

export const checkConnection = async () => {
  try {
    await pool.query("SELECT 1")
    logger.info("Connection has been established successfully.")
  } catch (error) {
    logger.error(error, "Unable to connect to the database:")
  }
}

// Initialize connection check
checkConnection()
