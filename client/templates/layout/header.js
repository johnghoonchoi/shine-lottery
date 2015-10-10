
Template.header.onCreated(function () {
  var instance = this;
/*
  instance.autorun(function() {
    instance.subscribe('systemView');
  });
*/
  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  };
});

Template.header.helpers({
  siteName: function() {
    return Template.instance().siteName();
  },

  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});

Template.header.events({
  'click [data-toggle=navigations]': function() {
    Aside.toggle('left');
  },

  'click [data-toggle=notifications]': function(e, instance) {
    e.preventDefault();

    instance.$('#notifications').fadeIn('slow');
  }
});
