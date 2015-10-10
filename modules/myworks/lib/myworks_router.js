
Router.route('/myworks/:mode', {
    name: 'myworks',
    data: function() {
      return {
        mode: this.params.mode
      };
    }
});

