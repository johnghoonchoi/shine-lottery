/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */
//
//
// chatView
Template.chatFrame.onCreated(function () {
  // initialize
  let data = Template.currentData();
  let toId = data.user._id;

  // other side input message
  this.status = "input";
  this.onTyping = false;

  Meteor.call('chatStatusRemove', this.status);

  this.autorun( () => {
    this.chatMessages = this.subscribe('chatMessages', toId);
    this.subscribe('chatStatus', toId, this.status);
  });

  this.autorun( () => {
    if (this.chatMessages.ready())
      this.partnerPicture = getPicture(Meteor.users.findOne({_id: toId}));
  });
  this.latelyDate = () => ChatMessages.findOne({}, { sort: { createdAt: -1 }});

});

Template.chatFrame.onDestroyed(function () {
  chatSingleton.template = null;
  chatSingleton.userId = null;

  // other side input message
  this.onTyping = false;
  Meteor.call('chatStatusRemove', this.status);
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

  // header events
  'click a.close' (e) {
    Blaze.remove(chatSingleton.template);
  },

  // footer events
  'keyup textarea' (e, instance) {

    let thisElement = instance.find("textarea");
    let content = thisElement.value;

    // remove line breaks from string
    content = content.replace(/(\r\n|\n|\r)/gm,"");

    let toId = this.user._id;
    let data = {
      toId: toId,
      status: instance.status
    };

    // input text
    if (content.length === 0 || content === "" || content === null) {
      if (instance.onTyping) {
        instance.onTyping = !instance.onTyping;
        Meteor.call('chatStatusRemove', instance.status);
      }

      // clear textarea
      thisElement.value = "";
      return;
    } else {
      if (!instance.onTyping) {
        instance.onTyping = !instance.onTyping;
        Meteor.call('chatStatusInsert', data);
      }
    }

    // input enter
    if (e.which === 13) {

      e.stopPropagation();
      //e.preventDefault();

      console.log('content', content);
      // clear textarea
      thisElement.value = "";

      // lately date to less than 5 minutes date.
      let latelyDate = instance.latelyDate() || 0;

      let inputDate = new Date();

      let diffMinutes = Math.abs(moment(latelyDate.createdAt).diff(inputDate, "minutes"));

      let timeScope = 10;

      if (!latelyDate || diffMinutes >= timeScope) {
        // insert message (type=date)
        data = {
          toId: toId,
          type: "date"
        };
        Meteor.call('chatMessageInsert', data);
      }

      let data = {
        toId: toId,
        content: content,
        type: "msg"
      };

      // insert message (type=msg)
      Meteor.call('chatMessageInsert', data);

      // remove input status
      Meteor.call('chatStatusRemove', instance.status);
      instance.onTyping = false;
    }
  }
});

//
// chatMessageListItem
Template.chatMessageListItem.onRendered(function () {
  // scroll to bottom of main div
  let selector = 'main.body';
  ScrollToBottom(selector);
});

Template.chatMessageListItem.helpers({
  isDate (type) {
    return type === "date";
  },

  isUserMessage (from) {
    return Meteor.userId() === from._id ? true : false;
  },

  getPartnerPictures () {
    return Template.instance().parentInstance("chatFrame").partnerPicture;
  }
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
    return Template.instance().parentInstance("chatFrame").partnerPicture;
  }
});
