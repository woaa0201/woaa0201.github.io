$(function () {
  var content = $('#content');
  var users = $('#users');
  var input = $('#input');
  var status = $('#status');

  var myColor = false;
  var myName = false;

  window.WebSocket = window.WebSocket || window.MozWebSocket;

  if(!window.WebSocket) {
    content.html($('<p>', { text: 'Sorry, but your browser does not support WebSockets.'} ));
    input.hide();
    $('span').hide();
    return;
  }

  var connection = new WebSocket('ws://127.0.0.1:2112');

  connection.onopen = function() {
    input.removeAttr('disabled');
    status.text('Choose name:');
  };

  connection.onerror = function(error) {
    content.html($('<p>', { text: 'Sorry, but there has been a problem with the connection.</p>' } ));
  };

  connection.onmessage = function(message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('This is not valid JSON: ' + message.data);
      return;
    }

    if (json.type === 'color') {
      myColor = json.data;
      status.text(myName + ': ').css('color', myColor);
      input.removeAttr('disabled').focus();
    } else if (json.type === 'user') {
      addUser(json.uname, json.color);
    } else if (json.type === 'remove-user') {
      removeUser(json.uname);
    } else if (json.type === 'history') {
      for (var i = 0; i < json.data.length; i++) {
        addMessage(json.data[i].author,
                   json.data[i].text,
                   json.data[i].color,
                   new Date(json.data[i].time));
        }
    } else if (json.type === 'message') {
      input.removeAttr('disabled');
      addMessage(json.data.author,
                 json.data.text,
                 json.data.color,
                 new Date(json.data.time));
    } else {
      console.log('Thats some crazy ass JSON homie: ', json);
    }
  };

  input.keydown(function(e) {
    if (e.keyCode === 13) {
      var msg = $(this).val();
      if (!msg) {
        return;
      }

      connection.send(msg);
      $(this).val('');
      // disable input until server responds
      input.attr('disabled', 'disabled');

      if (myName === false) {
        myName = msg;
      }
    }
  });

  function addMessage(author, message, color, dt) {
    content.append('<p><span style="color:' + color + '">' + author + '</span> @ '
    + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
    + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
    + ': ' + message + '</p>');
  }

  function addUser(name, color) {
    users.append('<div id="user-' + name + '" style="color:' + color + '">' + name + '</div>');
  }

  function removeUser(name) {
    var divId = 'user-' + name;
    console.log("remove user being called with: " + divId);
    $("div[id='"+divId+"']").remove();
  }
});
