
// Extracts names of available services
oauthServicesList = function() {
  var names;

  if (Meteor.isServer) {
    names = (Accounts.oauth && Accounts.oauth.serviceNames()) || [];
  } else {
    names = (Accounts.oauth && Accounts.loginServicesConfigured() && Accounts.oauth.serviceNames()) || [];
  }
  // Extracts names of configured services
  var configuredServices = [];

  if (Accounts.loginServiceConfiguration) {
    configuredServices = _.pluck(Accounts.loginServiceConfiguration.find().fetch(), "service");
  }

  // Builds a list of objects containing service name as _id and its configuration status
  var services = _.map(names, function(name) {
    return {
      _id : name,
      configured: _.contains(configuredServices, name)
    };
  });

  // Checks whether there is a UI to configure services...
  // XXX: this only works with the accounts-ui package
  var showUnconfigured = typeof Accounts._loginButtonsSession !== "undefined";

  // Filters out unconfigured services in case they"re not to be displayed
  if (!showUnconfigured) {
    services = _.filter(services, function(service) {
      return service.configured;
    });
  }

  // Sorts services by name
  services = _.sortBy(services, function(service) {
    return service._id;
  });

  return services;
}


Meteor.methods({
  removeOAuthService: function(serviceName) {
    check(serviceName, String);

    var userId = this.userId;

    if (userId) {
      var user = Meteor.users.findOne(userId);
      var numServices = _.keys(user.services).length; // including "resume"
      var unset = {};

      // 서비스가 하나인 경우 에러
      if (numServices === 2) {
        throw new Meteor.Error(403, "removeService error", {});
      }

      unset["services." + serviceName] = "";
      unset["oauths." + serviceName] = "";
      Meteor.users.update(userId, {$unset: unset});
    }
  }
});



