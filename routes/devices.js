var _ = require('lodash');
var r = require("express").Router();

_.each([
  'sensor',
  'camera', 
  'qr-scanner',
  'gate', 
  'dual-gate',
  'ramp',
  'panel',
  'fire-works',
  'ninja',
  'pizza-guy',
  'car-wash',
  'terminal'], function (device) { 
    r.get('/' + device , function (req, res) { 
      res.render(device);
    });
  });

module.exports = r;
