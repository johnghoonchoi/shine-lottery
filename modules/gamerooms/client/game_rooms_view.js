/**
 * Created by ProgrammingPearls on 15. 10. 11..
 */

Template.gameroomsView.onCreated(function () {

  console.log('this: ', this);


  let query = {};
  let options = {};

  this.connectionListHandle = this.subscribe('connectedList', query, options);

});

Template.gameroomsView.onDestroyed(function () {
  Meteor.call('connectionLeaveRoom');
});

Template.gameroomsView.helpers({
  'connections'() {
    if (Template.instance().connectionListHandle.ready()) {
      return Connection.collection.find();
    }
  },
  'connectionCount'() {
    if (Template.instance().connectionListHandle.ready()) {
      return Connection.collection.find().count();
    }
  },
  'isHost'() {
    if (Template.instance().connectionListHandle.ready()) {
      let connection = Connection.collection.findOne({ "rooms.roomId": {$nin: ['']}}, { sort: {'rooms.roomConnectedAt': -1 } });

      if (connection && connection.user && connection.user._id) {
        return connection.user._id === Meteor.userId();
      }
    }
  }
});

Template.gameroomsView.events({

});


Template.connectionsListItem.helpers({
  toUser: function () {
    if (this.user && this.user._id) {
      return Meteor.users.findOne({_id: this.user._id});
    }
  }
});