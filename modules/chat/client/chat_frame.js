/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */
//
//
// chatView
Template.chatFrame.onCreated(function () {
  // initialize
  let roomId = this.data;
  //let toId = data.user._id;

  // other side input message
  this.status = "input";
  this.onTyping = false;

  //Meteor.call('chatStatusRemove', roomId);

  this.autorun( () => {
    this.chatMessages = this.subscribe('chatMessages', roomId);
    //this.subscribe('chatStatus', roomId, this.status);
  });

  this.autorun( () => {
    //if (this.chatMessages.ready())
      //this.partnerPicture = getPicture(Meteor.users.findOne({_id: toId}));
  });


});

Template.chatFrame.onDestroyed(function () {
  chatSingleton.template = null;
  chatSingleton.userId = null;

  // other side input message
  this.onTyping = false;
  //Meteor.call('chatStatusRemove', this.status);
});

Template.chatFrame.helpers({
  chatMessagesList () {
    return ChatMessages.find({}, { sort : { createdAt: 1 } });
  },
  onTyping () {
    return Counts.get('chatStatusCount') > 0 ? true : false;
  }
});

Template.chatFrame.events({

});

//
// chatMessageListItem

Template.chatMessageListItem.onCreated(function () {
  this.connection = Connection.collection.findOne({ "user._id" : Meteor.userId() });
});

Template.chatMessageListItem.onRendered(function () {
  // scroll to bottom of main div
  let selector = 'main.body';
  ScrollToBottom(selector);
});

Template.chatMessageListItem.helpers({
  isDate (type) {
    return type === "date";
  },

  isUserMessage (user) {
    return Meteor.userId() === user._id ? true : false;
  },

  getPartnerPictures () {
    let connection = Template.instance().connection;
    return connection.user && connection.user.profile && connection.user.username;
  }
});


Template.chatStatusInput.onCreated(function () {
  this.connection = Connection.collection.findOne({ "user._id" : Meteor.userId() });
});
//
// chatStatusListItem
Template.chatStatusInput.onRendered(function () {
  // scroll to bottom of main div
  let selector = 'main.body';
  ScrollToBottom(selector);
});

Template.chatStatusInput.helpers({
  getPartnerPictures () {
    let connection = Template.instance().connection;
    return connection.user && connection.user.profile && connection.user.username;
  }
});
