const express = require("express")
const app = express();
const dbConnection = require("./db/connection")
const routes = require("./routes/auth")
const { notFound, errorHandler } = require("./middlewares/error-handling")
const passport = require('passport');
const session = require("express-session")
require('dotenv').config()
require("./helper/passport")

const { secretKey, DB_CONNECTION_STRING, PORT } = process.env;

// its necessary to mention passport session before all upcoming middlewares
app.use(session({ secret: secretKey, resave: false, saveUninitialized: true })) 

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes)

app.use(passport.initialize())
app.use(passport.session())

app.use(errorHandler) // global error handling | middlerware
app.use(notFound) // if routes does'nt exist | error handling

let portNo = 4040 || PORT

const startServer = async () => {
    try {
        await dbConnection(DB_CONNECTION_STRING)
        console.log("DB Connection Established Successfully!")
        app.listen(portNo, __ => console.log(`App is running on http://localhost:${portNo}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()