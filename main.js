const config = require('config');
const express = require('express');
const sequelize = require('./config/db')
const indexRoute = require("./routes");
const cookieParser = require('cookie-parser');
const errorHandingMiddleware = require('./middlewares/errors/error-handing.middleware');

const logger = require('./services/logger.service');
const PORT = config.get("PORT")

logger.error("Error rejimi");
logger.info("App started");
logger.warn("Warning test");
logger.error("Error test");

const app = express()
app.use(cookieParser())
app.use(express.json());
app.use("/api", indexRoute)
app.use(errorHandingMiddleware)

async function start(){
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true})
        app.listen(PORT, () => { 
            console.log(`Server running at port http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()