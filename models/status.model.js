const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");

const Status = sequelize.define(
  "status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    type: {
      type: DataTypes.STRING(100), 
      unique: true,
    }

  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Status;
