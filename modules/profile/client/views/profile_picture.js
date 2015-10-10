/**
 *  Display window for cropping profile image
 *    -picture
 */

Template.profilePicture.onCreated(function() {
  _removeTempPic();
});

Template.profilePicture.onRendered(function() {
  Tracker.autorun(() => _drawCropper());

  $('#avatarModal').on('hide.bs.modal', () => {
    _removeTempPic();
    _stopCropper();
  });
});

Template.profilePicture.helpers({
  picUrl() {
    let user = Meteor.user();
    let result = _editPic(user);

    return result;
  }
});

Template.profilePicture.events({
  "click #cancelBtn"() {
    _removeTempPic();
  },
  "click #saveBtn"() {
    let user = Meteor.user();
    let flag = myPicState(user);
    let $avatarView = $('#avatarPreview');

    if (flag === 'default')
      return $('#avatarModal').modal('hide');

    let profileObj = {};
    let cropData = $avatarView.cropper('getData');
    let canvasData = $avatarView.cropper('getCanvasData');

    $('#avatarModal').modal('hide');

    if (flag === 'onlyOrigin') {
      profileObj._id = user.profile.picture.origin._id;
      profileObj.repoId = user.profile.picture.origin.repoId;
      profileObj.url = user.profile.picture.origin.url;
    }

    if (flag === 'onlyTemp' || flag === 'both') {
      profileObj._id = user.profile.picture.temp._id;
      profileObj.repoId = user.profile.picture.temp.repoId;
      profileObj.url = user.profile.picture.temp.url;
    }

    cropData.width = Math.round(cropData.width);
    cropData.height = Math.round(cropData.height);
    cropData.x = Math.round(cropData.x);
    cropData.y = Math.round(cropData.y);
    cropData.rotate = Math.round(cropData.rotate);

    canvasData.left = Math.round(canvasData.left);
    canvasData.top = Math.round(canvasData.top);
    canvasData.width = Math.round(canvasData.width);
    canvasData.height = Math.round(canvasData.height);

    profileObj.cropData = cropData;
    profileObj.canvasData = canvasData;

    //$cropAvatar.cropDone();

    Meteor.call('profileUpdateImage', profileObj, flag, (error, result) => {
      if (error) console.log('error reason: ', error.reason);
      console.log(result);

      cropperDeps.changed();
    });
  }
});

Template.profilePictureToolbar.onCreated(function() {
  this.subscribe('systemView', {});
  this.cloudinary = () => Systems.findOne({_id: 'cloudinary'});
});

Template.profilePictureToolbar.onRendered(function() {
  this.autorun(() => {
    if (Template.instance().subscriptionsReady()) {
      Cloudinary.uploadImage({
        config: {
          cloud_name: this.cloudinary().cloudName,
          api_key: this.cloudinary().apiKey
        },
        options: { upload_preset: 'ps_accounts' },
        ui: { buttonHTML: `<i class="fa fa-upload"></i>`, showProgress: true }
      }, function(e, data) {

        var attributes = {
          url: data.result.url,
          surl: data.result.secure_url,
          size: data.result.bytes,
          width: data.result.width,
          height: data.result.height,
          ext: data.result.format,
          mime: data.originalFiles[0].type,
          original: data.originalFiles[0].name,
          repoId: data.result.public_id
        };

        Meteor.call('profileImagesInsert', attributes, (error, result) => {
          if (error) console.log('error reason: ', error.reason);
          console.log(result);

          cropperDeps.changed();
        });
      });
    }
  });

});


let cropperDeps = new Tracker.Dependency;

let _getLetterImage = function() {
  const letter = capitalizedFirstLetter(userDisplayName(Meteor.user()));

  return `<span class="avarta-initials">${letter}</span>`;
};

let _editPic = function(user) {
  if (user) {
    const flag = myPicState(user); // global func defined in profile.js

    if (flag === 'onlyOrigin')
      return user.profile.picture.origin.url;
    if (flag === 'both' || flag === 'onlyTemp')
      return user.profile.picture.temp.url;

    return false;
  }
};

let _removeTempPic = function() {
  var user = Meteor.user();
  const flag = myPicState(user);
  if (flag === 'both') {
    Meteor.users.update({_id: Meteor.userId()}, {$unset: {'profile.picture.temp': 1}});
  }
  if (flag === 'onlyTemp') {
    Meteor.users.update({ _id: Meteor.userId() }, { $unset: { 'profile.picture': 1 }});
  }
  cropperDeps.changed();
};

let _stopCropper = function () {
  $('#avatarModal').find('form').get(0).reset();
  $('.avatar-wrapper').find('img').cropper('destroy');
  $('.avatar-wrapper').find('img').remove();
};

let _drawCropper = function() {
  cropperDeps.depend();
  let user = Meteor.user();
  let $avatarView = $('.avatar-wrapper');
  const flag = myPicState(user);

  if (flag === 'default') {
    $avatarView.empty().html(_getLetterImage());
    return;
  }

  const url = _editPic(user);
  let $img = $('<img src="' + url + '" id="avatarPreview" >');

  $('.avatar-wrapper').empty().html($img);

  if (flag === 'onlyOrigin') {
    const canvasData = {
      left: user.profile.picture.coordinates.left,
      top: user.profile.picture.coordinates.top,
      width: user.profile.picture.coordinates.width,
      height: user.profile.picture.coordinates.height
    };

    const rotateData = {
      rotate: user.profile.picture.coordinates.rotate
    };
    //var cropBoxData;

    $img.cropper({
      built: function() {
        //$img.cropper('setCropBoxData', cropBoxData);
        $img.cropper('setCanvasData', canvasData);
        $img.cropper('setData', rotateData);
      }
    });

    return;
  }

  if (flag === 'both')
    $img.cropper();

  if (flag === 'onlyTemp') {
    $img.cropper();
  }
};
