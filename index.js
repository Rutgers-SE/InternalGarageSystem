"use strict";
// programming deps
var _ = require('lodash');


// web  server deps
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
server.listen(8080);

// project libs
var SpaceManager = require("./lib/spaceManager.js");
var {DeviceOrchestrator, Sequence, Relay} = require('./lib/DeviceOrchestrator');

var spaceManOne = new SpaceManager(200);


require('./routes/middleware')(app);
require('./routes')(app);

var doc = new DeviceOrchestrator({io});

// the templates for the signals should be stored in the signals subdirectory
// These are not simplemented

//var sense = require('./lib/signals/sensor');
//var term = require('./lib/signals/terminal');
//var gate = require('./lib/signals/gate')


// This should be the entrance sequence
doc.defineSequence('entrance')
  .addRelay([new Relay(
    {'name': 'entrance-pre-term-sensor', 'meta': { 'status': true }}, 
    {'name': 'entrance-terminal'}
  )])
  
  .addRelay([new Relay(
    {'name': 'entrance-terminal-qr'}, 
    {'name': 'entrance-gate', 'meta': {'action': 'open'}}
  )]);


doc.listen([
  'entrance',
  'parking',
  'exit'
]);

console.log("Listening on port: 8080");


io.on("connection", (socket) => {
  socket.on("Device:Register", (pl)=> {


  });

});





