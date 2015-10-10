Tinytest.add("Alerts - collection", function(test) {
  test.equal(Alerts.collection.find({}).count(), 0);
  Alerts.error('A new message!');

  test.equal(Alerts.collection.find({}).count(), 1);
  Alerts.collection.remove({});
});

Tinytest.addAsync("Alerts - template", function(test, done) {
  Alerts.error('A new message!');
  test.equal(Alerts.collection.find({}).count(), 1);

  // render the template
  UI.insert(UI.render(Template.meteorAlerts), document.body);

  Meteor.setTimeout(function() {
    test.equal(Alerts.collection.find({}).count(), 0);
    done();
  }, 3500);
});
