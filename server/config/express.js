const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const config = require('./config')

// const auth = require('../middlewares/auth');
const cors = require('cors');
const passportConfig = require('../passport');

module.exports = (app) => {
    passportConfig(); //패스포트 설정
    app.use(cors({origin: 'http://localhost:3000', credentials: true}));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser(config.COOKIE_NAME));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: config.COOKIE_NAME,
        cookie: {
            httpOnly: true,
            secure: false
        },
    }));
    // app.use(auth);

    app.use(passport.initialize());
    app.use(passport.session());
};

//asdfasdf