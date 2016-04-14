"use strict";
// programming deps
var _ = require('lodash');

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var port = normalizePort(process.env.PORT || '8080')

// web  server deps
var app = require('express')();
app.set('port', port);
var server = require('http').Server(app);
var io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
server.listen(port);

// project libs
var SpaceManager = require("./lib/spaceManager.js");
var {DeviceOrchestrator, Relay} = require('./lib/DeviceOrchestrator');

var spaceManOne = new SpaceManager(200);

require('./routes/middleware')(app);
require('./routes')(app);

// I want this porition to be in a separate file
var doc = new DeviceOrchestrator({io});

// attaching unary device events
var {devices, ev} = require('./lib/events')(doc);

// TODO: might move this to `lib/event/index`
// TODO: reflect the real entrance sequence
doc.defineSequence('entrance')
  .addRelay([new Relay(
    {'name': 'pre-entrance-sensor', 'status': {'signal':'HI'}}, 
    {'name': 'entrance-terminal', 'actions': {'command': 'display!'}}
  )])
  .addRelay([new Relay(
    {'name': 'entrance-terminal', 'status': {'qr-data': 'RAW', 'action-type': 'reservation'}}, 
    {'name': 'entrance-gate', 'actions': {'command': 'open!'}}
  )])
  .addRelay([new Relay(
    {'name': 'entrance-gate', 'status': {'arm': 'opened'}},
    {}
  )])
  .addRelay([new Relay(
    {'name': 'post-entrance-sensor', 'status': {'signal': 'HI'}},
    {}
  )])
  .addRelay([new Relay(
    {'name': 'post-entrance-sensor', 'status': {'signal': 'LOW'}},
    {'name': 'entrance-gate', 'actions': {'command': 'close!'}}
  )])
  .addRelay([new Relay(
    {'name': 'entrance-gate', 'status': {'arm': 'closed'}},
    {}
  )]);


doc.listen({devices, ev},[
  'entrance',
  'parking',
  'exit'
]);

console.log("Listening on port: " + port);
