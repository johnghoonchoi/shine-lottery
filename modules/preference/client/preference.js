Template.preference.helpers({
  themes: function() {
    return Themes;
  }
});

Template.preference.events({
  'change input:radio[name=theme]': function(e) {
    e.preventDefault();

    var themeName = $(e.target).val();

    // Todo 추후 테마적용 보완
    //saveTheme(themeName);
  }
});

Template.themeListItem.helpers({
  isChecked: function() {
    return (this._id === loadTheme());
  }
});
