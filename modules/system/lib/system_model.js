Systems = new Mongo.Collection('systems');

Meteor.methods({
  systemUpsert: function(query) {
    var saved = Systems.findOne({ _id: query._id });
    var now = new Date();
    var user = Meteor.user();

    if (! saved) {
      var object = {
        _id: query._id,
        value: query.value,
        workBy: {
          _id: user._id,
          username: user.username,
          name: user.name
        },
        createdAt: now,
        updatedAt: now
      };

      object._id = Systems.insert(object);

      return object._id;
    } else {
      var object = {
        value: query.value,
        workBy: {
          _id: user._id,
          username: user.username,
          name: user.name
        },
        updatedAt: now
      };

      return Systems.update({ _id: query._id }, { $set: object });
    }
  }

});
