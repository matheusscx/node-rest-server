const express = require('express');
const Users = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,// Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let userGoogle = await verify(token)
        .catch(err => {
            return res.status(403).json({
                status: false,
                err
            });
        });

    Users.findOne({ email: userGoogle.email }, (err, user) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!user) {
                let user = new Users({
                    name: userGoogle.name,
                    email: userGoogle.email,
                    img: userGoogle.img,
                    google: true,
                    password: 'undefine'
                });

                user.save((err, user) => {
                    if (err) {
                        res.status(500).json({
                            status: false,
                            err
                        });
                    } else {
                        let token = jwt.sign({ user }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
                        res.json({
                            status: true,
                            user,
                            token
                        });
                    }
                })
            } else {
                if (user.google === false) {
                    res.status(403).json({
                        status: false,
                        err: 'You can not start session with Google using your original account'
                    });
                } else {
                    let token = jwt.sign({ user }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
                    res.json({
                        status: true,
                        user,
                        token
                    });
                }
            }
        }
    });
});



module.exports = app;