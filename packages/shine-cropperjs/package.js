Package.describe({
  name: 'shinejs:cropperjs',
  version: '0.0.1',
  summary: 'Cropperjs for meteor',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use([
    'jquery'
  ], 'client');

  api.addFiles([
    'cropper.js',
    'cropper.css'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:cropperjs');
  api.addFiles('cropper-tests.js');
});

