const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");
const Client = require("./client.model");
const Service = require("./services.model");
const Admin = require("./admin.model");
const Owner = require("./owner.model");
const Status = require("./status.model");

const Contract = sequelize.define(
  "contract",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contract_date: {
        type: DataTypes.STRING,
    },
    updated_at: {
        type: DataTypes.STRING,
    }

  },
  { freezeTableName: true, timestamps: false }
);

Client.hasMany(Contract)
Contract.belongsTo(Client)

Service.hasMany(Contract)
Contract.belongsTo(Service)

Admin.hasMany(Contract)
Contract.belongsTo(Admin)

Owner.hasMany(Contract)
Contract.belongsTo(Owner)

Status.hasMany(Contract)
Contract.belongsTo(Status)



module.exports = Contract;
