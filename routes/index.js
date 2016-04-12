module.exports = function (app) {
  app.use('/', require('./interaction'));
  app.use('/api', require('./api')); 
  app.use('/devices', require('./devices')); 
};
