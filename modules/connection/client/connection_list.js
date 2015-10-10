Template.connectionsList.onCreated(function() {
  var instance = this;

  instance.increment = 30;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.template = null;

  instance.autorun(function() {
    var limit = instance.limit.get();
    var options = {
      limit: limit,
      sort: { createdAt: -1 }
    };

    instance.subscribe('connectionsSignInList', options, function() {
      instance.loaded.set(limit);
    });
  });


  instance.connectionsCount = function() {
    return Counts.get('connectionsSignInListCount');
  };

  instance.connections = function() {
    return Connection.collection.find(
      { user: { $exists: true }, 'user._id': { $ne: Meteor.userId() }},
      { limit: instance.loaded.get(), sort: { createdAt: -1 }}
    );
  };
});

Template.connectionsList.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.connections = null;
});

Template.connectionsList.helpers({
  connectionsCount: function() {
    return Template.instance().connectionsCount();
  },

  connections: function() {
    return Template.instance().connections();
  }
});

Template.connectionsList.events({
  'click header': function(e, instance) {
    e.preventDefault();
    e.stopPropagation();

    instance.$('.connections-frame').toggleClass('minimized');
  }
});

Template.connectionsListItem.helpers({
  toUser: function () {
    return Meteor.users.findOne({_id: this.user._id});
  }
});

Template.connectionsListItem.events({
  'click a' : function (e) {
    e.preventDefault();
    var userId = this.user._id;

    //
    // singleton instance

    // template is exist and equal user
    if (chatSingleton.template && userId !== chatSingleton.userId) {
      Blaze.remove(chatSingleton.template);
    }

    // template is not exist or not equal user
    if (!chatSingleton.template || userId !== chatSingleton.userId) {
      chatSingleton.userId = this.user._id;
      chatSingleton.template = Blaze.renderWithData(Template.chatFrame, this, document.body);
    }

  }
});
