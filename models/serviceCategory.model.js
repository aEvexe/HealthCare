const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");

const ServiceCat = sequelize.define(
  "ServiceCat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    desc: {
      type: DataTypes.STRING(100), 
    }

  },
  { freezeTableName: true, timestamps: false }
);

module.exports = ServiceCat;
