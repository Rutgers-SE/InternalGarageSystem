var _ = require('lodash');
var r = require("express").Router();

_.each([
  'sensor',
  'camera', 
  'qr-scanner',
  'gate', 
  'dual-gate',
  'ramp',
  'fire-works',
  'ninja',
  'pizza-guy',
  'car-wash',
  'terminal'], function (node) { 
    r.get('/' + node , function (req, res) { 
      res.render(node);
    });
  });

module.exports = r;
