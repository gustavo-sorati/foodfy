const express = require('express');
const routes = express.Router();

const admin = require('./admin');
const public = require('./public');

routes.use('/', public);
routes.use('/admin', admin);

module.exports = routes;
