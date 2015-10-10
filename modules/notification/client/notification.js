Template.notificationsList.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    if (Meteor.userId()) {
      Meteor.subscribe('notificationsList');
    }
  });
});

Template.notificationsList.helpers({
  isEmpty: function() {
    return Notifications.find().count() === 0;
  },

  notifications: function() {
    return Notifications.find();
  }
});

Template.notificationsList.events({
  'click .notifications': function() {
    hideBalloons();
  }
});

Template.notificationsListItem.events({
  'click p': function(e) {
    e.preventDefault();

    $('#container').removeClass('notification-set');

    Meteor.call('notificationRead', this._id);

    hideBalloons();
    Router.go(Meteor.absoluteUrl(this.msg.link));
  }
});
