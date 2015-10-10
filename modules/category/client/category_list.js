Template.categoriesList.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('releasedCategoriesList');
  });

  instance.categoriesCount = function() {
    return Counts.get('categoriesListCount');
  };

  instance.categories = function() {
    return Categories.find({ state: 'ON' }, { sort: { seq: 1 }});
  };
});

Template.categoriesList.helpers({
  categoriesCount: function() {
    return Template.instance().categoriesCount();
  },

  categories: function() {
    return Template.instance().categories();
  }
});

Template.categoriesListItem.helpers({
  active: function() {
    return (Navigations.check('category:' + this._id)) ? "active" : "";
  }
});
