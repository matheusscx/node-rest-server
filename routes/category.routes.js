const express = require('express');
const Categories = require('../models/category.models');
const { validarToken, validarAdminRole } = require('../middleware/middlewares')

const app = express.Router();


app.get('/categories', validarToken, (req, res) => {
    Categories.find({})
    .sort('description')
    .populate('userId','name email')
    .exec((err, categories) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!categories[0]) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found',
                    }
                });
            } else {
                Categories.countDocuments((err, count) => {
                    if (err) {
                        res.status(500).json({
                            status: false,
                            err
                        });
                    }
                    else {
                        res.json({
                            status: true,
                            categories,
                            count
                        });
                    }
                });
            }
        }
    });

    app.get('/categories/:id', validarToken, (req, res) => {
        let { id } = req.params;
        console.log(id);
        Categories.findOne({})
        .populate('userId','name email')
        .exec({ _id: id }, (err, category) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                if (!category) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No records found',
                        }
                    });
                } else {
                    res.json({
                        status: true,
                        category
                    });

                }

            }

        });

    });

    app.post('/categories', validarToken, (req, res) => {
        let { description } = req.body;
        let userId = req.user._id;

        let categories = new Categories({
            description,
            userId
        });

        categories.save((err, categories) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                res.status(201).json({
                    status: true,
                    categories
                });
            }
        });
    });


    app.put('/categories/:id', [validarToken, validarAdminRole], (req, res) => {
        let { id } = req.params;
        let { description } = req.body;
        let userId = req.user._id;
        Categories.findOneAndUpdate(id, { description, userId },{new:true, runValidators: true}, (err, category) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                if (!category) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No records found',
                        }
                    });
                } else {
                    res.status(201).json({
                        status: true,
                        category
                    });
                }

            }

        });

    });

    app.delete('/categories/:id', [validarToken, validarAdminRole], (req, res) => {
        let { id } = req.params;
        Categories.findOneAndRemove({ _id: id }, (err, category) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                if (!category) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No records found',
                        }
                    });
                } else {
                    res.json({
                        status: true,
                        category
                    })
                }
            }
        });

    });
});


module.exports = app;