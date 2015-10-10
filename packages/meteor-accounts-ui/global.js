
loginOtherServices = function(serviceName) {
  if (! serviceName) return;

  // XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js
  var capitalize = function(str){
    str = str == null ? '' : String(str);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // XXX Service providers should be able to specify their
  // `Meteor.loginWithX` method name.
  var loginWithService = Meteor["loginWith" +
  (serviceName === 'meteor-developer' ?
    'MeteorDeveloperAccount' : capitalize(serviceName))];

  var options = {}; // use default scope unless specified
  if (Accounts.ui._options.requestPermissions[serviceName])
    options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
  if (Accounts.ui._options.requestOfflineToken[serviceName])
    options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
  if (Accounts.ui._options.forceApprovalPrompt[serviceName])
    options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];

  loginWithService(options, function (error) {
    console.log('error: ', error);

    var $loadingIcon = $('.loading-icon');
    var $serviceIcon = $('.service-icon');
    $loadingIcon.addClass('hidden');
    $serviceIcon.removeClass('hidden');

    if (! error) {
      Accounts.ui.dialog.hide();
      Router.go('home');
    } else if (error instanceof Accounts.LoginCancelledError) {
      // do nothing
    } else if (error instanceof ServiceConfiguration.ConfigError) {
      //Alerts.notifyModal('error', '')
    } else {
      var msg = error.reason || "error_unknown";

      if (error.details && error.details.email) {
        Alerts.dialog('confirm', email + msg + '해당 Email 주소로 로그인하시겠습니까?', function(result) {
          if (result) {
            $('#login-username-or-email').val(email);
            $('#login-password').focus();
            return;
          }
          Accounts.ui.dialog.hide();
        });
      } else Alerts.notifyModal('error', "accounts-ui:" + msg);
    }
  });

//Accounts.onLoginFailure(function() {
//  Alerts.dialog('alert', '이미 회원가입하셨습니다.');
//});

}

