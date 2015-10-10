PreferenceController = RouteController.extend({

  subscriptions: function() {
    this.subs = Meteor.subscribe('preference');
  },

  theme: function() {
    return Preference.findOne({ _id: 'theme' });
  },

  data: function() {
    return {
      theme: this.theme()
    };
  }

});

Router.route('/preference', {
  name: 'preference',
  controller: 'PreferenceController'
});
