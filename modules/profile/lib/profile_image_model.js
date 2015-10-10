/**
 * ProfileImages
 *
 * @fileds
 *    _id              String                    PK
 *    url              String                    Cloudinary orginal url(http)
 *    surl             String                    Cloudinary orginal url(https)
 *    size             Int32                     image file size
 *    width            Int32                     image width
 *    height           Int32                     image height
 *    ext              String                    image file's extention
 *    mime             String                    data type
 *    original         String                    original image file name
 *    repoId           String                    image's public id for Cloudinary
 *    user             Object { _id, username }  owner
 *    createdAt        Date                      created time
 *
 * @type {Mongo.Collection}
 *
 */

ProfileImages = new Mongo.Collection('profileImages');

var prepareData = function (attributes) {
  var user = Meteor.user();

  return _.extend(_.pick(attributes, 'url', 'surl', 'size', 'width', 'height',
    'urlFit', 'surlFit', 'widthFit', 'heightFit',
    'ext', 'mime', 'original', 'repoId'), {
    user: {
      _id: user._id,
      username: user.username
      //name: user.profile.name
    },
    createdAt: new Date()
  });
};

Meteor.methods({
  profileImagesInsert: function (attributes) {
    check(attributes, Match.Any);

    var user = Meteor.user();

    var profileImage = prepareData(attributes);

    // insert new uploaded profile image into DB
    var profileImageId = ProfileImages.insert(profileImage);
    console.log('profileImageId: ', profileImageId);

    if (profileImageId) {
      // user profile picture temp field update
      var userProfileUpdateResult = Meteor.users.update(this.userId, {
        $set: {
          "profile.picture.temp": {
            _id: profileImageId,
            repoId: attributes.repoId,
            url: attributes.url
          }
        }
      });

      console.log('userProfileUpdateResult: ', userProfileUpdateResult);
      if (userProfileUpdateResult) {
        // if temporary profile info exists, remove it
        if (user.profile && user.profile.picture && user.profile.picture.temp) {
          // in db, temp img remove
          var result = ProfileImages.remove(user.profile.picture.temp._id);
          if (result === 1) {
            // in cloudinary, temp img remove
            var cloudRemoveResult = CloudinaryServer.removeImages(user.profile.picture.temp.repoId);
            if (cloudRemoveResult) {
              return cloudRemoveResult
            } else return 'temp cloud remove failed'
          } else return 'temp db profile image remove failed'
        } else return true
      } else return false
    }
    return false
  },

  profileUpdateImage: function(image) {
    if (Meteor.isClient)
      return;

    // cropped image uploaded into cloudinary
    var croppedUrl = CloudinaryServer.cropImage(image);

    // if cropping success
    if (croppedUrl) {
      // user profile picture update
      Meteor.users.update( this.userId, {$set: {
        'profile.picture.origin._id': image._id,
        'profile.picture.origin.repoId': image.repoId,
        'profile.picture.origin.url': image.url,
        'profile.picture.origin.urlCropped': croppedUrl,
        'profile.picture.coordinates.left': image.canvasData.left,
        'profile.picture.coordinates.top': image.canvasData.top,
        'profile.picture.coordinates.width': image.canvasData.width,
        'profile.picture.coordinates.height': image.canvasData.height,
        'profile.picture.coordinates.rotate': image.cropData.rotate
      }});

      var tempProfileDoc = ProfileImages.find({'user._id':this.userId, _id: {$ne: image._id}}).fetch();

      if(tempProfileDoc.length > 0) {
        for(var i = 0; i < tempProfileDoc.length; i++) {
          var imageId = tempProfileDoc[i].repoId;
          var result = ProfileImages.remove(tempProfileDoc[i]._id);

          if (result === 1) {
            CloudinaryServer.removeImages(imageId);
          }
        }
      }

      return croppedUrl
    }

    return 'update failed!';
  }

});

