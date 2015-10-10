
Package.describe({
  summary: 'Shine Theme Base',
  version: '0.0.1',
  name: 'shinejs:shine-theme-light-admin',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------
  api.versionsFrom('1.2');
  api.use([
    'less',
    'shinejs:bootstrap-less'
  ]);

  // ---------------------------------- 2. Files to include ----------------------------------

  // client
  api.addFiles([
    // LESS
    'lib/client/less/main.less',
  ], 'client');

  api.addFiles([
    // includes
    'lib/client/less/includes/colors.less',
    'lib/client/less/includes/variables.less',
    'lib/client/less/includes/mixins.less',
    'lib/client/less/includes/breakpoints.less',
    'lib/client/less/includes/grid.less',

    // global
    'lib/client/less/global/buttons.less',
    'lib/client/less/global/form.less',
    'lib/client/less/global/markdown.less',

    // layout
    'lib/client/less/layout/layout.less',

    // specific
    'lib/client/less/specific/balloon.less',
    'lib/client/less/specific/chat.less',
    'lib/client/less/specific/modules.less',
    'lib/client/less/specific/page.less',
    'lib/client/less/specific/post.less',
    'lib/client/less/specific/user-modal.less'

  ],'client', { isImport: true });

});
