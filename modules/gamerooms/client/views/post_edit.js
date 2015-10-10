'use strict';

Template.postEdit.onCreated(function() {
  const instance = this;
  const data = Template.currentData();

  instance.autoSave = new Autosave();

  instance.autorun(() => {
    Meteor.subscribe('releasedPostView', data.postId);
  });

  // lazy update
  instance.autorun(function() {
    const post = Posts.findOne(data.postId);
    if (post && ! postAccess('update', Meteor.user(), data.postId)) {
      Alerts.notify('error', 'error_access_denied');
    }
  });

  instance.post = function() {
    return Posts.findOne({ _id: data.postId, state: 'PUBLISHED' });
  };

  instance.category = function(categoryId) {
    return Categories.findOne({ _id: categoryId });
  };
});

Template.postEdit.onDestroyed(function() {
  this.autoSave.clear();
  this.autoSave = null;
  this.post = null;
  this.category = null;
});

Template.postEdit.helpers({
  category: function() {
    const post = Template.instance().post();
    return (post) ? Template.instance().category(post.categoryId) : null;
  },

  title: function() {
    const post = Template.instance().post();
    return (post) ? post.title : '';
  },

  content: function() {
    const post = Template.instance().post();
    return (post && post.content) ? post.content.data : '';
  }
});

Template.postEdit.events({
  'input [name=content]': function(e, instance) {

    instance.autoSave.clear();
    instance.autoSave.set(function() {
      const object = {
        title: instance.$('[name=title]').val().trim(),
        content: {
          version: '0.0.1',
          type: 'markdown',
          data: instance.$('[name=content]').val()
        }
      };

      const validation = PostValidator.validateUpdate(object);
      if (validation.hasError()) {
        Alerts.notify('error', 'error_post_validation_errors');
        return;
      }

      Meteor.call('postSaveDraft', instance.data.postId, object, (error) => {
        if (error) {
          Alerts.notify('error', error.message);
        } else {
          Alerts.notify('success', 'text_post_draft_success');
        }
      });
    });

  },

  'submit #formPostEdit': function(e, instance) {
    e.preventDefault();

    instance.autoSave.clear();

    const object = {
      title: instance.$('[name=title]').val().trim(),
      content: {
        version: '0.0.1',
        type: 'markdown',
        data: instance.$('[name=content]').val()
      }
    };

    const validation = PostValidator.validateUpdate(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'validation_errors');
      return;
    }

    Meteor.call('postUpdate', this.postId, object, (error) => {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_post_update_success');

        Router.go('postView', { _id: this.postId });
      }
    });
  }
});
