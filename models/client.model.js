const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");

const Client = sequelize.define(
  "client",
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
    passport_number: {
        type: DataTypes.STRING,
        unique: true,
    },

    phone: {
        type: DataTypes.STRING,
        unique: true,
    },
    birth_date: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
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
      type: DataTypes.DATE,
    },

  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Client;
