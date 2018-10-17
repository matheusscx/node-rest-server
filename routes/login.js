const express = require('express');
const Users = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express.Router();


app.post('/login', (req, res) => {
    let body = req.body;
    Users.findOne({ email: body.email }, (err, user) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else if (!user) {
            res.status(400).json({
                status: false,
                err: {
                    message: 'Incorrect user or password'
                }
            });
        } else {
            if (!bcrypt.compareSync(body.password, user.password)) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'Incorrect user or password'
                    }
                });
            } else {
                let token = jwt.sign({ user }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
                res.json({
                    status: true,
                    user,
                    token
                });
            };
        };
    });
});



module.exports = app;