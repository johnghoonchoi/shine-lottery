var ANIMATION_DURATION = 300;

Template.overlays.onRendered(function() {
  /*
  this.find('.overlay-container')._uihooks = {
    insertElement: function(node, next) {
      var overlay = $(node).hasClass('overlay');

      // short-circuit and just do it right away
      if (! overlay)
        return $(node).insertBefore(next);

      $(node).insertBefore(next);

      $(node).removeClass('off');
      $(node).addClass('on');
      console.log('insert element done');

/*
      var start = (overlay) ? '100%' : '-200%';

      $.Velocity.hook(node, 'translateX', start);
      $(node)
        .insertBefore(next)
        .velocity({translateX: [0, start]}, {
          duration: ANIMATION_DURATION,
          easing: 'ease-in-out',
          queue: false
        });
*//*
    },

    removeElement: function(node) {
      var overlay = $(node).hasClass('overlay');

      if (! overlay)
        return $(node).remove();

      var end = (overlay) ? '100%' : '-200%';

      $(node).removeClass('on');
      $(node).addClass('off');
      Meteor.setTimeout(function() {
        $(node).remove();

        if (Overlay.collection.find({}).count() === 0) {
          Overlay.hide();
        }
      }, 1000);
      */
/*
      $(node).fadeOut(function() {
        $(node).remove();
        if (Overlay.collection.find({}).count() === 0) {
          Overlay.hide();
        }
      });


      $(node).animate({ translateX: end } , {
        duration: ANIMATION_DURATION,
        complete: function() {
          Meteor.setTimeout(function() {
            $(node).remove();
            console.log('element remove done');

            if (Overlay.collection.find({}).count() === 0) {
              Overlay.hide();
            }
          }, 2000);
        }
      });
/*
      $(node).velocity({ translateX: end }, {
        duration: ANIMATION_DURATION,
        complete: function() {
          $(node).remove();
          console.log('element remove done');

          if (Overlay.collection.find({}).count() === 0) {
            Overlay.hide();
          }
        }
      });
/*
      $(node)
        .velocity({ translateX: end }, {

          duration: ANIMATION_DURATION,
          easing: 'ease-in-out',
          queue: false,
          complete: function() {
            console.log('element remove done');
            $(node).remove();

            if (Overlay.collection.find({}).count() === 0) {
              Overlay.hide();
            }

          }

        });
*//*
    }
  };*/
});

Template.overlays.helpers({
  overlaysList: function() {
    return Overlay.collection.find({}, { sort: { createdAt: -1 }});
  }
});

Template.overlaysListItem.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.templateName = data.templateName;
  instance.dataContext = data.data;

});

Template.overlaysListItem.helpers({
  overlayTemplate: function() {
    return Template.instance().templateName;
  },

  dataContext: function() {
    return Template.instance().dataContext;
  }
});

Template.overlaysListItem.events({
  'click #overlay-close': function() {
    var last = Overlay.collection.findOne({}, { sort: { createdAt: -1}, limit: 1 });
    Overlay.remove(last._id);
  }
});
