/**
 * Created by ProgrammingPearls on 15. 10. 11..
 */

Meteor.publish('connectedListCount', function(query) {
  Counts.publish(this, 'connectedListCount', Connection.collection.find(query));
});