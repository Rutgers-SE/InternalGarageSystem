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
var {DeviceOrchestrator, Sequence, Relay} = require('./lib/DeviceOrchestrator');

var spaceManOne = new SpaceManager(200);


require('./routes/middleware')(app);
require('./routes')(app);

// I want this porition to be in a separate file
var doc = new DeviceOrchestrator({io});

// storing all of the devices in the system
var devices = [];

function serializeDevices(lst) {
  return _.map(lst, function ({name, deviceType, socket}) {
    return {name, deviceType, socket: socket.connected};
  });
}

function cleanDevices() {
  devices = _.filter(devices, function ({socket}) {
    return socket.connected;
  });
}

function updatePanel() {
  cleanDevices();
  _.each(devices, function ({deviceType, socket}) {
    var sd = serializeDevices(devices)
    if(deviceType === 'panel') 
      socket.emit('panel:update-devices', {devices: sd});
  });
}

doc.on('panel:setup', function (payload) {
  var socket = this;

  devices.push({
    deviceType: 'panel',
    name: 'panel',
    socket
  });

  updatePanel();
});

// wondering if this should fall into a sequence
doc.on('dev:setup', function ({deviceType, name}) {
  var socket = this;
  var dob = {deviceType, name};
  dob.socket = socket;
  devices.push(dob)
  socket.emit('dev:name-saved', {name});
  
  updatePanel();
});

doc.on('dev:rename', function ({newName, oldName, deviceType}) {
  var socket = this;
  
  // TODO: add error handling
  devices = _.map(devices, function (obj) {
    if (obj.name === oldName &&
        obj.deviceType === deviceType) obj.name = newName;
      return obj;
  });

  socket.emit('dev:name-saved', {name: newName});

  updatePanel();
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

console.log("Listening on port: " + port);
