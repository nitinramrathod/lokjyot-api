const mongoose = require('mongoose');

const mongodb_uri = process.env.MONGODB_URI || '';

mongoose.connect(mongodb_uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res=>{
    console.log('Connected to Mongo Database Successfully...');
}).catch(err=>{
    console.log('Error to connect to Mongodb ', err);
})