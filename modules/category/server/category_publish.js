/**
 *
 */
Meteor.publish('releasedCategoriesList', function() {

  Counts.publish(this, 'releasedCategoriesListCount',
    Categories.find({ state: 'ON' }), { noReady: true });

  var categories = Categories.find({ state: 'ON' }, { sort: { seq: 1 }});

  return categories;
});

/**
 * return the specified category and the related posts list.
 * the state of the category should be 'ON'.
 */
Meteor.publishComposite('releasedCategoryView', function(categoryId, options) {
  check(categoryId, String);
  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  return {
    find: function() {
      return Categories.find({ _id: categoryId, state: 'ON' });
    },
    children: [
      {
        find: function() {
          var query = { categoryId: categoryId, state: 'PUBLISHED' };
          return Posts.find(query, options);
        },
        children: [
          {
            find: function(post) {
              return Meteor.users.find({ _id: post.author._id }, {
                fields: { username: 1, profile: 1, oauths: 1 }
              });
            }
          }
        ]
      }
    ]
  };
});


/**
 *
 */
Meteor.publish('categoriesList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "state": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Match.Optional(Number),
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "seq": Match.Optional(Number)
    })
  }));

  // check 'admin' role
  if (! this.userId || ! Roles.userIsInRole(this.userId, [ 'ROLE_ADMIN' ]))
    return [];

  Counts.publish(this, 'categoriesListCount', Categories.find(query),
    { noReady: true });

  var categories = Categories.find(query, options);

  return categories;

});

/**
 *
 */
Meteor.publish('categoryView', function(categoryId) {
  check(categoryId, String);

  var categories = Categories.find({ _id: categoryId });

  return categories;

});
