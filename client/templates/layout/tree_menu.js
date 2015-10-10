/**
 * controls menu navigation UI
 */

Template.treeMenu.helpers({
  active: function(path) {
    return (Navigations.check(path)) ? "active" : "";
  }
});

Template.treeMenu.events({
  'click .list-group-item': function(e) {
    //Navigations.set('home', 'root');
  },

  'click .menu-item-c': function(e) {
    e.preventDefault();

    var template = Template.instance();

    if ($(e.target).attr('data-toggle') === 'collapse') {
      template.$('.collapse.in').collapse('hide');
    } else {
      /*
      * Commented out because this does not work properly
      * when Router.something is called to change route
      */
      //template.$('.active').removeClass('active');
      //$(e.target).addClass('active');

      var url;
      if ($(e.target).hasClass('menu-item-main')) {
        template.$('.collapse.in').collapse('hide');
        url = $(e.target).attr('href');
      } else {
        $(e.target).parent().prev().addClass('active');
        url = $(e.target).attr('data-link');
      }

      if (url)
        Router.go(url);
    }
  },

  'click .close-menu': function () {
    // When Click blog-items on 'aside-left'
    // Hides aside in Mobile view ( < 750px )
    if( $('#container').hasClass('mobile') ) {
      $('#container').removeClass('aside-left-set');
    }
  }
});
