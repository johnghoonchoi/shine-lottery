Package.describe({
  name: 'shinejs:pagination',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use('templating');

  api.addFiles([
    'lib/pagination.js',
    'lib/template.html',
    'lib/template.js'
  ], 'client');

  api.export('PagedSubscription');
//  api.export('Pagination');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:pagination');
  api.addFiles('pagination-tests.js');
});
