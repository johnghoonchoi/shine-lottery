
/*
Logger.addTransport('file', {
  filename: process.env.LOG_DIR + "/error.log",
  json: false
});
*/
Logger.addTransport('dailyFile', {
  filename: process.env.LOG_DIR + "/error.log",
  json: false
});

Logger.info('Meteor Logger initialized...');
