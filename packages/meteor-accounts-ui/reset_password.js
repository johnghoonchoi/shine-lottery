Template.resetPasswordService.events({
  'submit #formResetPassword': function(e, instance) {
    e.preventDefault();

    var newPassword = instance.$('#new-password').val();

    if (! Accounts.ui.validator.password(newPassword)) {
      Alerts.notifyModal('error', 'accounts-ui:error_invalid_password');
      return;
    }

    Accounts.resetPassword(Accounts.ui.token, newPassword,
      function (error) {
        if (error) {
          var msg = error.reason || "error_unknown";
          Alerts.notifyModal('error', "accounts-ui:" + msg);
        } else {
          Alerts.notify('success', 'accounts-ui:text_reset_password_done');
          //$('#accountsUIModal').modal('hide');
          Accounts.ui.dialog.hide();
        }
      }
    );
  }
});
