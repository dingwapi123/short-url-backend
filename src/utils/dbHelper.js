import { Sequelize } from "sequelize"
import { logger } from "./loggerHelper.js"

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}
// console.log(dbConfig)

const sequelize = new Sequelize(
  dbConfig.name,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "postgres",
    logging: (...msg) => logger.info(msg),
  }
)

try {
  await sequelize.authenticate()
  logger.info("Connection has been established successfully.")
} catch (error) {
  logger.error("Unable to connect to the database:", error)
}

export default sequelize
