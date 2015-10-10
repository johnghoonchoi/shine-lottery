TempImages = new Mongo.Collection(null);

imageUrlFit = function(image) {
  return (Meteor.absoluteUrl().indexOf("https://") > -1) ?
    image.surlFit : image.urlFit;
};

Template.registerHelper('imageUrlFit', imageUrlFit);

emptyImageUrl = function() {
  return Meteor.absoluteUrl("images/empty-image.png");
};

Template.registerHelper('emptyImageUrl', emptyImageUrl);


flagUrl = function(lang) {
  return Meteor.absoluteUrl('/images/flags/' + this.lang + '.png');
};

Template.registerHelper('flagUrl', flagUrl);

var pictureState = function(user) {
  if (user.profile && user.profile.picture) {
    if (user.profile.picture.origin) {
      if (user.profile.picture.temp) {
        return 'PICTURE_BOTH';
      }
      return 'PICTURE_ORIGIN';
    }
    return 'PICTURE_TEMP';
  }

  return 'PICTURE_DEFAULT';
};

var firstCap = function(value) {
  return value.charAt(0).toUpperCase();
};

/**
 * return '<img ...>' element to draw user's profile picture
 *
 * @param user
 */
accountPicture = function(user) {
  if (! user) { return ''; }

  var src;
  var state = pictureState(user);
  if (state === 'PICTURE_ORIGIN' || state === 'PICTURE_BOTH') {
    return '<img src="' + user.profile.picture.origin.urlCropped +
      '" alt="Profile image" class="img-circle">';
  }

  return "<span class='avatar-initials'>" + firstCap(user.username) + "</span>";
};

Template.registerHelper('accountPicture', accountPicture);
