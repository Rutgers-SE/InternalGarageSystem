var morgan = require('morgan')
var bodyParser = require('body-parser');
module.exports = function (app) {
  // app.use(morgan('tiny'));
  app.use(require('express').static('public'));
  app.set('view engine', 'jade');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};
