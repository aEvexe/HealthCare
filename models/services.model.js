const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");
const Owner = require("./owner.model");
const ServiceCat = require("./serviceCategory.model");

const Service = sequelize.define(
  "service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.STRING(50),
    },
    duration: {
      type: DataTypes.STRING(100), 
    },
    created_at: {
        type: DataTypes.STRING,
    }

  },
  { freezeTableName: true, timestamps: false }
);

Owner.hasMany(Service)
Service.belongsTo(Owner)

ServiceCat.hasMany(Service)
Service.belongsTo(ServiceCat)

module.exports = Service;
