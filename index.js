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

doc.on('dev:register', function (payload) {
  console.log(payload.name);
  doc.emit('dev:notify', {
    name: 'command-panel',
    meta: {
      deviceName: payload.name,
      deviceType: payload.deviceType
    }
  })
});

// This should be the entrance sequence
doc.defineSequence('entrance')
  .addRelay([new Relay(
    {'name': 'pre-entrance-sensor', 'value': true}, 
    {'name': 'entrance-terminal', 'command': 'display!'}
  )])
  .addRelay([new Relay(
    {'name': 'entrance-terminal', 'qr-data': ''}, 
    {'name': 'entrance-gate', 'command': 'open!'}
  )])
  .addRelay([new Relay(
    {'name': 'entrance-gate', 'status': 'opened'},
    {}
  )])
  .addRelay([new Relay(
    {'name': 'post-entrance-sensor', 'value': true},
    {}
  )])
  .addRelay([new Relay(
    {'name': 'post-entrance-sensor', 'value': false},
    {'name': 'entrance-gate', 'command': 'close!'}
  )])
  .addRelay([new Relay(
    {'name': 'entrance-gate', 'status': 'closed'},
    {}
  )]);


doc.listen([
  'entrance',
  'parking',
  'exit'
]);

console.log("Listening on port: 8080");
