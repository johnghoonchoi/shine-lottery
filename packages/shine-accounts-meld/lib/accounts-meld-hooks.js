/* global
	checkForMelds: false,
	updateOrCreateUserFromExternalService: false
*/
'use strict';

/**
 * @reference-url https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js
 * @summary Constructor for the `Accounts` namespace on the server.
 * @locus(발생장소) Server
 * @class AccountsServer
 * @extends AccountsCommon
 * @instancename accountsServer
 * @param {Object} server : A server object such as `Meteor.server`.
 */

///
/// MANAGING USER OBJECTS
///

// Updates or creates a user after we authenticate with a 3rd party.
//
// @param serviceName {String} Service name (eg, twitter).
// @param serviceData {Object} Data to store in the user's record
//        under services[serviceName]. Must include an "id" field
//        which is a unique identifier for the user in the service.
// @param options {Object, optional} Other options to pass to insertUserDoc
//        (eg, profile)
// @returns {Object} Object with token and id keys, like the result
//        of the "login" method.
//

/**
 * var Ap = AccountsServer.prototype;
 *
 Ap.updateOrCreateUserFromExternalService = function (
   serviceName,
   serviceData,
   options
 ) {

 }
 */

// Register `updateOrCreateUserFromExternalService` function to
// be used in place of the original `Accounts.updateOrCreateUserFromExternalService`

// 외부 서비스로부터 유저를 생성하거나 업데이트(로그인한 유저가 외부서비스 연결)를 할때 사용하는 함수
Accounts.updateOrCreateUserFromExternalService =
	updateOrCreateUserFromExternalService;


// Register `updateEmails` and checkPasswordLogin` functions
// to be triggered with the `onLogin` hook
Accounts.onLogin(function(attempt) {
  var services = oauthServicesList();

  //console.log('attempt: ' + JSON.stringify(attempt, null, 2));

  // Reload user object which was possibly modified
	// by splendido:accounts-emails-field by a previous onLogin callback
	// note: the *attempt* object is cloned for each hook callback
	//       se there's no way to get the modified user object from the
	//       *attempt* one...
	var user = Meteor.users.findOne(attempt.user._id);

  // 통합 가능한 계정이 있는지 확인 하는 checkForMelds 메서드 호출
	// Checks for possible meld actions to be created
	checkForMelds(user);
});
