Template.externalServiceItem.onRendered(function() {
  console.log('capitalize: ', capitalize('this'));
  console.log('this: ', this);


});
Template.externalServiceItem.helpers({
  capitalizedName() {
    console.log('this: ', this);

    if (this.name === 'github') {
      // XXX we should allow service packages to set their capitalized name
      return 'GitHub';
    } else if (this.name === 'meteor-developer') {
      return 'Meteor';
    } else {
      return capitalize(this.name);
    }
  },

  canConnectService() {
    const currentUser = Meteor.users.findOne(Meteor.userId());
    if (currentUser && currentUser.services && currentUser.services[this.name]) return false;

    return true;
  }
});

Template.externalServiceItem.events({
  'click [data-action=connect-service]'() {
    loginOtherServices(this.name);
  },

  'click [data-action=disconnect-service]'() {
    Meteor.call('removeOAuthService', this.name, (err, result) => {
      if (err) console.log('err.reason: ', err.reason);
    });
  }
});

// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
let capitalize = function(str){
  str = str == null ? '' : String(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
};
