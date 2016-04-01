var spaceMan = require("./spaceManager.js");
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
    url = 'mongodb://localhost:27017/garage';

var spaceManOne = new spaceMan(200);

app.use(express.static('public'));
server.listen(8080);
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  // this should be the device panel
  res.render('index');
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

var parseStartFinish = (req) => {
  return {
    start: new Date(req.params.start),
    start: new Date(req.params.finish)
  };
};

//Check to see if reservation is available
app.get('/api/:garage_id/b/checkreservation', function(req, res) {
  var r = parseStartFinish(req);
  res.json(spaceManOne.checkReservation(r.start, r.finish));
});

//Attempt to make reservation
app.get('/api/:garage_id/b/setreservation', function(req, res) {
  var r = parseStartFinish(req);
  res.json(spaceManOne.setReservation(r.date1, r.date2));
});

//Get reserved spaces at specified timeslot
app.get('/api/:garage_id/n/getreservedspaces', function(req, res){
  res.json(spaceManOne.getReservedSpaces(new Date(req.params.date)));
});

//Get unreserved spaces at specified timeslot
app.get('/api/:garage_id/n/getunreservedspaces/:y/:m/:d/:h', function(req, res){
  res.json(spaceManOne.getUnreservedSpaces(new Date(req.params.date)));
});

//Get the currentTimeSlots array
app.get('/api/:garage_id/o/getreservedtimes', function(req, res) {
  // TODO: implement
  res.json(spaceManOne.getReservedTimes());
});

//Socket.io
// This is where the devices will be triggered in "REAL TIME"
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

console.log("Listening on port: 8080");
