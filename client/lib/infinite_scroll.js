/**
 *
 */

//
var isBorderOfContent = function() {
  var elements = $('.load-more');
  if (elements && elements[0]) {
    var rect = elements[0].getBoundingClientRect();
    return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && //* or $(window).height()
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) //* or $(window).width()
    );
  }

  return false;
};

InfiniteScrollTrigger = {
  bind: function(callback, interval) {
    interval = interval || 50;
    return Meteor.setInterval(() => {
      if (isBorderOfContent()) callback();
    }, interval);
  },

  /**
   * scroll event를 unbind한다.
   *
   * @param handle setInterval 핸들
   */
  unbind: function(handle) {
    if (handle) Meteor.clearInterval(handle);
  }
};

