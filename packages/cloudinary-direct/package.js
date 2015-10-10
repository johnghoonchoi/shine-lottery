Package.describe({
  name: 'shinejs:cloudinary-direct',
  version: '0.2.1',
  summary: 'upload API for direct image upload from browser to cloudinary.com',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Npm.depends({ cloudinary: "1.2.1" });

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use([ 'ecmascript' ]);

  api.use([
    'templating',
    'tracker'
  ], 'client');

  api.use([
    'underscore'
  ], 'server');

  api.addFiles([
    'lib/jquery.ui.widget.js',
    'lib/jquery.iframe-transport.js',
    'lib/jquery.fileupload.js',
    'lib/jquery.cloudinary.js',
    'cloudinary.html',
    'cloudinary.css',
    'cloudinary.js'
  ], 'client');

  api.addFiles([
    'cloudinary-server.js'
  ], 'server');

  api.export('Cloudinary');
  api.export('CloudinaryServer');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:cloudinary-direct');
  api.addFiles('cloudinary-direct-tests.js');
});
