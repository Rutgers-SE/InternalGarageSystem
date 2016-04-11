"use strict";

var r = require('express').Router();

r.get('/', (req, res) => {
  res.render('index');
});

r.get('/settings', (req, res) => {
  res.render('settings');
});

module.exports = r;

