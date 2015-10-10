Template.profileView.onCreated(function() {
  // a rendered View which can be passed to Blaze.remove
  this._profilePictureView = Blaze.render(Template.profilePicture, document.body);
  this.currentUser = () => Meteor.users.findOne(Meteor.userId);
  this.dynamicTemplateName = new ReactiveVar(TEMPLATE_PROFILE);
});

Template.profileView.onDestroyed(function() {
  if (this._profilePictureView) {
    Blaze.remove(this._profilePictureView);
  }
});


/**
 * Display user information
 *    - picture
 *    - profile
 */
const TEMPLATE_PROFILE = 'templateProfile';

Template.profileView.helpers({
  // default profile template setting
  changeTemplate() {
    return Template.instance().dynamicTemplateName.get() || 'profileEditNormal';
  },
  externalServices: function() {
    return _getLoginServices();
  }
});

Template.profileView.events({
  "click #editPicture, click .view-avatar img, click .avatar-initials"(e) {
    e.preventDefault();
    $('#avatarModal').modal('show');
  },

  'click #changePassword'(e) {
    e.preventDefault();
    Accounts.ui.dialog.show('changePassword');
  },

  'click #editProfile'() {
    const template = Template.instance().dynamicTemplateName.get();

    if (template === 'profileEditForm') {
      Template.instance().dynamicTemplateName.set('profileEditNormal');
    } else {
      Template.instance().dynamicTemplateName.set('profileEditForm');
    }
  }
});

// returns an array of the login services used by this app. each
// element of the array is an object (eg {name: 'facebook'}), since
// that makes it useful in combination with handlebars {{#each}}.
//
// don't cache the output of this function: if called during startup (before
// oauth packages load) it might not include them all.
//
// NOTE: It is very important to have this return password last
// because of the way we render the different providers in
// login_buttons_dropdown.html
let _getLoginServices = function() {
  // First look for OAuth services.
  const services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

  // Be equally kind to all login services. This also preserves
  // backwards-compatibility. (But maybe order should be
  // configurable?)
  services.sort();

  // Add password, if it's there; it must come last.
  if (Package['accounts-password'])
    services.push('password');

  return _.map(services, function(service) {
    return { name: service };
  });
};

