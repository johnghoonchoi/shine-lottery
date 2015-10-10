Meteor.publish('postLikesList', function() {

});

Meteor.publish('postLikeView', function(postId) {
  check(postId, String);

  var likes = PostLikes.find({ 'user._id': this.userId, postId: postId });

  return likes;
});
