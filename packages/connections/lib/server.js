/**
 *
 */
function _connectionProc(connection) {

  var client = {
    _id: connection.id,
    clientId: null,
    ip: connection.clientAddress,
    userAgent: connection.httpHeaders['user-agent'],
    rooms: {
      roomId: '',
      roomConnectedAt: '',
    },
    createdAt: new Date()
  };

  let loginCount = Connection.collection.find({ip: connection.clientAddress}).count();

  //if (loginCount != 0) return;

  client._id = Connection.collection.insert(client);
  console.log('connection inserted: id = ' + client._id );

  connection.onClose(function() {
    Connection.collection.remove(connection.id, function(error) {
      if (error) {
        Logger.error('connection error: ' + error.reason);
      } else {
        console.log('connection removed');
      }
    });
  });

  return client;
}

function _userModifier(user) {
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    profile: user.profile,
    oauths: user.oauths
  };
}

Meteor.onConnection(_connectionProc);

Meteor.methods({
  connectionInit: function(clientId) {
    check(clientId, String);

    let saved = Connection.collection.findOne(this.connection.id);

    if (! saved) _connectionProc(this.connection);

    let data = { clientId: clientId };
    if (this.userId) {
      let user = Meteor.users.findOne(
        { _id: this.userId }, { fields: { services: 0 }}
      );

      data = _.extend(data, { user: _userModifier(user) });
    }

    Connection.collection.update(this.connection.id, { $set: data });

    return clientId;
  },

  connectionUpdateUser: function() {
    let modifier = (this.userId) ?
    { $set: { user: _userModifier(Meteor.user()) }} :
    { $unset: { user: 1, rooms: 1 }, };

    Connection.collection.update(this.connection.id, modifier);
  },

  connectionUpdatePath: function(path) {
    check(path, String);

    Connection.collection.update(this.connection.id, { $set: { path: path }});
  },

  connectionJoinRoom: function (rooms) {
    rooms = {
      roomId: rooms._id,
      roomConnectedAt: new Date(),
    };

    Connection.collection.update(this.connection.id, { $set: { rooms: rooms }});
  },

  connectionLeaveRoom: function (roomId) {
    Connection.collection.update(this.connection.id, { $unset: { rooms: 1 }});

    console.log('roomId', roomId);

    if (Connection.collection.find({ $and: [{"rooms.roomId": {$nin: ['']}}, {"rooms.roomId": { $exists: true }}]}).count() === 0) {
      Meteor.call('removeRoom', roomId);
    }
  }
});
