/**
 * set Page Title
 *
 * @param title
 */
pageTitle = function(title) {
  document.title = title;
}

Template.registerHelper('pageTitle', function(param) {
  if (typeof param === 'string') {
    pageTitle(param);
  } else if (typeof param === 'object') {
    pageTitle(I18n.get(param.hash.i18n));
  } else {
    pageTitle(JSON.stringify(param));
  }
});
