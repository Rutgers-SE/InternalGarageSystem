$(function () {
  var socket = io.connect('http://localhost:8080');
   $('#sensed').click(function () {
      socket.emit('dev:trigger', {
        'name': 'entrance-pre-term-sensor',
        'meta': {
          'status': true
        },
      }) 
   });


   $("#sensed").mousedown(function () {
     console.log("This should only happen once");
   });

   socket.on("dev:command", function (data) {
     alert("Call from DOC");
   });
});