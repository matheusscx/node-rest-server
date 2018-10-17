
//========= PORT ==========

process.env.PORT = process.env.PORT || 3000;

//========= ENVIROMENT ==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========= SEED TOKEN ===========

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed-desarrollo';

//========= EXPIRATION TOKEN  ===========

process.env.EXPIRATION_TOKEN =  '30d';

//============== DB ===============
// wscAV83jBjmWxim
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
