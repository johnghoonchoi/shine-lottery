Template.forgotPasswordService.events({
  'submit #formForgotPassword': function(e, instance) {
    e.preventDefault();

    var email = instance.$("#forgot-password-email").val();
    if (! email) {
      Alerts.notifyModal('error', 'accounts-ui:error_input_required');
      return;
    }

    if (email.indexOf('@') !== -1) {

      Accounts._setLoggingIn(true);

      Accounts.forgotPassword({ email: email }, function (error) {

        Accounts._setLoggingIn(false);

        if (error) {
          var msg = error.reason || "error_unknown";
          Alerts.notifyModal('error', "accounts-ui:" + msg);
        } else {
          Alerts.notifyModal('success', "accounts-ui:text_reset_password");
        }
      });
    } else {
      Alerts.notifyModal('error', 'accounts-ui:error_invalid_input');
    }
  }
});
