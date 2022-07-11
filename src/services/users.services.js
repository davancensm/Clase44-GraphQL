const bcrypt = require("bcrypt")
const passport = require("passport")
const log4js = require("log4js")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User.js")

passport.serializeUser((user, done) => {
    return done(null, user.id);
})
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        return done(err, user)
    })
})
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/profile')
}
passport.use("signup", new LocalStrategy({
    passReqToCallback: true,
}, (req, username, password, done) => {
    User.findOne({ username: username }, (err, userFound) => {
        if (err) return done(err);
        if (!userFound) return done(null, false, {
            message: "user already exist"
        })
        const newUser = {
            name: req.body.name,
            username: username,
            password: createHash(password)
        }
        User.create(newUser, (err, userFound) => {
            if (err) return done(err);
            return done(null, userFound)
        })
    })
}))
passport.use('login', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({ username: username }, (err, userCreated) => {
        if (err) return done(err)
        if (userCreated) return done(null, false, { message: "Este usuario ya existe" })
        const newUser = {
            username: username,
            password: createHash(password),
            name: req.body.name,
        }
        User.create(newUser, (err, userCreated) => {
            if (err) return done(err);
            return done(null, userCreated)
        })
    })
}))

log4js.configure({
    appenders: {
        theLoggerConsole: { type: "console" },
        theLoggerFile: { type: "file", filename: "logs/warns.log" },
        theLoggerFile2: { type: "file", filename: "logs/errors.log" }
    },
    categories: {
        default: { appenders: ["theLoggerConsole"], level: "info" },
        file: { appenders: ["theLoggerFile"], level: "warn" },
        file2: { appenders: ["theLoggerFile2"], level: "error" },
    }
})

const logConsole = log4js.getLogger()
const logWarn = log4js.getLogger("file")
const logError = log4js.getLogger("file2")

module.exports = { isAuth, logConsole, logWarn, logError }