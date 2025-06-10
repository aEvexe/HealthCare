const sequelize = require("../config/db");
const { DataType, DataTypes } = require("sequelize");
const Client = require("./client.model");
const Service = require("./services.model");
const Status = require("./status.model");

const Appointment = sequelize.define(
  "appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_date: {
      type: DataTypes.STRING(50),
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

Client.hasMany(Appointment)
Appointment.belongsTo(Client)

Service.hasMany(Appointment)
Appointment.belongsTo(Service)

Status.hasMany(Appointment)
Appointment.belongsTo(Status)

module.exports = Appointment;
