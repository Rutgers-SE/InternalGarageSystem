"use strict";
var _ = require('lodash');
module.exports = function ({spaceManOne}) {
  var r = require("express").Router();
  // we need to use passport for OAuth2

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  var parseStartFinish = (req) => {
    return {
      start: new Date(req.query.start),
      finish: new Date(req.query.finish)
    }
  }

  r.post('/fakeData', function (req, res) {

    for (let _ = 0; _ < 400; _++) {
      let start = randomDate(new Date(2016, 4, 30), new Date(2016, 6, 4))
      let finish = randomDate(new Date(2016, 7, 1), new Date(2016, 12, 4))
      let s = randomDate(new Date(2016, 7, 1), new Date(2016, 12, 4))
      let f = randomDate(new Date(2016, 9, 10), new Date(2017, 2, 4))
      console.log("start", start);
      console.log("finish",finish);
      spaceManOne.setReservation(start, finish);
      spaceManOne.setReservation(s, f);
    }

    var times = spaceManOne.getReservedTimes();
    var xs = _.range(0, times.length);
    res.json(_.zip(xs, times));
  });

  r.get('/spaceData', function (req, res) {
    var times = spaceManOne.reservedTimes
    var xs = _.range(0, times.length);
    res.json(_.zip(xs, times));
  });

  r.get('/:garage_id/b/full', function (req, res) {
    // look at the current instance of
    res.json(false); // this should change.
  });

  r.get('/:garage_id/o/statistics', function (req, res) {
    var garageId = req.query.garage_id;
    res.json({
      "garage_id": garageId
    })
  })


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
    res.json(spaceManOne.getReservedSpaces(new Date(req.query.date)));
  });

  //Get unreserved spaces at specified timeslot
  r.get('/:garage_id/n/getunreservedspaces', function(req, res){
    res.json(spaceManOne.getUnreservedSpaces(new Date(req.query.date)));
  });

  //Get the currentTimeSlots array
  r.get('/:garage_id/o/getreservedtimes', function(req, res) {
    // TODO: implement
    res.json(spaceManOne.getReservedTimes());
  });

  return r;
}
