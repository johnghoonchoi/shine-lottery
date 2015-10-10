
Meteor.publish('postDraftsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number)
    })
  }));

  query = _.extend(query, { 'author._id': this.userId });

  Counts.publish(this, 'myDraftCount', Posts.find(query),
    { noReady: true });

  return PostDrafts.find(query, options);
});

Meteor.publish('myDraftCount', function(query) {
  query = _.extend({ 'author._id': this.userId }, query );
  Counts.publish(this, 'myDraftCount', PostDrafts.find(query),
    { noReady: true });
});

Meteor.publish('postDraftEdit', function(draftId) {
  check(draftId, String);
  return PostDrafts.find({ _id: draftId });
});

