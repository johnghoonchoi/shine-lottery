/**
 * Created by ProgrammingPearls on 15. 8. 20..
 */

ScrollToBottom = function (selector) {
  // scroll to bottom of element
  //var element = $(selector)[0];
  //element.scrollTop(element.scrollHeight);
  $(selector).scrollTop($(selector)[0].scrollHeight);
};
