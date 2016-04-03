"use strict";
var express = require("express");
var _ = require('lodash');
var spaceMan = require("./lib/spaceManager.js");
var DeviceOrchestrator = require('./lib/DeviceOrchestrator');
var app = express();
var api = require("./lib/rest.js");
var deviceViews = require('./lib/deviceViews');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var spaceManOne = new spaceMan(200);

app.use(express.static('public'));
server.listen(8080);
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.use('/api', api); // rest api...  look at line 3
app.use('/devices', deviceViews); // rest api...  look at line 3


var devoc = new DeviceOrchestrator({io});

io.on('connection', function (socket) {

  socket.on('dev:trigger', function (payload) {
    io.emit("dev:response", "this is the response");
  });

});


//Socket.io
// This is where the devices will be triggered in "REAL TIME"
//io.on('connection', function (socket) {
  //socket.on('dev:kill', function (data) {
    //var oldLength = registeredDevices.length;
    //registeredDevices = _.filter(registeredDevices, (devs) => {
      //var id = data.id;
      //if (devs.id == data.id) return false;
      //return true;
    //});

    //if (oldLength != registeredDevices.length) {
      //socket.emit('dev:killed', {
        //deviceId: id
      //});
    //} else{
      //socket.emit('dev:killed', {
        //error: "Could not kill the device instance from the system."
      //});
    //}

  //});
  //socket.on('dev:register', function (data) {
    //var id = idCounter += 1;
    //data.id = id;
    //data.registeredDeviceCount = registeredDevices.length;
    //registeredDevices.push(data);
    //socket.emit('dev:successfully-registered', data);
  //});





  //socket.on('dev:trigger', function (pl) {
    //var target = _.filter(registeredDevices, matchId(pl.id))
      //.each(function (dev) {

      //});
  //});



//});

console.log("Listening on port: 8080");
