"use strict";
// programming deps
let _ = require('lodash');

function normalizePort(val) {
  let port = parseInt(val, 10);

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

let port = normalizePort(process.env.PORT || '9001');

// web  server deps
let app = require('express')();
app.set('port', port);
let server = require('http').Server(app);
let io = require('socket.io')(server, {'transports': ['websocket', 'polling']});
server.listen(port);

// Project Classes
let SpaceManager = require("./lib/spaceManager.js");
let {DeviceOrchestrator, Relay} = require('./lib/DeviceOrchestrator');
let {Garage} = require('./lib/Garage');


let spaceCount = 5;
// lets define the garage
let spaceManOne = new SpaceManager(spaceCount);
let PhysicalGarage  = new Garage(spaceCount);
let VirtualGarage = new Garage(spaceCount);

require('./routes/middleware')(app);
require('./routes')(app);

// I want this porition to be in a separate file
let doc = new DeviceOrchestrator({io});

// getting the model
let {db} = require('./lib/model');

// attaching unary device events
let {devices} = require('./lib/events')(doc, {
  PhysicalGarage,
  VirtualGarage,
  db
});

// TODO: might move this to `lib/event/index`
// TODO: reflect the real entrance sequence
doc.defineSequence('entrance')
  .addRelay([
    new Relay({'name': 'pre-entrance-sensor', 'status': {'signal':'HI'}},
              {'name': 'entrance-terminal', 'actions': {'command': 'display!'}})
  ])
  .addRelay([
    new Relay({'name': 'entrance-terminal', 'status': {'qr-data': 'RAW', 'action-type': 'reservation'}},
              {'name': 'entrance-gate', 'actions': {'command': 'open!'}})
  ])
  .addRelay([
    new Relay({'name': 'entrance-gate', 'status': {'arm': 'opened'}},
              {})
  ])
  .addRelay([
    new Relay({'name': 'post-entrance-sensor', 'status': {'signal': 'HI'}},
              {})
  ])
  .addRelay([
    new Relay({'name': 'post-entrance-sensor', 'status': {'signal': 'LOW'}},
              {'name': 'entrance-gate', 'actions': {'command': 'close!'}})
  ])
  .addRelay([
    new Relay({'name': 'entrance-gate', 'status': {'arm': 'closed'}},
              {'trip': 'parking'})
  ]);

doc.defineSequence('parking')
  .addRelay([
    new Relay({'name': 'panel', 'status': {'sensors': 'on'}},
              {})
  ])
  .addRelay([
    new Relay({'name': 'parking-lot-sensor', 'status': {'signal': 'HI'}},
              {'name': 'parking-space-sensor', 'status': {'command': 'await!'}})
  ])
  .addRelay([
    new Relay({'name': 'parking-lot-sensor', 'status': {'signal': 'HI'}},
              {'name': 'parking-space-sensor', 'status': {'command': 'await!'}})
  ]);


doc.defineSequence('exit')
  .addRelay([
    new Relay({'name': 'pre-exit-sensor', 'status': {'signal':'HI'}},
              {'name': 'exit-terminal', 'actions': {'command': 'display!'}})
  ])
  .addRelay([
    new Relay({'name': 'exit-terminal', 'status': {'qr-data': 'RAW', 'action-type': 'reservation'}},
              {'name': 'exit-gate', 'actions': {'command': 'open!'}})
  ])
  .addRelay([
    new Relay({'name': 'exit-gate', 'status': {'arm': 'opened'}},
              {})
  ])
  .addRelay([
    new Relay({'name': 'post-exit-sensor', 'status': {'signal': 'HI'}},
              {})
  ])
  .addRelay([
    new Relay({'name': 'post-exit-sensor', 'status': {'signal': 'LOW'}},
              {'name': 'exit-gate', 'actions': {'command': 'close!'}})
  ])
  .addRelay([
    new Relay({'name': 'exit-gate', 'status': {'arm': 'closed'}},
              {'trip': 'parking'})
  ]);

doc.listen([
  'entrance',
  'parking',
  'exit'
], 'entrance');

console.log("Listening on port: " + port);
