/**
 * Categories
 *    _id
 *    name                String 1..100
 *    seq                 Number
 *    state               ON, OFF
 *    permissions
 *      read              'PUBLIC', 'PROTECTED', 'PRIVATE'
 *      write             'PUBLIC', 'PROTECTED', 'PRIVATE'
 *      admin             'PUBLIC', 'PROTECTED', 'PRIVATE'
 *    createdAt           Date
 *    updatedAt           Date
 */
Categories = new Mongo.Collection('categories');

categoryPermitted = function(category, user, action) {

  var categoryRole = function() {
    return 'ROLE_' + category._id.toUpperCase();
  };

  // check 'admin' role
  if (user && Roles.userIsInRole(user._id, [ 'ROLE_ADMIN' ]))
    return true;

  if (! category || ! category.permission) {
    return false;
  }

  if (! user) {
    return category.permission[action] === 'PRIVATE';
  }

  if (category.permission[action] === 'USER') {
    return true;
  }

  if (category.permission[action] === 'PRIVATE') {
    return Roles.userIsInRole(user._id, [ categoryRole() ]);
  }
};


