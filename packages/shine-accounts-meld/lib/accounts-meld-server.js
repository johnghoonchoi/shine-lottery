/* global
		AccountsEmailsField: false,
    AccountsMeld: true,
    checkForMelds: true,
		MeldActions: true,
    updateOrCreateUserFromExternalService: true
*/
'use strict';

// ----------------------------------------
// Collection to keep meld action documents
// ----------------------------------------

// Each document is composed as follow:
// {
//     dst_user_id: user_id associated to the account which should survive
//     src_user_id: user_id associated to the account to be deleted
//     meld:        one of ["ask", yes", "not_now", "never", "melding", "done"]
//                  used to track the status of the meld action.
//     src_info: {  a bit of information about the source account
//       emails: src_user.registered_emails (see accounts-emails-field package)
//       services: array of registered services' name, but 'resume'
//     }
//     dst_info: {  a bit of information about the destination account
//       emails: dst_user.registered_emails (see accounts-emails-field package)
//       services: array of registered services' name, but 'resume'
//     }
// }
//
//
// Server - Client interaction flow:
//
// 1) a meld action is created: 'meld': 'ask'
// 2) the client is prompted with a question for which answer allowed values are
//    - 'yes' -> requires to perform the meld action
//    - 'not_now' -> requires to as again at the next login
//    - 'never' -> requires not to meld and not to bother again...
//
// 3a) client updates the meld action an sets 'meld': 'yes'
// 3aa) server sets 'meld': 'melding'
//      (so that client can visualize something...)
// 3ab) in case the meld action cannot be performed because of the same service
//      appearing inside both accounts but with different ids the server sets
//      'meld': 'ask'
//      todo: Fix typo `conflitting => conflicting`
//      ...the hope is the user can remove one of the two conflicting services
//      and then ask again to meld.
//      should be probably very rare, but SOMETHING BETTER SHOULD BE DONE!
// 3ac) when the meld action is completed the server sets 'meld': 'done'
// 3ad) the client should visualize something and then set 'meld': 'ok'
//
// 3b) client updates the meld action an sets 'meld': 'not_now'
// 3ba) at the next login the server changes 'meld': 'not_now' --> 'meld': 'ask'
//
// 3c) client updates the meld action an sets 'meld': 'never'
// 3ca) at the next login the server sees the mels action with 'meld': 'never'
//      and does nothing...
//

MeldActions = new Meteor.Collection("meldActions");

// Allow client-side modification of a meld action only
// to catch the user answer after having proposed a meld
// and to delete the document of a completed meld action.
MeldActions.allow({
	update: function(userId, doc, fieldNames, modifier) {
		// Only the destination user can modify a document
		if (userId !== doc.dst_user_id) {
			return false;
		}
		// ...and only the field meld can be modified
		if (fieldNames.length > 1 || fieldNames[0] !== "meld") {
			return false;
		}
		// ...and only if meld is 'ask' or 'melding'
		if (!_.contains(['ask', 'melding'], doc.meld)) {
			return false;
		}
		// ...when meld is "ask" only ["yes", "not_now", "never"] are allowed
		if (doc.meld === "ask") {
			var allowedModifiers = [{
				'$set': {
					meld: 'yes'
				}
			}, {
				'$set': {
					meld: 'not_now'
				}
			}, {
				'$set': {
					meld: 'never'
				}
			}];
			var notAllowed = _.every(allowedModifiers, function(mod) {
				return !_.isEqual(mod, modifier);
			});
			if (notAllowed) {
				return false;
			}
		}

		// ...when meld is "melding" only answer "ok" is allowed
		if (doc.meld === "melding") {
			if (!_.isEqual(modifier, {
					'$set': {
						meld: 'ok'
					}
				})) {
				return false;
			}
		}

		// ...only in case all the above conditions are satisfied:
		return true;
	},


	remove: function(userId, doc) {
		// no removals unless the meld action is completed!
		return doc.meld === "done";
	}
});

// Publish meld action registered for the current user
// ...except those marked with "ok", yes", "not_now", "never"
//    which are not meant to be displayed client-side.
Meteor.publish("pendingMeldActions", function() {
	return MeldActions.find({
		dst_user_id: this.userId,
		meld: {
			$nin: ["not_now", "never", "ok", "yes"]
		}
	});
});

// Observe the changes of meld actions to respond to
// client-side user interactions:
//
//  - remove unnecessary data when a meld action is marked
//    as to be never performed
//
//  - actually proceed to meld accounts when the client-side
//    answer is "yes"
MeldActions.find().observeChanges({
	changed: function(id, fields) {

		if (fields.meld === "never") {

			// Remove unnecessary data from the document
			MeldActions.update(id, {
				$unset: {
					src_info: "",
					dst_info: ""
				}
			});

		} else if (fields.meld === "yes") {
			// Proceed with actual melding of the two accounts...
			AccountsMeld.executeMeldAction(id);
		}

	}
});



// ------------------
// AccountsMeld class
// ------------------

var AM = function() {};

// Configuration pattern to be checked with check
AM.prototype.CONFIG_PAT = {
	askBeforeMeld: Match.Optional(Boolean),
	checkForConflictingServices: Match.Optional(Boolean),
	meldUserCallback: Match.Optional(Match.Where(_.isFunction)),
	meldDBCallback: Match.Optional(Match.Where(_.isFunction)),
	serviceAddedCallback: Match.Optional(Match.Where(_.isFunction))
};


// Current configuration values
AM.prototype._config = {
	// Flags telling whether to ask the user before melding any two accounts
	askBeforeMeld: false,
	// Flags telling whether to check for conflicting services before melding
	checkForConflictingServices: false,
	// Reference to the callback to meld user objects
	meldUserCallback: null,
	// Reference to the callback to meld collections' objects
	meldDBCallback: null,
	// Reference to the callback to update user profile when a service is added
	serviceAddedCallback: null
};

AM.prototype.getConfig = function(paramName) {
  return this._config[paramName];
};

// project-root/server/config/accounts-meld.js
AM.prototype.configure = function(config) {
  check(config, this.CONFIG_PAT);
  // Update the current configuration
  this._config = _.defaults(config, this._config);
};


AM.prototype._meldUsersObject = function(srcUser, dstUser) {
	// Checks whether a callback for melding users' object was specified
	var meldUserCallback = this.getConfig('meldUserCallback');

	// ...in case it was, uses the requested one
	if (meldUserCallback) {

		var meldedUser = meldUserCallback(srcUser, dstUser);

		meldedUser = _.omit(
			meldedUser,
			'_id', 'services', 'emails', 'registered_emails'
		);

		_.each(meldedUser, function(value, key) {
      dstUser[key] = value;
		});

	}
	// ...otherwise perfors some default fusion
	else {
		// 'createdAt' field: keep the oldest between the two
		if (srcUser.createdAt < dstUser.createdAt) {
			dstUser.createdAt = srcUser.createdAt;
		}
		// 'profile' field
		var profile = {};
		_.defaults(profile, dstUser.profile || {});
		_.defaults(profile, srcUser.profile || {});
		if (!_.isEmpty(profile)) {
			dstUser.profile = profile;
		}
	}


	// 'services' field (at this point we know some check was already done...)
	// adds services appearing inside the src user which
	// do not appear inside the destination user (but for 'resume')

	// TODO: check whether we need to re-encrypt data using 'pinEncryptedFieldsToUser'.
	// See meteor/packages/accounts-base/accounts_server.js#L1122
  // https://github.com/meteor/meteor/blob/devel/packages/accounts-base/accounts_server.js

  // OAuth service data is temporarily stored in the pending credentials collection
  // during the oauth authentication process.
  // Sensitive data such as access tokens are encrypted without the user id
  // because we don't know the user id yet.
  // We re-encrypt these fields with the user id included
  // when storing the service data permanently in the users collection.
  //
  //function pinEncryptedFieldsToUser(serviceData, userId) {
  //  _.each(_.keys(serviceData), function (key) {
  //    var value = serviceData[key];
  //    if (OAuthEncryption && OAuthEncryption.isSealed(value))
  //      value = OAuthEncryption.seal(OAuthEncryption.open(value), userId);
  //    serviceData[key] = value;
  //  });
  //}

	var newServices = {};

	var srcServices = _.omit(srcUser.services, _.keys(dstUser.services));

	// NOTE: it is mandatory to skip also 'resume' data in order to prevent the
	//       current login action to be interrupted in case the srcUser actually
	//       has a different and outdated 'resume' data.
	srcServices = _.omit(srcUser.services, "resume");

	_.each(_.keys(srcServices), function(serviceName) {
		newServices['services.' + serviceName] = srcServices[serviceName];
		dstUser.services[serviceName] = srcServices[serviceName];
	});

	// TODO: check there are no overlapping services which have different ids!!!
	//       'emails' field: fuses the two emails fields, giving precedence to
	//       verified ones...
	var srcEmails = srcUser.emails || [];
	var dstEmails = dstUser.emails || [];

	// creates an object with addresses as keys and verification status as values
	var emails = {};
	_.each(_.flatten([srcEmails, dstEmails]), function(email) {
		emails[email.address] = emails[email.address] || email.verified;
	});

	// transforms emails back to
	// [ { address: address1, verified: boolean }, { address: address2, verified: boolean }, ...]
  // e.g. emails is obj.. { emailAddress@xxx.com: true }
  dstUser.emails = _.map(emails, function(value, key) {
		return {
			address: key,
			verified: value
		};
	});

	if (!dstUser.emails.length) {
		delete dstUser.emails;
	}
	// updates the registered_emails field
  // Reference : accounts-emails-field package
  // https://github.com/splendido/meteor-accounts-emails-field/blob/master/lib/accounts-emails-field.js @Line131
	AccountsEmailsField.updateEmails({
		user: srcUser
	});

	// Removes the old user
	Meteor.users.remove(srcUser._id);

	// Updates the current user
	Meteor.users.update(dstUser._id, {
		$set: _.omit(dstUser, "_id", "services")
	});

	Meteor.users.update(dstUser._id, {
		$set: newServices
	});
};

AM.prototype.createMeldAction = function(srcUser, dstUser) {

	MeldActions.insert({
		src_user_id: srcUser._id,
		dst_user_id: dstUser._id,
		meld: "ask",
		src_info: {
			emails: srcUser.registered_emails,
			services: _.without(_.keys(srcUser.services), "resume")
		},
		dst_info: {
			emails: dstUser.registered_emails,
			services: _.without(_.keys(dstUser.services), "resume")
		}
	});
};

AM.prototype.executeMeldAction = function(id) {
	// Retrieve the meld action document
	var meldAction = MeldActions.findOne(id);

	// Marks the meld action as "melding"
	MeldActions.update(meldAction._id, {
		$set: {
			meld: "melding"
		}
	});

	// Retrieve the source account
	var srcUser = Meteor.users.findOne(meldAction.src_user_id);

	// Retrieve the destination account
	var dstUser = Meteor.users.findOne(meldAction.dst_user_id);

	// Actually melds the two accounts
	var meldResult = this.meldAccounts(srcUser, dstUser);

	if (meldResult) {

		// Marks the meld action as "done"
		MeldActions.update(meldAction._id, {
			$set: {
				meld: "done"
			}
		});

		// Possibly removes old meld actions registered for the same two
		// accounts but for the opposite direction
		var invMeldAction = MeldActions.findOne({
			src_user_id: meldAction.dst_user_id,
			dst_user_id: meldAction.src_user_id
		});

		if (invMeldAction) {
			MeldActions.remove(invMeldAction._id);
		}

	} else {
		// XXX TODO: For now this seems the only thing to be improved in a near
		//           future. Some error status and better client communication of
		//           the problem should be put in place...
		MeldActions.update(meldAction._id, {
			$set: {
				meld: "not_now"
			}
		});
	}
};

AM.prototype.meldAccounts = function(srcUser, dstUser) {
	//checks there are no overlapping services which have different ids!!!
	var canMeld = true;

	// Checks for conflicting services before proceeding with actual melding
	if (this.getConfig('checkForConflictingServices')) {
		if (!!srcUser.services && !!dstUser.services) {
			_.each(_.keys(srcUser.services), function(serviceName) {
				if (serviceName !== "resume" && !!dstUser.services[serviceName]) {
					if (serviceName === "password") {
						var sameService = _.isEqual(
							srcUser.services[serviceName],
							dstUser.services[serviceName]
						);
						if (!sameService) {
							canMeld = false;
						}
					} else {
						var srcService = srcUser.services[serviceName];
						var dstService = dstUser.services[serviceName];
						if (!!srcService.id &&
							!!dstService.id &&
							srcService.id !== dstService.id
						) {
							canMeld = false;
						}
					}
				}
			});
		}
	}
	if (!canMeld) {
		return false;
	}

	// Melds users'object
	this._meldUsersObject(srcUser, dstUser);

	// Check whether a callback for DB document migration was specified
	var meldDBCallback = this.getConfig('meldDBCallback');

	if (meldDBCallback) {
		meldDBCallback(srcUser._id, dstUser._id);
	}

	return true;
};

// AM class instance..
AccountsMeld = new AM();




// ------------------------------------------------
// Callback functions to be registered with 'hooks'
// ------------------------------------------------

checkForMelds = function(dstUser) {
	// Updates all possibly pending meld actions...
	MeldActions.update({
		dst_user_id: dstUser._id,
		meld: "not_now"
	}, {
		$set: {
			meld: "ask"
		}
	}, {
		multi: true
	});


	// Picks up verified email addresses and creates a list like

	// [
	//    {$elemMatch: {"address": addr1, "verified": true}},
	//    {$elemMatch: {"address": addr2, "verified": true}},
	//    ...
	// ]
	var queryEmails = _.chain(dstUser.registered_emails)
		.filter(function(email) {
			return email.verified;
		})
		.map(function(email) {
			return {
				"registered_emails": {
					$elemMatch: email
				}
			};
		})
		.value();


	// In case there is at least one registered address
	if (queryEmails.length) {
		// Finds users with at least one registered email address matching the
		// above list
		if (queryEmails.length > 1) {
			queryEmails = {
				$or: queryEmails
			};
		} else {
			queryEmails = queryEmails[0];
		}

		// Excludes current user...
		queryEmails._id = {
			$ne: dstUser._id
		};

		var users = Meteor.users.find(queryEmails);

		users.forEach(function(user) {

			if (AccountsMeld.getConfig('askBeforeMeld')) {
				// Checks if there is already a document about this meld action
				var meldAction = MeldActions.findOne({
					src_user_id: user._id,
					dst_user_id: dstUser._id
				});

				if (meldAction) {
					// If the last time the answer was "Not now", ask again...
					if (meldAction.meld === "not_now") {
						MeldActions.update(meldAction._id, {
							$set: {
								meld: "ask"
							}
						});
					}
				} else {
					// Creates a new meld action
					AccountsMeld.createMeldAction(user, dstUser);
				}

			} else {
				// Directly melds the two accounts
				AccountsMeld.meldAccounts(user, dstUser);
			}
		});
	}
};


/**
 *
 * @param serviceName
 * @param serviceData
 * @returns {{}}
 *
 *
 */

// updateOrCreateUserFromExternalService 함수 내부에서 invoked
var _createServiceSelector = function(serviceName, serviceData) {

	// Selector construction copied from
	// accounts-base/accounts_server.js Lines 1333~
  // Start copy code :

  // Look for a user with the appropriate service user id.
	var selector = {};
	var serviceIdKey = "services." + serviceName + ".id";

	// XXX Temporary special case for Twitter. (Issue #629)
	//   The serviceData.id will be a string representation of an integer.
	//   We want it to match either a stored string or int representation.
	//   This is to cater to earlier versions of Meteor storing twitter
	//   user IDs in number form, and recent versions storing them as strings.
	//   This can be removed once migration technology is in place, and twitter
	//   users stored with integer IDs have been migrated to string IDs.
	if (serviceName === "twitter" && !isNaN(serviceData.id)) {
		selector.$or = [{}, {}];
		selector.$or[0][serviceIdKey] = serviceData.id;
		selector.$or[1][serviceIdKey] = parseInt(serviceData.id, 10);
	} else {
		selector[serviceIdKey] = serviceData.id;
	}

	return selector;

  // End copy code
};


// 미티어 원본 소스 참조하는 변수
var origUpdateOrCreateUserFromExternalService =
	Accounts.updateOrCreateUserFromExternalService;

// 외부 서비스로부터 유저를 생성하거나 업데이트(로그인한 유저가 외부서비스 연결)를 할때 사용하는 함수
updateOrCreateUserFromExternalService = function(serviceName, serviceData, options) {
  console.log('serviceName: ', serviceName);
  console.log('serviceData: ', serviceData);
  console.log('options: ', options);

	var
		currentUser = Meteor.user(),
		selector,
		setAttr,
		serviceIdKey,
		user;

  // 현재 로그인한 유저인지 체크
	if (currentUser) {
    // 현재 로그인한 유저가 연결하려는 서비스를 사용중인지 체크
		if (!currentUser.services[serviceName]) {

			// Creates a selector for the current service
			selector = _createServiceSelector(serviceName, serviceData);

			// Look for a user with the appropriate service user id.

      // 셀렉터를 가지고 해당하는 서비스 유저 id를 가진 유저가 있는지 체크
			user = Meteor.users.findOne(selector);
      if (!user) {
				// 현재 로그인한 유저에 해당하는 서비스를 처음으로 추가
				// Simply add the service to the current user, and that's it!
				setAttr = {};
				serviceIdKey = "services." + serviceName + ".id";
				setAttr[serviceIdKey] = serviceData.id;

				// This is just to fake updateOrCreateUserFromExternalService so to have
				// it attach the new service to the existing user instead of creating a
				// new one
				Meteor.users.update({
					_id: currentUser._id
				}, {
					$set: setAttr
				});

				// Now calls original updateOrCreateUserFromExternalService
				origUpdateOrCreateUserFromExternalService.apply(this, arguments);

				// Reloads updated currentUser
				currentUser = Meteor.users.findOne(currentUser._id);

				// Updates the registered_emails field
				AccountsEmailsField.updateEmails({
					user: currentUser
				});

				// Checks whether a callback for user update after a new service is
				// added was specified
				var serviceAddedCbk = AccountsMeld.getConfig('serviceAddedCallback');
				if (serviceAddedCbk) {
					serviceAddedCbk(currentUser._id, serviceName, serviceData, options);
				}

				// Cancels the login to save some data exchange with the client
				// currentUser will remain logged in
				return {
					type: serviceName,
					error: new Meteor.Error(
						Accounts.LoginCancelledError.numericError,
						"Service correctly added to the current user, no need to proceed!"
					)
				};
			} else {

				// This service was already registered for "user"
				if (AccountsMeld.getConfig('askBeforeMeld')) {
					// Checks if there is already a document about this meld action
					var meldAction = MeldActions.findOne({
						src_user_id: user._id,
						dst_user_id: currentUser._id
					});

					if (meldAction) {

						// If the last time the answer was "Not now", ask again...
						if (meldAction.meld === "not_now") {
							MeldActions.update(meldAction._id, {
								$set: {
									meld: "ask"
								}
							});
						}

					} else {
						// Creates a new meld action
						AccountsMeld.createMeldAction(user, currentUser);
					}
					// Cancels the login to keep currentUser logged in...
					return {
						type: serviceName,
						error: new Meteor.Error(
							Accounts.LoginCancelledError.numericError,
							"Another account registered with the same service was found!"
						)
					};
				} else {
					// Directly melds the two accounts
					AccountsMeld.meldAccounts(user, currentUser);
					// Cancels the login
					return {
						type: serviceName,
						error: new Meteor.Error(
							Accounts.LoginCancelledError.numericError,
							"Another account registered with the same service was found, " +
							"and melded with the current one!"
						)
					};
				}
			}
		}


	} else {
    // 로그인된 유저가 없는 경우, 유저는 로그인 중에 있다.
    // 유저에게 동일한 이메일을 가진 계정이 있으면 물어보는 설정이 되어 있지 않은 경우
    // 즉, 자동으로 통합 수행
		// The user is logging in now...
		// Only In case automatic melding is set
		if (!AccountsMeld.getConfig('askBeforeMeld')) {

      // 현재 서비스로 로그인하기 위한 셀렉터 생성
			// Creates a selector for the current service
			selector = _createServiceSelector(serviceName, serviceData);

      // 올바른 해당 서비스 user id를 가진 유저가 이미 계정에 존재하는지 찾는다.
			// Look for a user with the appropriate service user id.
			user = Meteor.users.findOne(selector);

			if (!user) {
        // 이 외부 서비스는 처음으로 사용되고 있는 중!
        // 현재 외부 서비스와 연결된 email 주소를 추출
				// This service is being used for the first time!
				// Extracts the email address associated with the current service
				var serviceEmails = AccountsEmailsField.getEmailsFromService(
					serviceName,
          serviceData
				).filter(function(serviceEmail) {
					return serviceEmail.verified;
				});

        // 인증된 메일이 있는 경우
				// In case it is a verified email...
				if (serviceEmails.length) {
          // 해당 외부 서비스에서 사용된 인증된 이메일 주소가
          // 이미 존재하는 다른 계정과 연결되어 있는지 확인
					// ...checks whether the email address used with the service is
					// already associated with an existing account.
					selector = {
						$or: serviceEmails.map(function(serviceEmail) {
							return {
								"registered_emails": {$elemMatch: serviceEmail}
							};
						})
					};

          // 셀렉터를 이용해서 외부서비스에서 인증된 이메일들과 동일한 이메일 주소를 가진 유저를 찾는다.
					var otherUser = Meteor.users.findOne(selector);
					if (otherUser) {
            // 간단하게 서비스를 찾은 유저에 추가해라. 그게 전부다.
						// Simply add the service to 'user', and that's it!
						setAttr = {};
						serviceIdKey = "services." + serviceName + ".id";
						setAttr[serviceIdKey] = serviceData.id;

            // 이것은 그저 updateOrCreateUserFromExternalService를 속여서
            // 새로운 유저를 생성하지 않고 기존 유저에 새로운 서비스를 연결하도록 해준다.
						// This is just to fake updateOrCreateUserFromExternalService so to
						// have it attach the new service to the existing user instead of
						// creating a new one
						Meteor.users.update({
							_id: otherUser._id
						}, {
							$set: setAttr
						});
					}

				}
			}
		}
	}

	// Let the user in!
	return origUpdateOrCreateUserFromExternalService.apply(this, arguments);
};
