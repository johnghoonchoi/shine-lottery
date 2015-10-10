'use strict';

Template.postWrite.onCreated(function() {
  const instance = this;
  const data = Template.currentData();

  instance.autoSave = new Autosave();
  instance.draftId = data.draftId;
  instance.postStatus = new ReactiveVar('Draft');

  instance.autorun(() => {
    if (instance.draftId) {
      instance.subscribe('postDraftEdit', instance.draftId);
    }
  });

  instance.draft = function() {
    return instance.draftId && PostDrafts.findOne({ _id: instance.draftId });
  };

  instance.category = function() {
    return Categories.findOne({ _id: data.categoryId, state: 'ON' });
  };
});

Template.postWrite.onDestroyed(function() {
  this.autoSave.clear();
  this.autoSave = null;
  this.draftId = null;
  this.draft = null;
  this.category = null;
});


Template.postWrite.helpers({
  postStatus: function() {
    return Template.instance().postStatus.get();
  },

  draft: function() {
    return Template.instance().draft();
  },

  titleAttrs: function() {
    return {
      'id': 'title',
      'class': 'title-editable',
      'name': 'title',
      'placeholder': '제목',
      'maxlength': 30
    };
  },

  category: function() {
    return Template.instance().category();
  }
});


Template.postWrite.events({
  'input [name=content]': function(e, instance) {
    e.preventDefault();

    const categoryId = Template.currentData().categoryId;

    instance.autoSave.clear();
    instance.autoSave.set(function() {
      const object = {
        categoryId,
        title: instance.$('[name=title]').val().trim(),
        content: {
          version: '0.0.1',
          type: 'markdown',
          data: instance.$('[name=content]').val()
        }
      };

      if (instance.draftId && _.isEmpty(object.content.data)) {
        Meteor.call('postDraftRemove', instance.draftId, (error) => {
          if (error) {
            Alerts.notify('error', error.reason);
          } else {
            instance.draftId = null;
          }
        });

        return;
      }

      var validation = PostDraftValidator.validateInsert(object);
      if (validation.hasError()) {
        Alerts.notify('error', 'text_draft_validation_error');
        return;
      }

      if (instance.draftId) {
        Meteor.call('postDraftUpdate', instance.draftId, object, (error) => {
          if (error) {
            Alerts.notify('error', error.reason);
          } else {
            instance.postStatus.set('Saved');
            Meteor.setTimeout(() => { instance.postStatus.set('Draft'); }, 3000);
          }
        });

      } else {
        Meteor.call('postDraftInsert', object, (error, id) => {
          if (error) {
            Alerts.notify('error', error.reason);
          } else {
            instance.draftId = id;
            instance.postStatus.set('Saved');
            Meteor.setTimeout(() => { instance.postStatus.set('Draft'); }, 3000);
          }
        });
      }
    }, 3000);
  },


  'submit #formPostWrite': function(e, instance) {
    e.preventDefault();

    instance.autoSave.clear();

    const categoryId = Template.currentData().categoryId;

    var object = {
      categoryId,
      title: instance.$('[name=title]').val().trim(),
      content: {
        version: '0.0.1',
        type: 'markdown',
        data: instance.$('[name=content]').val()
      }
    };

    var validation = PostValidator.validateInsert(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'error_validation_errors');
      return;
    }

    Meteor.call('postInsert', object, (error, result) => {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        if (instance.draftId) {
          Meteor.call('postDraftRemove', instance.draftId);
        }

        Alerts.notify('success', 'text_post_insert_success');
        Router.go('postView', { _id: result });
      }
    });
  }
});
