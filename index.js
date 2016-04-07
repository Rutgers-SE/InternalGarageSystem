"use strict";
var express = require("express");
var app = express();
var io = require('socket.io')(server);
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var _ = require('lodash');

var SpaceManager = require("./lib/spaceManager.js");
var DeviceOrchestrator = require('./lib/DeviceOrchestrator');

var api = require("./routes/api");
var deviceViews = require('./routes/devices');

var spaceManOne = new SpaceManager(200);

server.listen(8080);
app.use(express.static('public'));
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

// Mounting sub route trees
app.use('/api', require('./routes/api')); 
app.use('/devices', require('./routes/devices')); 

var doc = new DeviceOrchestrator({io});

// the templates for the signals should be stored in the signals subdirectory
// These are not simplemented
var sense = require('./lib/signals/sensor');
var term = require('./lib/signals/terminal');
var gate = require('./lib/signals/gate')

// This should be the entrance sequence
doc.sequence('entrance')
  .addRelay(sense.entrance.hi, term.qr.display)
  .addRelay(term.qr.payload, gate.entranceGate.open)
  .addRelay(gate.entranceGate.opened, DeviceOrchestrator.noReponse)
  .addRelay([sense.entranceAG.hi, sense.entranceAG.low], gate.entranceGate.close)
  .addRelay(gate.entranceGate.closed, DeviceOrchestrator.complete);

devoc.listen([
  'entrance',
  'parking',
  'exit'
]); // this call invokes the io.on('connection') function

console.log("Listening on port: 8080");
