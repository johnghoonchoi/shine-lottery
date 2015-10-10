/**
 *
 * releasedPostsList, releasePostsListCount
 *    categoryId
 *    state: 'PUBLISHED'
 *
 * releasedPostView
 *    postId
 *    state: 'PUBLISHED'
 *
 * postsList, postsListCount
 *    categoryId
 *
 * myPostsList, myPostsListCount
 *    userId
 *
 */

Meteor.publish('releasedPostsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  query = _.extend(query, { state: 'PUBLISHED' });

  Counts.publish(this, 'releasedPostsListCount', Posts.find(query),
    { noReady: true });

  return Posts.find(query, options);
});


Meteor.publish('releasedPostsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  query = _.extend(query, { state: 'PUBLISHED' });

  Counts.publish(this, 'releasedPostsListCount', Posts.find(query));
});



Meteor.publishComposite('releasedPostView', function(postId) {
  check(postId, String);

  return {
    find: function() {
      return Posts.find({ _id: postId, state: 'PUBLISHED' });
    },
    children: [
      {
        find: function(post) {
          return Categories.find({ _id: post.categoryId });
        }
      },
      {
        find: function(post) {
          return PostLikes.find({ 'user._id': this.userId, postId: post._id });
        }
      }
    ]
  };
});

Meteor.publish('myPostsList', function(options) {
  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  var query = { 'author._id': this.userId };

  Counts.publish(this, 'myPostsListCount', Posts.find(query),
    { noReady: true });

  return Posts.find(query, options);
});


Meteor.publish('myPostsListCount', function() {
  var query = { 'author._id': this.userId };

  Counts.publish(this, 'myPostsListCount', Posts.find(query));
});


Meteor.publishComposite('userPostsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "_id": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  var object = {
    'author._id': query._id,
    state: 'PUBLISHED'
  };

  return {
    find: function() {
      return Posts.find(object, options);
    },
    children: [
      {
        find: function() {
          return Meteor.users.find({ _id: query._id });
        }
      }
    ]
  };
});


Meteor.publish('userPostsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "_id": Match.Optional(String)
  }));

  var object = {
    'author._id': query._id,
    state: 'PUBLISHED'
  };

  Counts.publish(this, 'userPostsListCount', Posts.find(object));
});


Meteor.publish('postsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  // TODO check permission
  // Admin only

  Counts.publish(this, 'postsListCount', Posts.find(query),
    { noReady: true });

  return Posts.find(query, options);
});


Meteor.publish('postsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  // TODO check permission
  // Admin only

  Counts.publish(this, 'postsListCount', Posts.find(query));
});

