"use strict";

var r = require("express").Router();


// you need to fix this function
// start=2013+23+23+
var parseStartFinish = (req) => {

  return {
    start: new Date(req.params.start),
    finish: new Date(req.params.finish)
  };
};

// we need to use passport for OAuth2

//statistics
// website.com/api/foiwej/o/statistics?start=4023894230&finish=234235453
r.get('/:garage_id/o/statistics', function (req, res) {
  var garageId = req.params.garage_id;
  res.json({
    "Satisfied Customers": "0",
    "garage_id": "3.14159"
  });
});

r.get('/:garage_id/b/full', function (req, res) {
  res.json(spaceManOne.isFull());
});

//Check to see if reservation is available
r.get('/:garage_id/b/checkreservation', function(req, res) {
  var {start, finish} = parseStartFinish(req);
  res.json(spaceManOne.checkReservation(start, finish));
});

//Attempt to make reservation
r.get('/:garage_id/b/setreservation', function(req, res) {
  var {start, finish} = parseStartFinish(req);
  res.json(spaceManOne.setReservation(start, finish));
});

//Get reserved spaces at specified timeslot
r.get('/:garage_id/n/getreservedspaces', function(req, res){
  res.json(spaceManOne.getReservedSpaces(new Date(req.params.date)));
});

//Get unreserved spaces at specified timeslot
r.get('/:garage_id/n/getunreservedspaces/:y/:m/:d/:h', function(req, res){
  res.json(spaceManOne.getUnreservedSpaces(new Date(req.params.date)));
});

//Get the currentTimeSlots array
r.get('/:garage_id/o/getreservedtimes', function(req, res) {
  // TODO: implement
  res.json(spaceManOne.getReservedTimes());
});

module.exports = r;
