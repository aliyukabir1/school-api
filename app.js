const express = require('express');
const morgan = require('morgan');
const userRoute = require('./api/routes/users');
const prefectsRoute = require('./api/routes/prefects')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();


const url = 'mongodb://127.0.0.1:27017/school';



app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header('Accces-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
        return res.status(200).json({});

    }
next();
})


// mongoose middlewares
mongoose.connect(url,{useNewUrlParser:true})
mongoose.Promise = global.Promise;
mongoose.set({"strictQuery":true})
const db =  mongoose.connection
db.once('open',()=>{console.log('Connection to database successfull')})
db.on('error',()=>{console.log('Connection to database failed')})



// middleware routes
app.use('/users',userRoute);
app.use('/prefects',prefectsRoute);


app.get('/',(req,res)=>{
    res.status(200).json({
        'message':"success"
    })
})


// error middleware
app.use((req,res,next)=>{
    const error= Error('Not found');
    error.status = 404

    next(error)
})
app.use((error,req,res,next)=>{
res.status(error.statusCode || 500)
res.json({
    message: error.message
})
})

module.exports = app;