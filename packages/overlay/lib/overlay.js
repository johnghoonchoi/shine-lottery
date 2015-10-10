
var Overlays = new Mongo.Collection(null);
var ANIMATION_DURATION = 300;

Overlay = {
  collection: Overlays,

  insert: function(templateName, data) {
    var object = {
      templateName: templateName,
      data: data,
      createdAt: new Date()
    };

    object._id = this.collection.insert(object);
    return object._id;
  },

  remove: function(templateId) {
    this.collection.remove({ _id: templateId });
  },

  hooks: {
    insertElement: function(node, next) {
      var overlay = $(node).hasClass('overlay');

      // short-circuit and just do it right away
      if (! overlay)
        return $(node).insertBefore(next);


      $(node).insertBefore(next);

      var start = '100%';
      $(node).velocity({ left: 0}, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false
      });
    },

    removeElement: function(node) {
      var overlay = $(node).hasClass('overlay');

      if (! overlay)
        return $(node).remove();

      var end = '100%';
      $(node).velocity({ left: end }, {
        duration: ANIMATION_DURATION,
        complete: function() {
          $(node).remove();
          console.log('element remove done');
        }
      });
    }
  }
};

