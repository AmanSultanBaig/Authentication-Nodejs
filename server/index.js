
const express = require("express")
const app = express();

const dbConnection = require("./db/connection")
const expressApplication = require("./expressApp")
require('dotenv').config()

const { DB_CONNECTION_STRING } = process.env;
const startServer = async () => {
    try {
        await dbConnection(DB_CONNECTION_STRING)
        expressApplication(app)
        console.log("DB Connection Established Successfully!")
    } catch (error) {
        console.log(error)
    }
}

startServer()