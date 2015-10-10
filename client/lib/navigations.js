
Navigations = {
  path: new ReactiveVar(),

  check: function(pos) {
    let path = this.path.get();
    if (! path) return false;

    if (typeof path === 'string') {
      return pos === path;
    } else {
      for (let i = 0; i < path.length; i++) {
        if (path[i] === pos) {
          return true;
        }
      }
      return false;
    }
  }
};

