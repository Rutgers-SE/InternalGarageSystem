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



// I want this porition to be in a separate file

var doc = new DeviceOrchestrator({io});

// organizing the sockets into a map
var deviceMap = {
  panel: [], // we don't care about all the panels. (for now)
  gate: {},
  sensor: {},
  terminal: {}
};

// TODO: move this to a proper location
function serializeDeviceMap(dm) {
  return _.map(dm, function (value, key) {
    
    return _.map(dm[key], function (v, k) {
      return k;
    });
  });
}

function updatePanel() {
  _.each(deviceMap.panel, function (s) {
    s.emit('panel:update-devices', serializeDeviceMap(deviceMap));
  });
}

doc.on('panel:setup', function (payload) {
  var socket = this;
  // here we should setup the panel that displays the current state of the deviceMap
  deviceMap.panel.push(socket);
  socket.emit('panel:alert', serializeDeviceMap(deviceMap));
});

// wondering if this should fall into a sequence
doc.on('dev:setup', function (payload) {
  var socket = this;
  deviceMap[payload.deviceType][payload.name] = socket;

  socket.emit('dev:name-saved', {
    name: payload.name
  });


  console.log("Registed a device");

  // Notify all of the panels that are apart of the system.
  updatePanel();
});

doc.on('dev:rename', function ({newName, oldName, deviceType}) {
  var socket = this;
  
  // TODO: add error handling
  var tmp = deviceMap[deviceType][oldName];
  deviceMap[deviceType][newName] = tmp;
  delete deviceMap[deviceType][oldName];

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

console.log("Listening on port: 8080");
