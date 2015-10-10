Template.categoryView.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = DEFAULT_LIST_INCREMENT;
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

    instance.subscribe('releasedCategoryView',
      data.categoryId, { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); }
    );

    instance.subscribe('releasedPostsListCount',
      { categoryId: data.categoryId });

    Navigations.path.set('category:' + data.categoryId);
  });

  instance.category = function() {
    return Categories.findOne({ _id: data.categoryId, state: 'ON' });
  };

  instance.postsCount = function() {
    return Counts.get('releasedPostsListCount');
  };

  instance.posts = function() {
    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    return Posts.find({ categoryId: data.categoryId },
      { limit: limit, sort: sort });
  };

});


Template.categoryView.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.category = null;
  this.postsCount = null;
  this.posts = null;
});


Template.categoryView.helpers({
  noPosts: function() {
    return Template.instance().postsCount() === 0;
  },

  category: function() {
    return Template.instance().category();
  },

  postsCount: function() {
    return Template.instance().postsCount();
  },

  posts: function() {
    return Template.instance().posts();
  },

  postWithUser: function() {
    var post = this;
    var author = Meteor.users.findOne(post.author._id);
    return _.extend(post, { author: author });
  },

  hasMore: function() {
    var instance = Template.instance();
    return (instance.postsCount() > instance.loaded.get());
  },

  permissionRead: function() {
    return categoryPermitted(Template.instance().category(),
      Meteor.user(), 'read');
  },

  permissionWrite: function() {
    return categoryPermitted(Template.instance().category(),
      Meteor.user(), 'write');
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

Template.categoryView.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});

Template.postsListItem.helpers({
  postContent: function() {
    var html = marked(this.content.data);
    return html.replace(/<(?:.|\n)*?>/gm, '');
  }
});
