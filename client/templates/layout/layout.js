
Template.layout.events({
  'click #content, click aside': function(e) {
    Aside.hide();
    hideBalloons();
  }
});
