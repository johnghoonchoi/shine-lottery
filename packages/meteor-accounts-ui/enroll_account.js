Template.enrollAccountService.events({
  'submit #formEnrollAccount': function(e, instance) {
    var password = instance.$('#password').val();
    if (!validatePassword(password))
      return;

    Accounts.resetPassword(
      //loginButtonsSession.get('enrollAccountToken'), password,
      function (error) {
        if (error) {
          Alerts.notify('error', error.reason || "Unknown error");
        } else {
        //  loginButtonsSession.set('enrollAccountToken', null);
          if (doneCallback)
            doneCallback();
        }
      });
  }
});
