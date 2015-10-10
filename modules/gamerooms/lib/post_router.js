
// Post View
Router.route('/post/:_id', {
  name: 'postView',
  data: function() {
    return {
      postId: this.params._id
    };
  }
});

// new Post
Router.route('/category/:categoryId/newPost/:draftId?', {
  name: 'postWrite',
  template: 'postWrite',
  data: function() {
    return {
      categoryId: this.params.categoryId,
      draftId: this.params.draftId
    };
  }
});

// Post Edit
Router.route('/post/:_id/edit', {
  name: 'postEdit',
  data: function () {
    return {
      postId: this.params._id
    };
  }
});
