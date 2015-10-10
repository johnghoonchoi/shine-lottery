// var triggerHandle;

// Template.home.onRendered(function() {
//   triggerHandle = InfiniteScrollTrigger.bind(function() {
//     Router.go(Router.current().nextPath());
//   });
// });

// Template.home.onDestroyed(function() {
//   if (triggerHandle)
//     InfiniteScrollTrigger.unbind(triggerHandle);
// });

Template.home.onCreated(function() {
  Navigations.path.set('home');

  var instance = this;
  var data;

  instance.increment = DEFAULT_LIST_INCREMENT;
  instance.default = 0;

  instance.state = new ReactiveDict;
  instance.state.set('limit',  instance.increment);
  instance.state.set('loaded',  instance.default);

  instance.sortBy = function(value) {
    switch(value) {
      case 'like':
        return { 'count.likes': -1 };
        break;
      case 'hit':
        return { 'count.hits': -1 };
        break;
      case 'comment':
        return { 'count.comments': -1 };
        break;
      default:
        return { createdAt: -1 };
    }
  };

  // Control Subscriptions
  instance.autorun(function() {
    data = Template.currentData();

    var limit = instance.state.get('limit');
    var sort = instance.sortBy(data.sortBy);

    instance.subscribe('releasedPostsList',
      {}, { limit: limit, sort: sort},
      function() { instance.state.get('loaded'); }
    );
  });

  // Control Cursors
  instance.postsCount = function() {
    return Counts.get('releasedPostsListCount');
  };

  instance.posts = function() {
    return Posts.find({}, { limit: instance.state.get('loaded') });
  };

});

Template.home.helpers({
  noPosts: function() {
    return Counts.get('releasedPostsListCount') === 0;
  },

  posts: function() {
    return Template.instance().posts();
  },

  postWithCategory: function() {
    var post = this;
    var category = Categories.findOne({ _id: post.categoryId });
    if (category) {
      return _.extend(post, { category: category });
    }
  },

  hasMore: function() {
    return (Counts.get('releasedPostsListCount') > Template.instance().state.get('limit'));
  },

  isActive: function(type) {
    if (type === this.sortBy) {
      switch(type) {
        case 'like':
          return 'active';
          break;
        case 'hit':
          return 'active';
          break;
        case 'comment':
          return 'active';
          break;
        default:
          return "";
      }
    }
    return (! type && ! this.sortBy) ? "active" : "";
  }
});

Template.home.events({
  'click .load-more': function (e, instance) {
    e.preventDefault();
    instance.state.set('limit', instance.state.get('limit') + instance.increment);
  }
});

Template.homeListItem.helpers({
  postContent: function() {
    var html = marked(this.content.data);
    return html.replace(/<(?:.|\n)*?>/gm, '');
  },

  commentCount: function() {
    return (this.count && this.count.comment) ? this.count.comment : 0;
  },

  hitsCount: function() {
    return (this.count && this.count.hits) ? this.count.hits : 0;
  },

  likesCount: function() {
    return (this.count && this.count.likes) ? this.count.likes : 0;
  },

  ownPost: function() {
    return this.user._id === Meteor.userId();
  }
});

Template.homeListItem.events({
  'click .title-link': function(e, instance) {
    Yields.push({
      name: 'postView',
      postId: this._id
    });
  }
});

