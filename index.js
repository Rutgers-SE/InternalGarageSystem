"use strict";
// programming deps
var _ = require('lodash');


// web  server deps
var app = require('express')();
var io = require('socket.io')(server);
var server = require('http').Server(app);
var bodyParser = require('body-parser');
server.listen(8080);

// project libs
var SpaceManager = require("./lib/spaceManager.js");
var {DeviceOrchestrator, Sequence, Relay} = require('./lib/DeviceOrchestrator');

var spaceManOne = new SpaceManager(200);


require('./routes/middleware')(app);
require('./routes')(app);

var doc = new DeviceOrchestrator({io:io});

// the templates for the signals should be stored in the signals subdirectory
// These are not simplemented

//var sense = require('./lib/signals/sensor');
//var term = require('./lib/signals/terminal');
//var gate = require('./lib/signals/gate')

// This should be the entrance sequence
//doc.sequence('entrance')
  //.addRelay(sense.entrance.hi, term.qr.display)
  //.addRelay(term.qr.payload, gate.entranceGate.open)
  //.addRelay(gate.entranceGate.opened, DeviceOrchestrator.noReponse)
  //.addRelay([sense.entranceAG.hi, sense.entranceAG.low], gate.entranceGate.close)
  //.addRelay(gate.entranceGate.closed, DeviceOrchestrator.complete);

//doc.sequence('parking')
  //.addRelay(doc.completion('entrance'), sense.all)
  //.addRelay(sense.parkingSpot.captureId, sense.turnOfEveryExcept);

doc.listen([
  'entrance',
  'parking',
  'exit'
]);

console.log("Listening on port: 8080");
