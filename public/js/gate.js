$(function () {
  var socket = io.connect('http://localhost:8080');
   $('#qr').click(function () {
      socket.emit('dev:trigger', {
        'name': 'entrance-term-qr'
      }) 
   });


   $("#sensed").mousedown(function () {
     console.log("This should only happen once");
   });

   socket.on("dev:command", function (data) {
     if (data.name === "entrance-gate") {
       alert("Opening the gate");
     }
   });
});
