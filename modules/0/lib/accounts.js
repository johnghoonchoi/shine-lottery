/**
 * returns User display name
 *
 * @param user
 * @returns {*}
 */
userDisplayName = function(user) {
  if (! user) return '';

  if (user.profile && user.profile.name) return user.profile.name;

  if (user.username) return user.username;

  if (user.oauths) {
    var services = [
      'facebook',
      'google',
      'meetup',
      'twitter',
      'github',
      'meteor-developer',
      'kakao',
      'naver',
    ];

    for (let i = 0; i < services.length; i++) {
      if (user.oauths[services[i]]) return user.oauths[services[i]].name;
    }
  }

  if (user.emails && user.emails[0] && user.emails[0].address)
    return user.emails[0].address;

  return '';
};

if (Meteor.isClient) {
  Template.registerHelper('userDisplayName', userDisplayName);
}


userPictureURL = function(user) {
  if (! user) return "";

  if (user.profile && user.profile.picture) {
    return user.profile.picture.origin.urlCropped;
  }

  if (user.oauths) {
    var services = [
      'facebook',
      'google',
      'meetup',
      'twitter',
      'github',
      'meteor-developer',
      'kakao',
      'naver'
    ];

    for (service in services) {
      if (user.oauths[service]) {
        if (user.oauths[service].picture) {
          return user.oauths[service].picture;
        } else {
          return "";
        }
      }
    }
  }
};

/**
 *
 * @returns {string}
 * default : there's no user's profile
 * onlyOrigin : only user`s profile image exist
 * both : pending state
 * onlyTemp : pending state
 * @public
 */
myPicState = function(user) {
  if (!user) return '';

  if (user.profile && user.profile.picture) {
    if (user.profile.picture.origin) {
      if(user.profile.picture.temp) {
        return 'both';
      }
      return 'onlyOrigin';
    }
    return 'onlyTemp';
  }
  return 'default';
};


/**
 *
 * @returns {string}
 */
getPicture = function(user) {
  if (!user) return '';

  if (user) {
    if (user.profile && user.profile.picture) {
      if (user._id === Meteor.userId()) {
        var flag = myPicState(user);
        if (flag === 'onlyOrigin' || flag === 'both') {
          const url = user.profile.picture.origin.urlCropped;
          return `<img src="${url}" alt="Profile image" class="img-circle">`;
        }
      }

      const url = user.profile.picture.origin.urlCropped;
      return `<img src="${url}" alt="Profile image" class="img-circle">`;
    }

    if (user.oauths) {
      var services = [ 'facebook', 'google', 'meetup', 'twitter', 'github', 'meteor-developer', 'kakao', 'naver'];
      for (var i = 0; i < services.length; i++) {
        if (user.oauths[services[i]]) {
          if (user.oauths[services[i]].picture) {
            return "<img src='" + user.oauths[services[i]].picture + "'alt='Profile image' class='img-circle'>";
          }
          const initial = capitalizedFirstLetter(user.oauths[services[i]].name);
          return `<span class="avatar-initials">${initial}</span>`;
        }
      }
    }

    if (user.profile && user.profile.avatar) {
      const url = user.profile.avatar;
      return `<img src="${url}" alt="Profile image" class="img-circle">`;
    }

    if (user.username) {
      const initial = capitalizedFirstLetter(user.username);
      return `<span class="avatar-initials">${initial}</span>`;
    }

    if (user.emails && user.emails[0] && user.emails[0].address) {
      const initial = capitalizedFirstLetter(user.emails[0].address);
      return `<span class="avatar-initials">${initial}</span>`;
    }
  }
};


if (Meteor.isClient) {
  Template.registerHelper('getPicture', getPicture);
}


