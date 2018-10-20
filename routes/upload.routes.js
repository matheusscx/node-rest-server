const express = require('express');
const fileUpload = require('express-fileupload');
const Users = require('../models/user.models');
const Products = require('../models/product.models');
const fs = require('fs');
const app = express.Router();

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {
    if (!req.files) {
        return res.status(400).json({
            status: false,
            err: {
                message: 'No files were uploaded'
            }
        })
    } else {

        let type = req.params.type;
        let allowedType = ['users', 'products'];

        if (allowedType.indexOf(type) < 0) {
            return res.status(400).json({
                status: false,
                err: {
                    message: `the type ${type} is not allowed. The allowed types are: ${allowedType.join(', ')}`
                }
            });
        } else {

            let id = req.params.id;
            let allowedFiles = ['jpeg', 'png', 'gif', 'jpg'];
            let file = req.files.archivo;
            let fileNameCut = file.name.split('.');
            let extension = fileNameCut[fileNameCut.length - 1];
            let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

            if (allowedFiles.indexOf(extension) > 0) {
                file.mv(`uploads/${type}/${fileName}`, err => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            err
                        })
                    } else {
                        if (type === 'users') {
                            imgUser(id, fileName, res);
                        } else {
                            imgProduct(id, fileName, res);
                        }
                    }
                });
            } else {
                return res.status(400).json({
                    status: false,
                    err: {
                        message: `the file with the extension ${extension} is not allowed.` +
                            ` the file extensions allowed are: ${allowedFiles.join(', ')}`
                    }
                })
            }
        }
    }
});

let imgUser = (id, imgName, res) => {
    Users.findOne({ _id: id }, (err, userDB) => {
        if (err) {
            deleteFile('users', imgName);
            return res.status(500).json({
                status: false,
                err
            })
        } else {
            if (!userDB) {
                deleteFile('users', imgName);
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found'
                    }
                })
            } else {
                let oldImg = userDB.img;
                userDB.img = imgName;

                userDB.save((err, user) => {
                    if (err) {
                        deleteFile('users', imgName);
                        return res.status(500).json({
                            status: false,
                            err
                        })
                    } else {
                        deleteFile('users', oldImg);
                        res.json({
                            status: true,
                            user,
                        })
                    }
                })
            }
        }
    })
}

let imgProduct = (id, imgName, res) => {
    Products.findOne({ _id: id }, (err, productDB) => {
        if (err) {
            deleteFile('products', imgName);
            return res.status(500).json({
                status: false,
                err
            })
        } else {
            if (!productDB) {
                deleteFile('products', imgName);
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'No records found'
                    }
                })
            } else {
                let oldImg = productDB.img;
                productDB.img = imgName;
                productDB.save((err, product) => {
                    if (err) {
                        deleteFile('products', imgName);
                        return res.status(500).json({
                            status: false,
                            err
                        })
                    } else {
                        deleteFile('products', oldImg);
                        res.json({
                            status: true,
                            product,
                        })
                    }
                })
            }
        }
    })
}

let deleteFile = (tipo, imgName) => {
    if (fs.existsSync(`uploads/${tipo}/${imgName}`)) {
        fs.unlinkSync(`uploads/${tipo}/${imgName}`);
    }

}

module.exports = app;