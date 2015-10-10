/**
 * Accounts configuration
 */

/**
 * accounts-ui package configuration
 */
Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});

const services = ["facebook", "google", "twitter", "meetup", "github", "meteor", "naver", "kakao"];

Meteor.startup(() => {
  _.each(services, (service) => {
    setupLoginSetting(service);
  });
});

const setupLoginSetting = (serviceName) => {
  check(serviceName, String);

  let serviceId = serviceName + "Login";

  // when you deploy this app, comment this line
  // this is for local login test
  //const mode = "development";
  //if (mode ==="development") {
  //  serviceId = serviceName + "LoginLocal";
  //}

  const serviceKeys = Systems.findOne({ _id: serviceId });

  if (serviceName === "meteor") serviceName = 'meteor-developer';

  if (serviceKeys) {
    ServiceConfiguration.configurations.remove({ service: serviceName });

    if (serviceName === "facebook") {
      ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: serviceKeys.appId,
        secret: serviceKeys.secret
      });
      return;
    }
    if (serviceName === "twitter") {
      ServiceConfiguration.configurations.insert({
        service: "twitter",
        consumerKey: serviceKeys.consumerKey,
        secret: serviceKeys.secret
      });
      return;
    }
    if (serviceName === 'kakao') {
      ServiceConfiguration.configurations.insert({
        service: "kakao",
        clientId: serviceKeys.clientId
      });
      return;
    }

    ServiceConfiguration.configurations.insert({
      service: serviceName,
      clientId: serviceKeys.clientId,
      secret: serviceKeys.secret
    });
    return;
  }
};

/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  let publicInfo = {};

  if (user.services.facebook) {
    const userData = user.services.facebook;
    const picture = 'http://graph.facebook.com/' + userData.id + '/picture?type=square&height=160&width=160';

    _.extend(publicInfo, {
      facebook: {
        name: userData.name,
        picture: picture
      }
    });

  }

  if (user.services.google) {
    const userData = user.services.google;

    _.extend(publicInfo, {
      google: {
        name: userData.name,
        picture: userData.picture
      }
    });
  }

  if (user.services.twitter) {
    const userData = user.services.twitter;
    const name = options.profile.name;

    _.extend(publicInfo, {
      twitter: {
        name: name,
        picture: userData.profile_image_url_https
      }
    });
  }

  if (user.services.github && options.profile) {
    const name = options.profile.name;

    _.extend(publicInfo, {
      github: {
        name: name
      }
    });
  }

  if (user.services['meteor-developer'] && options.profile) {
    const name = options.profile.name;

    _.extend(publicInfo, {
      'meteor-developer': {
        name: name
      }
    });
  }

  if (user.services.meetup) {
    const meetup = Systems.findOne({ _id: 'meetupLogin' });
    const userMeetupId = user.services.meetup.id;
    const apiKey = meetup.apiKey;
    const requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId
      + '?key=' + apiKey + '&signed=true&fields=email';
    const response = HTTP.get(requestUrl, {
      params: {
        format: 'json'
      }
    });
    const userData = response.data;
    let picture = '';

    user.services.meetup = userData;

    if(userData.photo && userData.photo.photo_link) {
      picture = userData.photo.photo_link;
    }

    _.extend(publicInfo, {
      'meetup': {
        'name': userData.name,
        'picture': picture
      }
    });
  }

  if (user.services.naver && options.profile) {
    let userData = user.services.naver;
    userData = _.extend(userData, options.profile);
    _.extend(publicInfo, {
      'naver': {
        name: userData.name,
        picture: userData.profile_image
      }
    });
  }

  if (user.services.kakao && options.profile) {
    var userData = user.services.kakao;
    userData = _.extend(userData, options.profile);
    _.extend(publicInfo, {
      kakao: {
        name: userData.name,
        picture: userData.profile_image
      }
    });
  }

  user.oauths = {};
  _.extend(user.oauths, publicInfo);

  Logger.info('1 new user created.. ' + JSON.stringify(user, null, 2));
  return user;
/*
  var validation = AccountValidator.validateInsert(options);

  if (! _.isEmpty(validation.errors())) {
    throw new Meteor.Error(ERROR_CODE_MATCH, 'error_validation');
  }
*/
});

Accounts.onLogin(function(info) {
  Meteor.users.update({ _id: info.user._id },
    { $set: { loginAt: new Date() }});
});

//Accounts.onLoginFailure(function(info) {
//});


/**
 * validate user login
 *
 */
Accounts.validateLoginAttempt(function(attempt) {
  if (! attempt.allowed) return false;
  return true;
});

//Accounts.validateNewUser(function(user) {
//});
