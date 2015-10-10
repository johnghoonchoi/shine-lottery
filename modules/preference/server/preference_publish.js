Meteor.publish('preference', function() {
  return Preference.find();
});
