/**
 * constants
 */

//  Reference : https://jack.ofspades.com/es6-const-not-immutable/
let makeConstants = () => {
  // this is READ-ONLY
  const CONSTANTS = {
    APP_NAME                        : "SHINE",
    CUSTOM_THEME                    : 'shiny',
    DEFAULT_THEME                   : "",
    DEFAULT_LIST_INCREMENT          :  10,

    NOTIFICATION_MSG_TYPE_COMMENT   : 'comment',
    NOTIFICATION_MSG_TYPE_NOTICE    : 'notice',

    ERROR_CODE_SECURITY             : 403,
    ERROR_CODE_MATCH                : 501,
    ERROR_CODE_DATABASE             : 531,

    SYSTEM : {
      // URLs used in mail template
      URL: {
        mailLogo: Meteor.absoluteUrl("http://file.bookpal.co.kr/novel/images/head/logo4y_2.png"),
        facebook: "https://www.facebook.com/bookpal.co.kr",
        twitter: "https://twitter.com/bookpalkorea",
        termsOfUse: Meteor.absoluteUrl("terms-of-use"),
        privacyPolicy: Meteor.absoluteUrl("privacy-policy"),
        unsubscribe: Meteor.absoluteUrl("unsubscribe")
      }
    }
  };

  let constantize = (obj) => {
    // constantizes the first level of properties of the object.
    Object.freeze(obj);
    // iterates over the properties of the object and constantizes them recursively.
    Object.keys(obj).forEach( (key, value) => {
      if ( typeof obj[key] === 'object' ) {
        constantize( obj[key] );
      }
    });
  };

  constantize( CONSTANTS );

  return function() {
    return CONSTANTS
  }
}

let constClosure = makeConstants();

SHINE_CONSTANTS = constClosure();


// old version
APP_NAME                                = "SHINE";

DEFAULT_THEME                           = "classic";
DEFAULT_LIST_INCREMENT                  = 10;

NOTIFICATION_MSG_TYPE_COMMENT           = 'comment';
NOTIFICATION_MSG_TYPE_NOTICE            = 'notice';

ERROR_CODE_SECURITY                     = 403;
ERROR_CODE_MATCH                        = 501;
ERROR_CODE_DATABASE                     = 531;

System = {

  // URLs used in mail template
  url: {
    mailLogo: Meteor.absoluteUrl("http://file.bookpal.co.kr/novel/images/head/logo4y_2.png"),
    facebook: "https://www.facebook.com/bookpal.co.kr",
    twitter: "https://twitter.com/bookpalkorea",
    termsOfUse: Meteor.absoluteUrl("terms-of-use"),
    privacyPolicy: Meteor.absoluteUrl("privacy-policy"),
    unsubscribe: Meteor.absoluteUrl("unsubscribe")
  }
};
