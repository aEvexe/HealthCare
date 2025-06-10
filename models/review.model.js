const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");
const Client = require("./client.model");
const Service = require("./services.model");

const Review = sequelize.define(
  "review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.STRING(50),
    },
    comment: {
      type: DataTypes.STRING(100), 
    },
    created_at: {
        type: DataTypes.STRING,
    },
    updated_at: {
        type: DataTypes.STRING,
    }

  },
  { freezeTableName: true, timestamps: false }
);

Client.hasMany(Review)
Review.belongsTo(Client)

Service.hasMany(Review)
Review.belongsTo(Service)

module.exports = Review;
