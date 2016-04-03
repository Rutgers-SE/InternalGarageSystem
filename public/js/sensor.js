var socket = io.connect('http://localhost:8080');



$(function () {
   $('#sensed').click(function () {
      socket.emit('dev:trigger', {
        'name': 'est',
        'meta': {},
      }) 
   });
});
