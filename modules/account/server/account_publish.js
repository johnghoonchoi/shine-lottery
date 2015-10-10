Meteor.publish("currentUser", function() {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      { fields: { oauths: 1, services: 1 } }
    );
  } else {
    this.ready();
  }
});


Meteor.publish("accountData", function (filter) {
  check(filter, Object);
  return Meteor.users.find(filter, { fields: { services: 0 } });
});
