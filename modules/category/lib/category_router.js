
Router.route('/category/:_id', {
  name: 'categoryView',
  data: function() {
    return {
      categoryId: this.params._id,
      sortBy: (this.params.query) ? this.params.query.sortBy : ''
    };
  }
});
