"use strict";
var express = require("express");
var app = express();
var io = require('socket.io')(server);
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var _ = require('lodash');

var spaceMan = require("./lib/spaceManager.js");
var DeviceOrchestrator = require('./lib/DeviceOrchestrator');

var api = require("./routes/api");
var deviceViews = require('./routes/devices');

var spaceManOne = new spaceMan(200);

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

var sense = require('./lib/signals/sensor');
var term = require('./lib/signals/terminal');

doc.sequence('entrance')
  .addRelay(sense.entrance, term.entranceTerm)
  .done();


devoc.listen();

console.log("Listening on port: 8080");
