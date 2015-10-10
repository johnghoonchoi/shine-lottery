/**
 * Created by ProgrammingPearls on 15. 10. 10..
 */


Meteor.publish('gameroomsList', function(query, options) {
  return Gamerooms.find(query, options);
});