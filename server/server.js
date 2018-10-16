require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();


//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Router user
app.use(require('../routes/user.routes'));

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true })
    .then(() => console.log(`DB is connected`))
    .catch(err => console.log(err));

app.listen(process.env.PORT, () => console.log(`Server on port: ${process.env.PORT}`));