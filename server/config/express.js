const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

module.exports = (app) => {
    app.use(cors({ origin: 
    [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://default-client-service-c63f5-17896865-377617edafd0.kr.lb.naverncp.com'
    ]
    , credentials: true }));

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());
};
