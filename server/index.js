const express = require("express")
const app = express();
const dbConnection = require("./db/connection")
const routes = require("./routes/auth")
const { notFound, errorHandler } = require("./middlewares/error-handling")
const passport = require('passport');
require('dotenv').config()
require("./helper/passport")

app.use(express.json())
app.use('/api', routes)

app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandler) // global error handling | middlerware
app.use(notFound) // if routes does'nt exist | error handling

let portNo = 4040 || process.env.PORT

const startServer = async () => {
    try {
        await dbConnection(process.env.DB_CONNECTION_STRING)
        console.log("DB Connection Established Successfully!")
        app.listen(portNo, __ => console.log(`App is running on http://localhost:${portNo}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()