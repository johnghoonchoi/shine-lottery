
Template.accountsUIOverlay.onDestroyed = function() {
  if (! Accounts.ui.view) {
    Blaze.remove(Accounts.ui.view);
  }
};


Template.accountsUIOverlay.helpers({
  activeTemplate: function() {
    return Accounts.ui.activeTemplate.get();
  }
});


Template.accountsUIHeader.helpers({
  title: function() {
    return I18n.get(this.title);
  }
});

Template.accountsUIHeader.events({
  'click, tab a.close': function(e) {
    e.preventDefault();
    Accounts.ui.dialog.hide();
    Router.go('home');
  }
});
