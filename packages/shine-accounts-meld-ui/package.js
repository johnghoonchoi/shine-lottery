Package.describe({
  name: 'shinejs:accounts-meld-ui',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use([
    'minimongo',
    'mongo-livedata',
    'templating'
  ], 'client');

  api.addFiles([
    'lib/accounts-meld-ui.html',
    'lib/accounts-meld-ui.js'
  ], ['client']);

  api.export([
    'MeldActions'
  ], ['client']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:accounts-meld-ui');
  api.addFiles('accounts-meld-ui-tests.js');
});
