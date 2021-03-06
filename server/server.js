require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();


//middleware

    // parse application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));
    
    // parse application/json
app.use(express.json());

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));

// Configuración global de rutas
app.use(require('../routes/index.routes'));

// conexión a la db
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(() => console.log(`DB is connected`))
    .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () => console.log(`Server on port: ${process.env.PORT}`));