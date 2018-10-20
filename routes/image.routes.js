const express = require('express');
const fs = require('fs');
const path = require('path');
const { validarTokenImg } = require('../middleware/middlewares')
const app = express.Router();


app.get('/image/:type/:img', validarTokenImg, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    pathImg = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        pathNoImg = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(pathNoImg);
    }

})




module.exports = app;


