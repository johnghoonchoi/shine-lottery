Template.pagination.helpers({
  ready: function() {
    var handle = Template.instance().handle;
    return (handle) ? handle.ready() : true;
  },

  hasMore: function() {
    return this.hasMore();
  }
});

Template.pagination.events({
  'click #load-more': function(e, instance) {
    e.preventDefault();

    const data = Template.currentData();
    data.limitInc();
    instance.handle = data.subscribe(instance);
  }
});
