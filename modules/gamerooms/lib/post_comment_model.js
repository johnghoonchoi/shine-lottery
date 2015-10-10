/**
 * PostComments
 *    _id
 *    postId              String
 *    message             String 1..500
 *    author              { _id, username, name }
 *    createdAt           Date
 *    updatedAt           Date
 *
 */
PostComments = new Mongo.Collection('postComments');

Meteor.methods({
  postCommentInsert: function(object) {
    // validate
    var validation = PostCommentValidator.validateInsert(object);
    if (validation.errors().length > 0) {
      throw new Meteor.Error(ERROR_CODE_MATCH, "error_validation_fail");
    }

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    // make input object
    var now = new Date();
    var user = Meteor.user();

    var comment = {
      postId: object.postId,
      msg: object.msg,
      user: {
        _id: user._id,
        username: user.username
        //name: user.name
      },
      createdAt: now,
      updatedAt: now
    };

    // write to database
    try {
      // insert the comment
      comment._id = PostComments.insert(comment);

      // increment comment count +1
      Posts.update({ _id: comment.postId }, { $inc: { 'count.comment': 1 }});

      // push notification
      createCommentNotification(comment);
    } catch (ex) {
      console.log('error: ' + ex.message);
    }

    return comment._id;
  }
});
