/**
 * Show all type of alerts including error, warning, inform, success etc.
 *
 */

/**
 * Alerts object: notification & dialog
 *
 *  Notification
 *    type: 'error', 'warning', 'info', 'success', etc.
 *    message: message content
 *    duration: the alert is disappeared automatically after the duration
 *      if -1, the alert does not disappear.
 *      default value is 3000. the unit is millisecond
 *
 *  Dialog
 *    type: 'alert', 'confirm'
 *    message: message content
 *    callback: callback at user's response on the dialog
 */
Alerts = {
  // Local (client-only) collection
  collection: new Mongo.Collection(null),

  _set: function(type, message, template, duration = 5000) {
    Alerts.collection.insert({
      type, template, duration, message: I18n.get(message)
    });
  },

  notify: function(type, message, duration) {
    this._set(type, message, 'window', duration);
  },

  notifyModal: function(type, message, duration) {
    this._set(type, message, 'modal', duration);
  },

  dialog: function(type, message, callback) {
    var data = {
      type: type,
      message: message,
      callback: callback
    };

    data.view = Blaze.renderWithData(
      Template.meteorAlertDialog, data, document.body
    );
  }
};
