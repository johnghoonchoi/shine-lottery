Meteor.publish('systemView', function() {
  return Systems.find({});
});
