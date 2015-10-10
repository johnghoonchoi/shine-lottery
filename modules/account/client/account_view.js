
Template.accountView.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = 20;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);
  instance.sortBy = function(value) {
    if (value === 'like') {
      return { 'count.likes': -1 };
    } else {
      return { publishedAt: -1 };
    }
  };


  instance.autorun(function() {
    data = Template.currentData();
    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    instance.subscribe('userPostsList', { _id: data._id },
      { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); }
    );

    instance.subscribe('userPostsListCount', { _id: data._id });

    instance.subscribe('accountData', { _id: data._id });

    Navigations.path.set('users');
  });

  instance.user = function() {
    return Meteor.users.findOne({ _id: data._id });
  };

  instance.postsCount = function() {
    return Counts.get('userPostsListCount');
  };

  instance.posts = function() {
    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    return Posts.find({ 'author._id': data._id, state: 'PUBLISHED' },
      { limit: limit, sort: sort });
  };
});

Template.accountView.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.user = null;
  this.postsCount = null;
  this.posts = null;
});

Template.accountView.onRendered(function(){

});


Template.accountView.helpers({
  noPosts: function() {
    return Template.instance().postsCount() === 0;
  },

  user: function() {
    return Template.instance().user();
  },

  displayName: function() {
    var user = Template.instance().user();
    if (!user) return '';

    if (user.username)
      return user.username;
    if (user.profile && user.profile.name)
      return user.profile.name;
    if (user.emails && user.emails[0] && user.emails[0].address)
      return user.emails[0].address;

    return '';
  },

  postsCount: function() {
    return Template.instance().postsCount();
  },

  posts: function() {
    return Template.instance().posts();
  }

});

Template.accountView.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});
