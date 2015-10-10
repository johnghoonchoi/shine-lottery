/**
 *
 *
 */
PostImages = new Mongo.Collection('postImages');

var prepareImageData = function(data) {
  var user = Meteor.user();

  return _.extend(_.pick(data, 'url', 'surl', 'size', 'width', 'height',
    'urlFit', 'surlFit', 'widthFit', 'heightFit',
    'ext', 'mime', 'original', 'repoId'), {
    user: {
      _id: user._id,
      username: user.username,
      name: user.name
    },
    createdAt: new Date()
  });
};

Meteor.methods({
  postImageInsert: function(object) {

    var image = prepareImageData(object);

    image._id = PostImages.insert(image);

    return image._id;
  },

  postImageRemove: function(imageId) {
    check(imageId, String);

    var removed = PostImages.remove({ _id: imageId });
    
    // remove image from repo
    if (Meteor.isServer && removed > 0) {
        
    }
  }
});
