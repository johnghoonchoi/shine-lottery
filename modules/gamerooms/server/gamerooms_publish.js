/**
 * Created by ProgrammingPearls on 15. 10. 10..
 */


Meteor.publish('gameroomsList', function(query, options) {
  return Gamerooms.find(query, options);
});

Meteor.publish('connectedList', function (query, options) {

  Counts.publish(this, 'connectionListCount',
    Connection.collection.find(query), { noReady: true });

  options = {
    fields: {
      rooms: 1,
      user: 1,
    }
  };

  return Connection.collection.find(query, options);
});
