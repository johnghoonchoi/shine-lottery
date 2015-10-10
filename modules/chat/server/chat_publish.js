/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Meteor.publishComposite('chatMessages', function (toId, limit) {
  return {
    find: function () {
      var query = { _id: toId };
      limit = limit || 0;

      return Meteor.users.find(query, { fields: { services: 0 } });

    },
    children: [{
      find: function () {
        var senderQuery = {"from._id": this.userId, "to._id": toId};
        var receiverQuery = {"from._id": toId, "to._id": this.userId};

        var query = {$or: [ senderQuery, receiverQuery]};

        return ChatMessages.find(query, { limit: limit, sort : { createdAt : -1 }});
      }
    }]
  }
});

Meteor.publish('chatStatus', function (toId, status) {

  var senderQuery = {"from._id": this.userId, "to._id": toId, "status": status};
  var receiverQuery = {"from._id": toId, "to._id": this.userId, "status": status};

  var query = {$or: [senderQuery, receiverQuery]};

  Counts.publish(this, 'chatStatusCount',
    ChatStatus.find({"to._id": this.userId})
  );
  return ChatStatus.find(query);
});

// how to remove Duplicate source?
