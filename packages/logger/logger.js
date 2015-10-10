var winston = Npm.require("winston");

var winstonTransportType = function(type) {
  switch (type) {
    case 'file':
      return winston.transports.File;

    case 'dailyFile':
      return winston.transports.DailyRotateFile;

    case 'http':
      return winston.transports.Http;

    default:
      return winston.transports.Console;
  }
};

Logger = {
  addTransport: function(type, options) {
    return winston.add(winstonTransportType(type), options);
  },

  removeTransport: function(type) {
    return winston.remove(winstonTransportType(type));
  },

  log: function(level, message) {
    return winston.log(level, message);
  },

  debug: function(message) {
    return winston.debug(message);
  },

  info: function(message) {
    return winston.info(message);
  },

  warn: function(message) {
    return winston.warn(message);
  },

  error: function(message) {
    return winston.error(message);
  },

  getWinston: function() {
    return winston;
  }
};






