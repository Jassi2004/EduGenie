const mongoose = require('mongoose');
require('dotenv').config()

const mongoURL = process.env.MONGO_URI

mongoose.connect(mongoURL , {
})

const db = mongoose.connection;

db.on('connected' , ()=>{
    console.log("connected to mongoDB server");
})

db.on('error' , (error)=>{
    console.log("Error connecting to mongodb server => " , error);
})

db.on('disconnected' , ()=>{
    console.log("Disconnected to mongodb server");
})

module.exports = db; 