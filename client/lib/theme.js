Theme = {
  _name: new ReactiveVar(SHINE_CONSTANTS.DEFAULT_THEME),

  get: function() {
    return this._name.get();
  },

  set: function(name) {
    this._name.set(name);
  }
};
