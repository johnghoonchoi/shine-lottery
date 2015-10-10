Package.describe({
  name: 'shinejs:alerts',
  summary: 'A package for displaying alert message box for Meteor JS',
  version: '0.5.4',
  git: 'https://github.com/miraten/meteor-alerts'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use([
    'ecmascript',
    'minimongo',
    'mongo-livedata',
    'templating',
    'underscore',
    'less',
    'shinejs:bootstrap-less',
    'shinejs:i18n'
  ], 'client');

  api.addFiles([
    'client/alerts.js',
    'client/alerts.less',
    'client/notification-templates.html',
    'client/notification-templates.js',
    'client/dialog-templates.html',
    'client/dialog-templates.js',
  ], 'client');

  api.export('Alerts');
});

Package.onTest(function(api) {
  api.use('tinytest', 'client');
  api.use('shinejs:alerts', 'client');
  api.addFiles('alerts-tests.js', 'client');
});
