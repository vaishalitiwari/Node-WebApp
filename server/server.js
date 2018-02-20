const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

const publicPath = path.join(__dirname,'..','public');
const port = process.env.PORT||3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new User connected ');

  socket.emit('newMessage', {
    from:'someone1',
    text: 'Hey what is going on?'
  });

  socket.on('disconnect',(socket)=>{
    console.log('disconnected from client');
  });
  socket.on('createMessage',(message)=>{
    console.log('Create message', message);
  });

});



server.listen(port,()=>{
  console.log(`Server is up in Port ${port}`);
});
