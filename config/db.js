const config = require('config');
const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    config.get("db_name"),
    config.get("db_username"),
    config.get("db_password"),
    {
        dialect: "postgres",
        logging: true,
        host: config.get("db_host"),
        port: config.get("db_port"),
    }
)

/*
ssh -i \Users\User\desktop\key.pem ubuntu@3.76.123.24
icacls "C:\Users\User\desktop\key.pem" /inheritance:r
icacls "C:\Users\User\desktop\key.pem" /grant:r "$($env:USERNAME):R"
http://52.58.48.123:3000/api/status
*/