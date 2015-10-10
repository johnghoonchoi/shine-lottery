Template.signUp.helpers({
  services: function() {
    return getLoginServices();
  },

  isPasswordService: function () {
    return this.name === 'password';
  },

  hasOtherServices: function () {
    return getLoginServices().length > 1;
  },

  hasPasswordService: function() {
    return hasPasswordService();
  }
});


Template.signUpPasswordService.onCreated(function() {
  this.modalTermsOfUse = Blaze.render(Template.modalTermsOfUse, document.body);
  this.modalPrivacyPolicy = Blaze.render(Template.modalPrivacyPolicy, document.body);
});

Template.signUpPasswordService.onDestroyed(function() {
  if (this.modalTermsOfUse) {
    Blaze.remove(this.modalTermsOfUse);
    this.modalTermsOfUse = null;
  }

  if (this.modalPrivacyPolicy) {
    Blaze.remove(this.modalPrivacyPolicy);
    this.modalPrivacyPolicy = null;
  }
});

Template.signUpPasswordService.helpers({
  fields: function () {
    return [
      {
        fieldName: 'username',
        fieldLabel: I18n.get('accounts-ui:label_username'),
        visible: function () {
          return _.contains(
            [
              "USERNAME_AND_EMAIL",
              "USERNAME_AND_OPTIONAL_EMAIL",
              "USERNAME_ONLY"
            ],
            passwordSignupFields());
        }},
      {
        fieldName: 'email',
        fieldLabel: I18n.get('accounts-ui:label_email'),
        inputType: 'email',
        visible: function () {
          return _.contains(
            [ "USERNAME_AND_EMAIL", "EMAIL_ONLY" ],
            passwordSignupFields());
        }},
      {
        fieldName: 'email',
        fieldLabel: I18n.get('accounts-ui:label_email_optional'),
        inputType: 'email',
        visible: function () {
          return passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";
        }},
      {
        fieldName: 'password',
        fieldLabel: I18n.get('accounts-ui:label_password'),
        inputType: 'password',
        visible: function () {
          return true;
        }},
      {
        fieldName: 'password-again',
        fieldLabel: I18n.get('accounts-ui:label_password_again'),
        inputType: 'password',
        visible: function () {
          // No need to make users double-enter their password if
          // they'll necessarily have an email set, since they can use
          // the "forgot password" flow.
          return _.contains(
            [ "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY" ],
            passwordSignupFields());
        }}
    ];
  },

  termsOfUseLink: function() {
    return '<a id="termsOfUse">' + I18n.get('accounts-ui:label_terms_of_use') + '</a>';
  },

  privacyPolicyLink: function() {
    return '<a id="privacyPolicy">' + I18n.get('accounts-ui:label_privacy_policy') + '</a>';
  }
});


Template.signUpPasswordService.events({
  'click #termsOfUse': function(e) {
    e.preventDefault();

    $('#modalTermsOfUse').modal('show');
  },

  'click #privacyPolicy': function(e) {
    e.preventDefault();

    $('#modalPrivacyPolicy').modal('show');
  },

  'submit #formSignUp': function(e, instance) {
    e.preventDefault();

    var options = {}; // to be passed to Accounts.createUser

    if (! instance.$('#agreements:checked').val()) {
      Alerts.notifyModal('error', 'accounts-ui:error_agreements_required');
      return;
    }

    var username = instance.$('#login-username').val();
    var email = instance.$('#login-email').val();
    var password = instance.$('#login-password').val();

    var matchPasswordAgainIfPresent = function() {
      var passwordAgain = instance.$('#login-password-again').val();
      if (passwordAgain) {
        return (password !== passwordAgain);
      }
      return true;
    };

    if (! matchPasswordAgainIfPresent()) {
      Alerts.notifyModal('error', 'accounts-ui:error_fail_password_confirm');
      return;
    }

    if (username !== null) {
      options.username = username.trim();

      if (! Accounts.ui.validator.username(options.username)) {
        Alerts.notifyModal('error', 'accounts-ui:error_invalid_username');
        return;
      }
    }

    if (email !== null) {
      options.email = email.trim();

      if (! Accounts.ui.validator.email(options.email)) {
        Alerts.notifyModal('error', 'accounts-ui:error_invalid_email');
        return;
      }
    }

    options.password = password;
    if (! Accounts.ui.validator.password(options.password)) {
      Alerts.notifyModal('error', 'accounts-ui:error_invalid_password');
      return;
    }

    Accounts.createUser(options, function (error) {
      if (error) {
        var msg = error.reason || "error_unknown";
        Alerts.notifyModal('error', "accounts-ui:" + msg);
      } else {
        Accounts.ui.dialog.hide();
        Alerts.dialog('msg', 'accounts-ui:text_verify_email');
      }
    });
  }
});
