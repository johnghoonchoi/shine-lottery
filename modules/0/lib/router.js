
const beforeAccessControlHook = function() {

  $('#content').removeClass("slideLeft");

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

const afterAccessControlHook = function() {
  $('#content').addClass('slideLeft');
};


Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',

});

Router.onBeforeAction(beforeAccessControlHook);
Router.onAfterAction(afterAccessControlHook);

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });

Router.route('/', {
  name: 'home',
});

Router.route('game/:_id', {
  name: 'gameroomsView',
  data: function () {
    return this.params._id;
  }
});

Router.route('/room/create', {
  name: 'roomCreate',
});

Router.route('/room/view', {
  name: 'roomView',
});

Router.route('/animate/3d', {
  name: 'animation3D',
});
