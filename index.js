const express = require("express")
const app = express();
const dbConnection = require("./db/connection")
const routes = require("./routes/auth")
require('dotenv').config()

app.use(express.json())
app.use('/api', routes)

let portNo = 4040 || process.env.PORT

const startServer = async () => {
    try {
        await dbConnection(process.env.DB_CONNECTION_STRING)
        app.listen(portNo, __ => console.log(`App is running on http://localhost:${portNo}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()