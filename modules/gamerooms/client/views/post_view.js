
Template.postView.onCreated(function() {
  let data = Template.currentData();

  this.isEditable = new ReactiveVar(false);

  this.autoSave = new Autosave();

  this.viewReady = Meteor.subscribe('releasedPostView', data.postId);

  this.autorun(() => {
    let post = Posts.findOne(data.postId);

    if (post) {
      let access = false;

      try {
        access = postAccess('update', Meteor.user(), data.postId)
      } catch (ex) {

      }

      this.isEditable.set(access);
    }
  });

  this.post = () => Posts.findOne(data.postId);

  this.category = () => {
    let post = this.post();
    return (post) ? Categories.findOne(post.categoryId) : null;
  };

  this.like = () => PostLikes.findOne({ postId: data.postId });
});

Template.postView.onDestroyed(function() {
  this.autoSave.clear();
  this.autoSave = null;
  this.post = null;
  this.category = null;
  this.like = null;
});

Template.postView.helpers({
  category() {
    return Template.instance().category()
  },
  post() {
    if (Template.instance().viewReady.ready()) {
      return Template.instance().post()
    }
  },
  like() {
    return Template.instance().like()
  },
  isEditable() {
    return Template.instance().isEditable.get()
  }
});


Template.postView.events({
  'click #back'() {
    history.back(-1);
  },

  'click #remove'(e) {
    e.preventDefault();

    Alerts.dialog('confirm', '정말 삭제하시겠습니까?', (confirm) => {
      if (confirm) {
        Meteor.call('postRemove', this.postId, function(error) {
          if (error) {
            Alerts.notify('error', error.message);
          } else {
            Alerts.notify('success', 'post_remove_success');
            history.go(-1);
          }
        });
      }
    });
  },

  'click #like'(e) {
    e.preventDefault();

    Meteor.call('postLikeInsert', this.postId, (error) => {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  },

  'click #unlike'(e) {
    e.preventDefault();

    Meteor.call('postLikeRemove', this.postId, (error) => {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  }
});
