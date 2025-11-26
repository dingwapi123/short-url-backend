import { DataTypes } from "sequelize"
import sequelize from "../utils/dbHelper.js"

const URLRecord = sequelize.define("url_record", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  originalUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  urlCode: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
})

export default URLRecord
