const express = require('express');
const Users = require('../models/user.models');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { validarToken, validarAdminRole } = require('../middleware/middlewares')
const app = express.Router();

app.get('/users', validarToken, (req, res) => {
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;

    Users.find({ status: true }, 'name email img role google status')
        .skip(skip)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                if (!users[0]) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No records found',
                        }
                    });
                } else {
                    Users.countDocuments({ status: true }, (err, count) => {
                        res.json({
                            status: true,
                            users,
                            count
                        });
                    });
                };
            };
        });
});

app.get('/users/:id', validarToken, (req, res) => {
    let { id } = req.params;
    Users.findById(id, (err, user) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!user) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found',
                    }
                });
            } else {
                res.json({
                    status: true,
                    user
                });
            };
        };
    });
});

app.post('/users', [validarToken, validarAdminRole], (req, res) => {
    let body = req.body;
    let user = new Users({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            res.status(201).json({
                status: true,
                user
            });
        };
    });
});

app.put('/users/:id', [validarToken,validarAdminRole], (req, res) => {
    let { id } = req.params;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    Users.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, user) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!user) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found',
                    }
                });
            } else {
                res.json({
                    status: true,
                    user
                });
            };
        };
    });
});

app.delete('/users/:id', [validarToken, validarAdminRole], (req, res) => {
    let { id } = req.params
    Users.findOneAndUpdate({ _id: id }, { $set: { status: false } }, { new: true }, (err, user) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!user) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found',
                    }
                });
            } else {
                res.json({
                    status: true,
                    user
                });
            };

        };
    });
});

module.exports = app;