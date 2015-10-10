Template.changePasswordService.events({
  'submit #formChangePassword': function(e, instance) {
    e.preventDefault();

    var oldPassword = instance.$('#old-password').val();
    var password = instance.$("#new-password").val();
    var passwordAgain = instance.$("#password-again").val();

    if (! password) {
      Alerts.notifyModal('error', 'accounts-ui:error_input_required');
      return;
    }

    if (password !== passwordAgain) {
      Alerts.notifyModal('error', 'accounts-ui:error_fail_password_confirm');
      return;
    }

    if (! Accounts.ui.validator.password(password)) {
      Alerts.notifyModal('error', 'accounts-ui:error_invalid_password');
      return;
    }

    Accounts.changePassword(oldPassword, password, function (error) {
      if (error) {
        var msg = error.reason || "error_unknown";
        Alerts.notifyModal('error', "accounts-ui:" + msg);
      } else {
        Alerts.notify('success', "accounts-ui:text_reset_password_done");
        Accounts.ui.dialog.hide();
      }
    });
  }
});
