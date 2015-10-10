/**
 * Autosave
 *    set()               set the job doing a callback function periodically
 *
 *    clear()             release the job
 */

Autosave = function() {
  this.timer = null;

  // trigger autosave operation
  this.set = function(callbackSave, interval) {
    interval = interval || 5000;

    this.timer = Meteor.setTimeout(function() {
      callbackSave();
    }, interval);
    //return this.timer;
  };

  // release autosave operation
  this.clear = function() {
    if (this.timer) {
      Meteor.clearTimeout(this.timer);
      this.timer = null;
    }
  };

  return this;
};
