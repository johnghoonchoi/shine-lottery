/**
 *  Send Emails using templates in '/private/mail/' directory
 */

/**
 *  Common area : footer
 *
  * @param html
 * @returns {string}
 */
var replaceMailFooter = function(html, lang) {
  return html
    .replace('{{connectWithUs}}', I18n.get('label_connect_us', lang))
    .replace(new RegExp('{{facebookUrl}}', 'g'), System.url.facebook)
    .replace(new RegExp('{{twitterUrl}}', 'g'), System.url.twitter)
    .replace('{{contactInfo}}', I18n.get('label_contact_info', lang))
    .replace('{{labelPhone}}', I18n.get('label_phone', lang))
    .replace('{{labelAddress}}', I18n.get('label_address', lang))
    .replace('{{phoneNumber}}', I18n.get('text_company_phone', lang))
    .replace('{{address}}', I18n.get('text_company_address', lang))
    .replace('{{termsOfUse}}', I18n.get('label_terms_of_use', lang))
    .replace('{{privacyPolicy}}', I18n.get('label_privacy_policy', lang))
    .replace('{{unsubscribe}}', I18n.get('label_unsubscribe', lang))
    .replace(new RegExp('{{termsOfUseUrl}}', 'g'), System.url.termsOfUse)
    .replace(new RegExp('{{privacyPolicyUrl}}', 'g'), System.url.privacyPolicy)
    .replace(new RegExp('{{unsubscribeUrl}}', 'g'), System.url.unsubscribe);
};

Accounts.emailTemplates.from = APP_NAME + " <no-reply@bookp.al>";

Accounts.emailTemplates.resetPassword.subject = function(user, lang) {
  return I18n.get('title_mail_reset_password', [ I18n.get('brand', lang) ], lang);
};

Accounts.emailTemplates.resetPassword.html = function(user, resetPasswordUrl, lang) {
  var html = Assets.getText('mail/resetPassword.html');
  var result = html
    .replace(new RegExp('{{logoUrl}}', 'g'), System.url.mailLogo)
    .replace(new RegExp('{{linkUrl}}', 'g'), resetPasswordUrl)
    .replace('{{title}}', I18n.get('title_reset_password', [ userDisplayName(user) ], lang))
    .replace('{{content}}', I18n.get('text_reset_password', lang));

  return replaceMailFooter(result, lang);
};


Accounts.emailTemplates.verifyEmail.subject = function(user, lang) {
  return I18n.get('title_mail_verify_email', [ I18n.get('brand', lang) ], lang);
};

Accounts.emailTemplates.verifyEmail.text = function(user, verifyEmailUrl, lang) {
  var html = Assets.getText('mail/verifyEmail.html');

  var result = html
    .replace(new RegExp('{{logoUrl}}', 'g'), System.url.mailLogo)
    .replace(new RegExp('{{emailUrl}}', 'g'), verifyEmailUrl)
    .replace('{{title}}', I18n.get('title_verify_email', [ userDisplayName(user) ], lang))
    .replace('{{content}}', I18n.get('text_verify_email', lang))
    .replace('{{brand}}', I18n.get('brand', lang));

  return replaceMailFooter(result, lang);
};

Accounts.emailTemplates.verifyEmail.html = function(user, verifyEmailUrl, lang) {
  var html = Assets.getText('mail/verifyEmail.html');

  var result = html
    .replace(new RegExp('{{logoUrl}}', 'g'), System.url.mailLogo)
    .replace(new RegExp('{{emailUrl}}', 'g'), verifyEmailUrl)
    .replace('{{title}}', I18n.get('title_verify_email', [ userDisplayName(user) ], lang))
    .replace('{{content}}', I18n.get('text_verify_email', lang))
    .replace('{{brand}}', I18n.get('brand', lang));

  return replaceMailFooter(result, lang);
};



