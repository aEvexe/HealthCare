const { createLogger, format, transports } = require("winston");
const { PostgresTransport } = require("@innova2/winston-pg");
const config = require("config");

const { db_host, db_port, db_username, db_password, db_name } = config;

const connectionString = `postgres://${db_username}:${db_password}@${db_host}:${db_port}/${db_name}`;

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.label({ label: "HEALTHSERVICE" }),
    format.timestamp(),
    format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    new PostgresTransport({
      level: "info",
      connectionString: connectionString,
      tableName: "logs", // defaults to "logs"
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "logs/rejections.log" }),
  ],
  exitOnError: false,
});

module.exports = logger;
