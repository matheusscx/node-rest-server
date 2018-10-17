const express = require('express');
const app = express.Router();

app.use(require('./user.routes'));
app.use(require('./login'));


module.exports = app;