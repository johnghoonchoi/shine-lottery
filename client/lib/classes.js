// Control Global Namespace
ShineClass = {};

class ThemeName {
  constructor(name) {
    this._name = new ReactiveVar(name)
  }
  get() {
    return this._name.get();
  }
  set() {
    this._name.set(name);
  }
}
_.extend(ShineClass, { ThemeName });


