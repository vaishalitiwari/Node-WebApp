var socket = io();

function scrollToBottom(){
  //Selectors
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child');
  //Heights
  var clientHeight=messages.prop('clientHeight');
  var scrollTop=messages.prop('scrollTop');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight= newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight+lastMessageHeight>=scrollHeight){
      messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',function(){
  console.log('connected to server');
});
socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage',function(doc){
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text:doc.text,
    from:doc.from
  });
  jQuery('#messages').append(html)
  scrollToBottom();

  // console.log('New message received ', JSON.stringify(doc,undefined,2));
  // var li = jQuery('<li></li>');
  // li.text(`${doc.from}: ${doc.text}`);
  // jQuery('#messages').append(li);
})

socket.on('newLocationMessage',function(message){
  var template = jQuery('#loc-message-template').html();
  var html = Mustache.render(template,{
    url:message.url,
    from:message.from
  });
  jQuery('#messages').append(html)
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">I am here</a>');
  // li.text(`${message.from}: `);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage',{
    from: 'User',
    text: messageTextbox.val()
  },function(){
	  messageTextbox.val('')
  });

  var locButton = jQuery('#sendLocation');
  locButton.on('click',function(){
    if(!navigator.geolocation){
      return alert('GeoLocation not supported by your browser');
    }
   locButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
	  locButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },function(){
	  locButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch Location');
    });
      });
});
