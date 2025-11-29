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
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  visitCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
})

export default URLRecord
