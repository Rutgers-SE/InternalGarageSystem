var r = require("express").Router();

r.get('/:garage_id/b/full', function (req, res) {
  // look at the current instance of
  res.json(false); // this should change.
});

//statistics
r.get('/:garage_id/o/statistics', function (req, res) {
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
r.get('/:garage_id/b/checkreservation', function(req, res) {
  var r = parseStartFinish(req);
  res.json(spaceManOne.checkReservation(r.start, r.finish));
});

//Attempt to make reservation
r.get('/:garage_id/b/setreservation', function(req, res) {
  var r = parseStartFinish(req);
  res.json(spaceManOne.setReservation(r.date1, r.date2));
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
