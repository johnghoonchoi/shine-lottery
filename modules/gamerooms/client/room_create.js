Template.roomCreate.onCreated(function() {

});

Template.roomCreate.events({
  'submit #formRoomWrite'(e, instance) {
    e.preventDefault();

    var object = {
      title: instance.$('[name=title]').val().trim()
    };

    Meteor.call('insertRoom', object, (error, result) => {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_room_insert_success');
        Router.go('gameroomsView', { _id: result });
      }
    });

  }
});
