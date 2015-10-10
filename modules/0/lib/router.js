
const accessControlHook = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      Accounts.ui.dialog.show('signIn');
    }
  } else {
    this.next();
  }
};

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn() {
    return Meteor.subscribe('currentUser')
  }
});

Router.onBeforeAction(accessControlHook, { only: [
  'myworks',
  'postWrite',
  'postEdit'
]});

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });

Router.route('/', function() {
  this.redirect('/home');
});
