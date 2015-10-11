/**
 * Created by ProgrammingPearls on 15. 10. 10..
 */


Template.home.onCreated(function () {

    let query = {};
    let options = {};
    this.subscribe('gameroomsList', query, options);

});

Template.home.onRendered(function () {
  $('#content').removeClass("slideLeft");
});

Template.home.helpers({
  'gamerooms'() {
    return Gamerooms.find();
  },
});

Template.home.events({
  'click .navtabs-add-game'(e) {
    Router.go('/add');
  }

});

Template.homeListItem.onCreated(function () {

  console.log('this.data', this.data);

  let query = { 'rooms.roomId': this.data._id };

  this.subscribe('connectedListCount', query);

});

Template.homeListItem.helpers({
  'isReady'(state) {
    return state === "ready"? true : false;
  },

  'connectionCounts'(roomId) {
    return Counts.get('connectedListCount', roomId);
  }
})

Template.homeListItem.events({
  'click .btn-success'(e, instance) {
    //e.stopPropagation();
    //e.preventDefault();
    Meteor.call('connectionJoinRoom', instance.data);
  }
})
