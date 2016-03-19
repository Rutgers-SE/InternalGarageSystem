var spaceMan = require("./spaceManager.js");
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = 'mongodb://localhost:27017/garage';

var spaceManOne = new spaceMan(200);

/*
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
*/

server.listen(8080);

app.get('/', function (req, res) {
  res.send("Why hello there~");
  //res.sendfile(__dirname + '/index.html');
});

// This string is how we interface from the reservation system to the garage system.
// notice how it starts with api
// then :garage_id
// then o. o mean object
//      b means boolean
//      n means number
// -----vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv-------

//Check if garage is full
//Should have seperate one for walkin and reservation
app.get('/api/:garage_id/b/full', function (req, res) {
  // look at the current instance of
  res.json(false); // this should change.
});

//statistics
app.get('/api/:garage_id/o/statistics', function (req, res) {
  var garageId = req.params.garage_id;
  res.json({
    "thisshouldhavesomeinformation": "righthere",
    "garage_id": garageId
  });
});

//Check to see if reservation is available
app.get('/api/:garage_id/b/checkreservation/:y1/:m1/:d1/:h1/:y2/:m2/:d2/:h2', function(req, res) {
  var date1 = new Date(req.params.y1, req.params.m1, req.params.d1, req.params.h1, 0, 0, 0);
  var date2 = new Date(req.params.y2, req.params.m2, req.params.d2, req.params.h2, 0, 0, 0);
  res.json(spaceManOne.checkReservation(date1, date2));
});

//Attempt to make reservation
app.get('/api/:garage_id/b/setreservation/:y1/:m1/:d1/:h1/:y2/:m2/:d2/:h2', function(req, res) {
  var date1 = new Date(req.params.y1, req.params.m1, req.params.d1, req.params.h1, 0, 0, 0);
  var date2 = new Date(req.params.y2, req.params.m2, req.params.d2, req.params.h2, 0, 0, 0);
  res.json(spaceManOne.setReservation(date1, date2));
});

//Get reserved spaces at specified timeslot
app.get('/api/:garage_id/n/getreservedspaces/:y/:m/:d/:h', function(req, res){
  var date = new Date(req.params.y, req.params.m, req.params.d, req.params.h, 0, 0, 0);
  res.json(spaceManOne.getReservedSpaces(date));
});

//Get unreserved spaces at specified timeslot
app.get('/api/:garage_id/n/getunreservedspaces/:y/:m/:d/:h', function(req, res){
  var date = new Date(req.params.y, req.params.m, req.params.d, req.params.h, 0, 0, 0);
  res.json(spaceManOne.getUnreservedSpaces(date));
});

//Get the currentTimeSlots array
app.get('/api/:garage_id/o/getreservedtimes', function(req, res) {
  res.json(spaceManOne.getReservedTimes());
});

//Socket.io
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
