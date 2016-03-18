var garage = require("./spaceManager.js");
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = 'mongodb://localhost:27017/garage';

var galaxyGarageNumeroUno = new garage(200);

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
server.listen(8080);

app.use(bodyParser.urlendcoded({ extended: false })); // form handling
app.use(bodyParser.json()); // handling json

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// returns a json
app.get('/api/:garage_id/b/full', function (req, res) {
  // look at the current instance of
  res.json(false); // this should change.
});


// This string is how we interface from the reservation system to the garage system.
// notice how it starts with api
// then :garage_id
// then o. o mean object
//      b means boolean
//      n means number
// -----vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv-------
app.get('/api/:garage_id/o/statistics', function (req, res) {
  var garageId = req.params.garage_id;
  res.json({
    "thisshouldhavesomeinformation": "righthere",
    "garage_id": garageId
  });
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
