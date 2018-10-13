require('./config/config');
const express = require('express');
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/users', (req, res) => {
    res.json({
        status: "ok"
    })
});

app.get('/users/:id', (req, res) => {
    let { id } = req.params
    res.json({
        status: "ok",
        id
    })
});

app.post('/users', (req, res) => {
    let body = req.body
    if(body.name === undefined){
        res.status(400).json({
            status: false,
            message: "name is required"
        })
    }else{
        res.json({
            status: "ok",
            body
        })
    }
    
    

});

app.put('/users/:id', (req, res) => {
    let { id } = req.params
    res.json({
        status: "ok",
        id
    })
});

app.delete('/users/:id', (req, res) => {
    let { id } = req.params
    res.json({
        status: "ok",
        id
    })
});


app.listen(process.env.PORT, () => console.log(`Server on port: ${process.env.PORT}`));