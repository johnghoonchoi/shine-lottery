/**
 * PostLikes
 *    _id
 *    postId              String
 *    user                { _id, username, name }
 *    createdAt           Date
 */
PostLikes = new Mongo.Collection('postLikes');

Meteor.methods({
  postLikeInsert: function(postId) {
    check(postId, String);

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var user = Meteor.user();
    var object = {
      postId: postId,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name
      },
      createdAt: new Date()
    };

    var exist = PostLikes.findOne({ 'user._id': user._id, postId: postId });
    if (exist) {
      return exist._id;
    }

    try {
      object._id = PostLikes.insert(object);

      Posts.update({ _id: postId }, { $inc: { 'count.likes': 1 }});

      return object._id;
    } catch (ex) {
      throw new Meteor.Error(ERROR_CODE_DATABASE, ex.message);
    }
  },

  postLikeRemove: function(postId) {
    check(postId, String);

    var user = Meteor.user();

    PostLikes.remove({ 'user._id': user._id, postId: postId }, function(error, removed) {
      if (error)
        throw new Meteor.Error(ERROR_CODE_DATABASE, "error_db_remove");

      if (removed > 0) {
        Posts.update({ _id: postId }, { $inc: { 'count.likes': -1 }});
      }
    });
  }
});
