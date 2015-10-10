/**
 * Created by ProgrammingPearls on 15. 10. 10..
 */


Template.home.onCreated(function () {

  this.autorun(()=> {
    let query = {};
    let options = {};
    this.subscribe('gameroomsList', query, options);
  });


});

Template.home.onRendered(function () {
  $('#content').removeClass("slideLeft");
});

Template.home.helpers({
  'gamerooms'() {
    return Gamerooms.find();
  },
})

Template.home.events({
  'click .navtabs-add-game'(e) {
    Router.go('/add');
  }

});


Template.homeListItem.helpers({
  'isReady'(state) {
    return state === "ready"? true : false;
  },
})

