/**
 * Notifications
 *    _id                 String                  PK
 *    user                Object                  Receiver
 *      _id               String                  PK of the user
 *    mobile              Object                  mobile phone to receive the msg
 *      os                String                  OS of the mobile phone
 *                                                  'ios'
 *                                                  'android'
 *      token             String                  Device token of the phone
 *    msg                 Object
 *      type              String { 1..50 }        Custom definitions for UI
 *                                                  'comment'
 *                                                  'announcement'
 *                                                  'ad'
 *                                                  ...
 *      content           String { 1..200 }       Message
 *      link              String { 1..100 }       Link to redirect on click
 *    read                Boolean                 Check read or not
 *    readAt              Date                    read time
 *    createdAt           Date                    created time
 *
 */

/**
 * read notifications list for the current user to receive
 *
 */
Meteor.publish('notificationsList', function(query) {

  query = _.extend({ 'user._id': this.userId }, query);

  Counts.publish(this, 'notificationsUnreadCount',
      Notifications.find(_.extend(query, { read: false })), { noReady: true });

  return Notifications.find(query, { sort: { createdAt: -1 }});
});
