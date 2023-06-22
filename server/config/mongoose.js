const mongoose = require('mongoose');
const {DB_CONNECTION} = require('./config');
const findOrCreate = require ('find-or-create-mongoose');

mongoose.connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', console.log.bind(console, 'DB connected!'));

mongoose.plugin(findOrCreate);

module.exports = db;