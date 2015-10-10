Package.describe({
  name: 'shinejs:accounts-ui',
  version: '0.7.1',
  summary: 'Accounts-ui for Meteor application',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use([
    'tracker',
    'reactive-var',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'session',
    'sacha:spin',
    'less',
    'shinejs:bootstrap-less',
    'shinejs:alerts'
  ], 'client');

  // Export Accounts (etc) to packages using this one.
  api.imply([
    'accounts-base',
    'shinejs:i18n'
  ], ['client', 'server']);

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth
  // services.
  api.use('accounts-oauth', {weak: true});
  // Allow us to directly test if accounts-password (which doesn't use
  // Accounts.oauth.registerService) exists.
  api.use('accounts-password', {weak: true});

  api.addFiles([
    'accounts_ui.js',
    'accounts_ui_templates.html',
    'accounts_ui_templates.js',
    'sign_in.html',
    'sign_in.js',
    'sign_up.html',
    'sign_up.js',
    'forgot_password.html',
    'forgot_password.js',
    'reset_password.html',
    'reset_password.js',
    'change_password.html',
    'change_password.js',
    'enroll_account.html',
    'enroll_account.js',
    'configurations.html',
    'configurations.js',

    'style/style.less',

    'login_buttons_session.js',

    'global.js'
    ], 'client');

  api.addFiles([
    'i18n/i18n_en.js',
    'i18n/i18n_ko.js'
  ], ['client', 'server']);

  api.addFiles([
    'startup.js'
  ], ['client', 'server']);

  api.export([
    'loginOtherServices'
  ], ['client']);

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('shinejs:accounts-ui');
  api.addFiles('accounts-ui-tests.js');
});
