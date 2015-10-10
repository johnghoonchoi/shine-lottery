Router.route('/user/:_id', {
  name: 'accountView',
  data: function() {
    return {
      _id: this.params._id,
      sortBy: (this.params.query) ? this.params.query.sortBy : ''
    };
  }
});
