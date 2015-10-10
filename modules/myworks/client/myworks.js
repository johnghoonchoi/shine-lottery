Template.myworks.onCreated(function() {
  Navigations.path.set('myworks');
});

Template.myworksList.onCreated(function() {
  var instance = this;
  var data;
  instance.increment = DEFAULT_LIST_INCREMENT;
  instance.loadDefault = 0;
  instance.modeDefault = 'draft';

  instance.state = new ReactiveDict;
  instance.state.set('limit', instance.increment);
  instance.state.set('loaded', instance.loadDefault);

  instance.autorun(function() {
    var limit = instance.state.get('limit');
    data = Template.parentData(1);

    if (data.mode === instance.modeDefault) {
      instance.subscribe('postDraftsList', {}, { limit: limit, sort: { createdAt: -1 } },
        function() { instance.state.set('limit', limit) });
    } else {
      instance.subscribe('myPostsList', { limit: limit, sort: { createdAt: -1 } },
        function() { instance.state.set('limit', limit) });
    }
  });

  instance.drafts = function() {
    return PostDrafts.find({}, {
      limit: instance.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };
  instance.posts = function() {
    return Posts.find({}, {
      limit: instance.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };
});

Template.myworksList.onDestroyed(function() {
  this.increment = null;
  this.loadDefault = null;
  this.modeDefault = null;
});

Template.myworksList.onRendered(function() {
});

Template.myworksList.helpers({
  myworksList: function() {
    var instance= Template.instance();
    if (instance.data.mode === instance.modeDefault) {
      return instance.drafts();
    }
    return instance.posts();
  },
  hasMore: function() {
    var instance= Template.instance();
    if (instance.data.mode === instance.modeDefault) {
      return (Counts.get('myDraftCount') > instance.state.get('limit'));
    }
    return (Counts.get('myPostsListCount') > instance.state.get('limit'));
  },

  switchMode: function() {
    var instance= Template.instance();
    return instance.data.mode === instance.modeDefault;
  }
});

Template.myworksList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.state.set('limit', instance.state.get('limit') + instance.increment);
  }
});

Template.myworksDraft.events({
  'click #remove': function() {
    var self = this;
    Alerts.dialog('confirm', '정말 삭제하시겠습니까?', function(confirm){
      if(confirm){
        Meteor.call('postDraftRemove', self._id, function(error){
          if(!error){
            Alerts.notify('success','text_draft_removed');
          }
        })
      }
    })
  }
});

Template.myworksNav.onCreated(function() {
  var instance = this;
  var data;

  instance.autorun(function() {
    data = Template.parentData(1);
    instance.subscribe('myDraftCount', {});
    instance.subscribe('myPostsListCount', {});
  });

});

Template.myworksNav.helpers({
  mode: function(mode) {
    return Template.instance().data.mode === mode ? 'active' : '';
  }
});
