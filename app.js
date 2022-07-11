const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const session = require("express-session")
const dotenv = require("dotenv")
const passport = require("passport")
const mongoose = require("mongoose")

const { logConsole, logError } = require("./src/services/users.services.js")
const { router } = require("./src/routes/users.routes")

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
  logConsole.info(`Listening on port ${PORT}`)
})
// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const URL = process.env.URL
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: 30000
  }
}))
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) return ("Unable to Connect")
  logConsole.info("Connect to DB")
})

app.use(passport.initialize())
app.use(passport.session())

app.use("/", router)
