const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

var cors = require('cors');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 4000;

const Message = require('./models/message');
const mongoose = require('mongoose');

mongoose.connect(uri,{useUnifiedTopology:true,useNewUrlParser:true,});
app.use(cors());

app.use(express.static(path.join(__dirname,'..','client','build')));


io.on('connection',(socket)=>{
    
    Message.find().sort({createdAt:-1}).limit(10).exec((err,messages)=>
    {
        if(err)return console.error(err);

        socket.emit('init',messages);
    });

    socket.on('message',(msg)=>{
        const message = new Message({
            content:msg.content,
            name:msg.name,
        });

        message.save((err)=>{
            if(err)return console.error(err);
        });
    
        socket.broadcast.emit('push',msg);

    });
});

http.listen(port,()=>{});