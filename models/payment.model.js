const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");
const Contract = require("./contract.model");
const Status = require("./status.model");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.STRING(50),
    },
    payment_date: {
      type: DataTypes.STRING(100), 
    },
    payment_method: {
        type: DataTypes.STRING,
    },

  },
  { freezeTableName: true, timestamps: false }
);

Contract.hasMany(Payment)
Payment.belongsTo(Contract)

Status.hasMany(Payment)
Payment.belongsTo(Status)

module.exports = Payment;
