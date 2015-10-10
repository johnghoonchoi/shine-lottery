Package.describe({
  name: 'shinejs:stylus-utils',
  version: '0.0.1',
  summary: 'a various of utils for Stylus',
  git: '',
  documentation: 'README.md'
});

Npm.depends({
  'nib': '1.1.0',
  'jeet': '6.1.2',
  'rupture': '0.6.1',
  'axis': '0.3.2',
  'typographic': '2.9.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use('stylus');

  // XXX For future proof-ness I would rather include something like
  // 'jeet-src/stylus/jeet/*' instead o naming each individual file.
  // If the new meteor package file ever support this, we need to find a way to
  // expose a file with a different name than its name in the isopackage, eg:
  // api.addFiles('jeet-src/stylus/jeet/index.styl', {as: 'jeet.styl'});

  api.addFiles('jeet.styl', 'client');
  api.addFiles([
    'lib/jeet/stylus/jeet/_settings.styl',
    'lib/jeet/stylus/jeet/_functions.styl',
    'lib/jeet/stylus/jeet/_grid.styl',
    'lib/jeet/stylus/jeet/_index.styl'
    ],'client', { isImport: true });

  api.addFiles('rupture.styl', 'client');
  api.addFiles([
    'lib/rupture/rupture/_index.styl'
  ],'client', { isImport: true });

  api.addFiles('axis.styl', 'client');
  api.addFiles([
    'lib/axis/axis/_settings.styl',
    'lib/axis/axis/_reset.styl',
    'lib/axis/axis/_vendor.styl',
    'lib/axis/axis/_utilities.styl',
    'lib/axis/axis/_gradients.styl',
    'lib/axis/axis/_interaction.styl',
    'lib/axis/axis/_typography.styl',
    'lib/axis/axis/_code.styl',
    'lib/axis/axis/_ui.styl',
    'lib/axis/axis/_buttons.styl',
    'lib/axis/axis/_forms.styl',
    'lib/axis/axis/_tables.styl',
    'lib/axis/axis/_index.styl'
  ],'client', { isImport: true });

  api.addFiles('typographic.styl', 'client');
  api.addFiles([
    'lib/typographic/stylus/_index.styl'
  ],'client', { isImport: true });

});

Package.onTest(function(api) {
  api.use(['tinytest', 'test-helpers']);
  api.use('stylus');
  api.use('shinejs:stylus-utils');
  api.addFiles([
    'tests/jeet_.styl',
    'tests/rupture_.styl',
    'tests/axis_.styl',
    'tests/typographic_.styl',
    'tests/tinytest.js'
    ], 'client');
});
