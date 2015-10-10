/**
 * Created by ProgrammingPearls on 15. 10. 10..
 */


Template.home.onCreated(() => {

});

Template.home.helpers({

});

Template.home.events({
  'click #btn_login'(e) {
    e.preventDefault();
    Accounts.ui.dialog.show('signIn');
  },

  'click #btn_logout'(e) {
    e.preventDefault();
    Meteor.logout();
  },

})