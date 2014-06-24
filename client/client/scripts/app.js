// YOUR CODE HERE:
//global variables:
//var app.server = 'https://api.parse.com/1/classes/chatterbox';
function getUrlParameters(parameter, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
   var currLocation = window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;

   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;
        }
   }

   if(!returnBool) return false;
}

var app = {};
app.server = 'http://127.0.0.1:3000';
app.roomnames = {};
app.currentRoom = 'lobby';
app.friends = {};
app.init = function(){
  app.username = getUrlParameters('username');
  app.newestDate = undefined;
  app.messages = [];
  if (!app.username) { app.username = 'Anonymous'; }
  function getMessages(){
    app.fetch(app.initMessages);
    setTimeout(getMessages, 2000);
  }
  ///setTimeout(function(){ app.fetch(app.initMessages); ), 3000);
  getMessages();
};

app.send = function(message){
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(func){
  // console.log('foo');
  $.ajax({
    url: app.server,// + '?order=-createdAt',
    type: 'GET',
    success: function(data){
      func(data);
    }
  });
};

app.initMessages = function(data){
  // console.log(data);
  // data['results'].reverse();
  var messages = [];
  _.each(data['results'], function(item){
    item.date = new Date(item.createdAt);
    item.timestamp = item.date.getTime();
    if (app.newestDate === undefined || item.timestamp > app.newestDate){
      app.addMessage(item);
      console.log('foo');
      app.newestDate = item.timestamp;
    }
  });
};


app.clearMessages = function(){
  $('#chats').empty();
  app.messages = [];
};

app.addMessage = function(message){
  console.log('wtf')
  if (message['roomname']  == false){
    message['roomname'] = 'lobby'; //assign default room if none given
  }
  else if(!/^[a-z0-9]+$/i.test(message['roomname'])){
    message['roomname'] = 'evil';
  }
  if (message['username'] == false || message['username'] === undefined){
    message['username'] = 'Anonymous Coward';
  }
  app.addRoom(message['roomname']);
  if (app.friends[message['username']]){
    var toAdd = "<div class='message'><a href='#' class='username' style='font-weight: bolder'></a><div class='text'></div></div>"
  }
  else{
   var toAdd = "<div class='message'><a href='#' class='username'></a><div class='text'></div></div>"
  }
  $("#chats ." + message["roomname"]).prepend(toAdd);
  $('#chats .' + message['roomname'] + " .message .username").first().text(message.username);

  $('#chats .' + message['roomname'] + " .message .text").first().text(message.text);
};

app.addRoom = function(roomName){
  if (app.roomnames[roomName] !== true && /^[a-z0-9]+$/i.test(roomName)){
    $('#roomSelect').append("<option value='" + roomName + "'>" + roomName + "</option>");
    $('#chats').append("<div class='" + roomName + "'></div>");
    app.roomnames[roomName] = true;
    if (app.currentRoom !== roomName){
      $('#chats .' + roomName).hide();
    }
  }
};

app.switchRoom = function(roomName){
  if (app.currentRoom === roomName){
    return;
  }
  $('#chats .' +  app.currentRoom).toggle();
  $('#chats .' + roomName).toggle();
  app.currentRoom = roomName;
};

app.friend = function(friendName){
  if (!app.friends[friendName]) {
    app.friends[friendName] = true;
    $('.username').filter(function() {
    return $(this).text() === friendName;
}).css({"font-weight": 'bolder'});
  }
  else {
    app.friends[friendName] = false;
     $('.username').filter(function() {
    return $(this).text() === friendName;
}).css({"font-weight": 'lighter'});
  }
};


$(document).ready( function(){
  try{
    app.init();
    $('#roomSelect').change(function(){
      app.switchRoom($('#roomSelect option:selected').val());
    });
    $('#userMessage button').click(function(){
      var str = $('#userMessage textarea').val();
      if (/\S/.test(str)){
        var toSend = {};
        toSend['text'] = str;
        toSend['username'] = app.username;
        toSend['roomname'] = app.currentRoom;
        app.send(toSend);
        $('#userMessage textarea').val('');
      }
    });
    console.log('foooo');
    $('#chats').on('click', '.username', function(ev){
      console.log('wtfff');
      var friendName = $(this).text();
      app.friend(friendName);
      ev.preventDefault();
      ev.stopPropagation();
    });
    $('#addRoom').click(function(){
      var toAdd = prompt("Enter room name:", 'lobby');
      app.addRoom(toAdd);
      if (app.roomnames[toAdd]){
        app.switchRoom(toAdd);
        $('#roomSelect').val(toAdd);
      }
    });
  }
  catch(err){

  }
});
