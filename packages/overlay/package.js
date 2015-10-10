Package.describe({
  name: 'shinejs:overlay',
  version: '0.0.1',
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use([
    'tracker',
    'reactive-var',
    'underscore',
    'templating',
    'less',
    'shinejs:bootstrap-less',
    'shinejs:alerts'
  ], 'client');

  api.use([
    'mongo-livedata'
  ]);

  api.addFiles([
    'lib/overlay.js',
    'lib/templates.html',
    'lib/templates.js',
    'lib/style.less'
    ], 'client');

  api.export('Overlay');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:overlay');
  api.addFiles('test/overlay-tests.js');
});
