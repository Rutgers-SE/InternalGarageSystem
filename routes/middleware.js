var bodyParser = require('body-parser');
module.exports = function (app) {
  app.use(require('express').static('public'));
  app.set('view engine', 'jade');
};