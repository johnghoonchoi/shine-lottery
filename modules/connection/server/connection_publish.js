/**
 * return user list except me
 */
Meteor.publish('connectionsSignInList', function(options) {
  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
    })
  }));

  if (! this.userId) {
    console.log('user not logged in');
    return [];
  }

  var query = { user: { $exists: true }, 'user._id': { $ne: this.userId}};

  Counts.publish(this, 'connectionsSignInListCount',
    Connection.collection.find(query));

  return Connection.collection.find(query, options);
});
