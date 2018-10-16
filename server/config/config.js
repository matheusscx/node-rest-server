
//========= PORT ==========

process.env.PORT = process.env.PORT || 3000;

//========= environment ==========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============== DB ===============
// wscAV83jBjmWxim
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://rest-server-cafe:wscAV83jBjmWxim@ds047207.mlab.com:47207/rest-server-cafe';
}
process.env.URLDB = urlDB;
