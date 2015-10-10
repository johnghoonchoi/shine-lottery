Package.describe({
  name: 'shinejs:logger',
  version: '0.2.4',
  summary: 'A simple Meteor logger that works on the server',
  git: 'https://github.com/miraten/meteor-logger',
  documentation: 'README.md'
});

Npm.depends({ winston: "1.0.1" });

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.addFiles('logger.js', 'server');

  api.export('Logger', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:logger');
  api.addFiles('logger-tests.js');
});
