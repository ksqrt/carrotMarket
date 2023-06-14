const express = require('express');
const cookieParser = require('cookie-parser');
<<<<<<< HEAD
const cors = require('cors');

module.exports = (app) => {
    app.use(cors({ origin: ['http://localhost:3000', 'http://223.130.129.29:3000'], credentials: true }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());
=======
const session = require('express-session');
const config = require('./config')

// const auth = require('../middlewares/auth');
const cors = require('cors');

module.exports = (app) => {
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser(config.COOKIE_NAME));
    
>>>>>>> 60b8f23d6f4067fe51eb0cf890e4ebeb764984f4
};
