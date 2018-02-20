var socket = io();
socket.on('connect',function(){
  console.log('connected to server');
  socket.emit('createMessage',{
    to:'someone2',
    text:'Hello !!'
  })
});
socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage',function(doc){
  console.log('New message received ', JSON.stringify(doc,undefined,2));
})
