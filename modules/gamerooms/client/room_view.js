/**
 * Created by ProgrammingPearls on 15. 10. 11..
 */

Template.gameroomsView.onCreated(function () {


  let options = {};

  let roomId = this.data;

  let query = { 'rooms.roomId': roomId };

  this.connectionListHandle = this.subscribe('connectedList', query, options);

  this.latelyDate = () => ChatMessages.findOne({ roomId }, { sort: { createdAt: -1 }});

});

Template.gameroomsView.onDestroyed(function () {
  Meteor.call('connectionLeaveRoom', () => {
    if (Connection.collection.find().count() === 0) {
      Meteor.call('removeRoom', this.data);
    }
  });
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
      let connection = Connection.collection.findOne({ "rooms.roomId": {$nin: ['']}}, { sort: {'rooms.roomConnectedAt': 1 } });

      if (connection && connection.user && connection.user._id) {
        return connection.user._id === Meteor.userId();
      }
    }
  }
});

Template.gameroomsView.events({

  // footer events
  'keyup textarea' (e, instance) {

    console.log('instance', instance);

    let thisElement = instance.find("textarea");
    let content = thisElement.value;

    console.log('thisElement', thisElement);
    // remove line breaks from string
    //content = content.replace(/(\r\n|\n|\r)/gm,"");

    //let toId = this.user._id;
    //let data = {
    //  status: instance.status
    //};

    // input text
    if (content.length === 0 || content === "" || content === null) {
      //if (instance.onTyping) {
      //  instance.onTyping = !instance.onTyping;
      //  Meteor.call('chatStatusRemove', instance.status);
      //}

      // clear textarea
      thisElement.value = "";
      return;
    } else {
      //if (!instance.onTyping) {
      //  instance.onTyping = !instance.onTyping;
      //  Meteor.call('chatStatusInsert', data);
      //}
    }

    // input enter
    if (e.which === 13) {

      e.stopPropagation();
      //e.preventDefault();

      console.log('content', content);

      let connection = Connection.collection.findOne({ "user._id" : Meteor.userId() });
      let user;

      if (connection && connection.user) {
        user = connection.user;
      }

      let roomId = instance.data;

      console.log('user', user);
      // clear textarea
      thisElement.value = "";

      // lately date to less than 5 minutes date.
      //let latelyDate = instance.latelyDate() || 0;

      //let inputDate = new Date();

      //let diffMinutes = Math.abs(moment(latelyDate.createdAt).diff(inputDate, "minutes"));

      //let timeScope = 10;

      //if (!latelyDate || diffMinutes >= timeScope) {
        // insert message (type=date)
        //data = {
        //  user,
        //  type: "date"
        //};
        //Meteor.call('chatMessageInsert', data);
      //}

      let data = {
        roomId,
        user,
        content: content,
        type: "msg"
      };

      // insert message (type=msg)
      Meteor.call('chatMessageInsert', data);

      // remove input status
      //Meteor.call('chatStatusRemove', instance.status);
      //instance.onTyping = false;
    }
  }
});


Template.connectionsListItem.helpers({
  toUser: function () {
    if (this.user && this.user._id) {
      return Meteor.users.findOne({_id: this.user._id});
    }
  }
});