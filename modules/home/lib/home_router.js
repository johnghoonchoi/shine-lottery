
Router.route('/home', {
  name: 'home',
  data: function() {
    return {
      sortBy: (this.params.query) ? this.params.query.sortBy : ''
    };
  }
});
