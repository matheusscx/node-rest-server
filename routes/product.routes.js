const express = require('express');
const Product = require('../models/product.models');
const { validarToken } = require('../middleware/middlewares');
const app = express.Router();




app.get('/products/buscar/:clave', validarToken, (req, res) => {
    let regexp = new RegExp(req.params.clave , 'i');
    Product.find({name: regexp })
        .populate('category', 'description')
        .exec((err, product) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                })
            } else {
                if (!product[0]) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No products found'
                        }
                    })
                } else {
                    res.json({
                        status: true,
                        product
                    })
                }
            }
        })

})

app.get('/products', validarToken, (req, res) => {
    let skip = Number(req.params.skip) || 0;
    let limit = Number(req.param.limit) || 5;
    Product.find({})
        .skip(skip)
        .limit(limit)
        .sort('name')
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                if (!products[0]) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No records found',
                        }
                    });
                } else {
                    Product.countDocuments((err, count) => {
                        if (err) {
                            res.status(500).json({
                                status: false,
                                err
                            });
                        }
                        else {
                            res.json({
                                status: true,
                                products,
                                count
                            });
                        }
                    });
                }
            }
        });

});

app.get('/products/:id', validarToken, (req, res) => {
    let { id } = req.params;
    Product.findOne({})
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec({ _id: id }, (err, product) => {
            if (err) {
                res.status(500).json({
                    status: false,
                    err
                });
            } else {
                if (!product) {
                    res.status(400).json({
                        status: false,
                        err: {
                            message: 'No records found',
                        }
                    });
                } else {
                    res.json({
                        status: true,
                        product
                    });

                }

            }

        });

});

app.post('/products', validarToken, (req, res) => {
    let { name, description, price, status, category } = req.body;
    let user = req.user._id;

    let product = new Product({
        name,
        description,
        price,
        status,
        category,
        user
    });

    product.save((err, product) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            res.status(201).json({
                status: true,
                product
            });
        }
    });
});

app.put('/products/:id', validarToken, (req, res) => {
    let { id } = req.params;
    let body = req.body;
    body.user = req.user._id;


    Product.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, product) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!product) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found',
                    }
                });
            } else {
                res.json({
                    status: true,
                    product
                });
            }

        }

    });

});


app.delete('/products/:id', validarToken, (req, res) => {
    let _id = req.params.id;
    Product.findOneAndUpdate({ _id }, { $set: { status: false } }, { new: true }, (err, product) => {
        if (err) {
            res.status(500).json({
                status: false,
                err
            });
        } else {
            if (!product) {
                res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found',
                    }
                });
            } else {
                res.json({
                    status: true,
                    product
                });
            };

        };
    })
})




module.exports = app;