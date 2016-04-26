module.exports = function (app, options) {
  app.use('/', require('./interaction'));
  app.use('/api', require('./api')(options)); 
  app.use('/devices', require('./devices')); 
};
