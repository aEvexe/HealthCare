const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");

const Owner = sequelize.define(
  "owner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(100), 
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
    },
    hashed_password: {
        type: DataTypes.STRING
    },

    hashed_token: {
        type: DataTypes.STRING
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activation_link: {
      type: DataTypes.STRING,
      unique: true,
    },
    created_at: {
      type: DataTypes.STRING,
    },

  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Owner;
