var cloudinary = Npm.require('cloudinary');
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');


Meteor.methods({
  cloudinaryUploadTag: function(elementId, options) {
    var cloudinary_cors = Meteor.absoluteUrl('upload/cloudinary_cors.html');

    options = _.extend(options, { callback: cloudinary_cors });

    return cloudinary.uploader.image_upload_tag(elementId, options);
  }
});


CloudinaryServer = {
  init: function(options) {
    cloudinary.config({
      cloud_name: options.cloudName,
      api_key: options.apiKey,
      api_secret: options.apiSecret
    });
  },

  removeImages: function(imageIds) {
    if (typeof imageIds === 'string') {
      imageIds = [ imageIds ];
    }

    for (let imageId of imageIds) {
      let future = new Future();

      cloudinary.uploader.destroy(imageId, function(result) {
        future['return'](result);
      });

      return future.wait();
    }
  },

  cropImage: function(image) {
    return cloudinary.url(image.repoId, {
      transformation: {
        crop: 'crop',
        width: image.cropData.width,
        height: image.cropData.height,
        x: image.cropData.x,
        y: image.cropData.y
      },
      angle: image.cropData.rotate
    });
  }

};
