/**
 * implement overlay feature
 */

var ANIMATION_DURATION = 300;

PageOverlay = {
  show: function(templateName, data, parentNode) {
//    parentNode = parentNode || document.body;
    parentNode = document.body;

    this.view = Blaze.renderWithData(Template.pageOverlay, {
      templateName: templateName,
      data: data
    }, parentNode);

    this.template = templateName;
  },

  hide: function() {
    var self = this;

    if (self.view) {
      Blaze.remove(self.view);
      self.view = null;
    }
  },

  bindHook: function(instance) {
    instance.$('.page-overlay')._uihooks = {
      insertElement: function(node, next) {
        var start = '100%';

        $.Velocity.hook(node, 'translateX', start);
        $(node).insertBefore(next).velocity({ translateX: [ 0, start ]}, {
          duration: ANIMATION_DURATION,
          easing: 'ease-in-out',
          queue: false
        });
      },
      removeElement: function(node) {
        var end = '100%';

        $(node).velocity({ translateX: end }, {
          duration: ANIMATION_DURATION,
          easing: 'ease-in-out',
          queue: false,
          complete: function() {
            $(node).remove();
          }
        });
      }
    };
  }
};

