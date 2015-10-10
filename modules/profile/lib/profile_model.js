
Meteor.methods({
  profileUpdate: function(attributes) {
    check(attributes, Match.Where(matchAccountUpdate));

    var saved = Meteor.user();
    var update = {};
    var emailModified = false;

    if (saved.emails[0].address !== attributes.email) {
      update['emails.0'] = { address: attributes.email, verified: false };
      emailModified = true;
    }

    /*
    if (! (saved.profile && saved.profile.name) && attributes.name.length > 0) {
      update['profile.name'] = attributes.name;
    }
    */

    if (Object.keys(update).length === 0) {
      return {};
    }

    try {
      Meteor.users.update({ _id: this.userId }, { $set: update });

      if (! this.isSimulation) {
        var that = this;
        if (emailModified) {
          Meteor.setTimeout(function() {
            Accounts.sendVerificationEmail(that.userId, attributes.email);
          }, 0);

          return {
            message: 'text_email_sent'
          }
        }
      }
    } catch (ex) {
      if (ex.stack && ex.stack.indexOf("E11000 duplicate key") > -1)
        return { error: "error_email_exist" };
      else
        return { error: ex.message };
    }
  }
});
