
const beforeAccessControlHook = function() {

  $('#content').removeClass("slideLeft");

  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      $('#content').addClass('slideLeft');
      this.render(this.loadingTemplate);
    } else {

      Accounts.ui.dialog.show('signIn');
    }
  } else {
    $('#content').addClass('slideLeft');
    this.next();
  }
};

const afterAccessControlHook = function() {
};


Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',

});

Router.onBeforeAction(beforeAccessControlHook);
//Router.onAfterAction(afterAccessControlHook);

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });
