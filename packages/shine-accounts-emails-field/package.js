
'use strict';

Package.describe({
	summary: "Adds to the user obj a `registered_emails` field " +
		"containing 3rd-party account service emails.",
	name: "shinejs:accounts-emails-field",
	version: "0.0.1",
	git: "",
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.2");

	api.use([
		'accounts-base',
		'underscore'
	], ['server']);

	api.imply([
		'accounts-base'
	], ['server']);

	api.addFiles([
		'lib/_globals.js',
		'lib/accounts-emails-field.js',
		'lib/accounts-emails-field-on-login.js'
	], ['server']);

	api.export([
		'AccountsEmailsField'
	], ['server']);
});

Package.onTest(function(api) {
	api.use('shinejs:accounts-emails-field');

	api.use([
		'tinytest',
		'test-helpers',
		'underscore'
	], ['server']);

	api.addFiles([
		'tests/accounts-emails-field_tests.js'
	], ['server']);
});
