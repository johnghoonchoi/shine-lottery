/**
 * Show validation errors
 *
 * @param errors
 */
showValidationErrors = function(e, errors) {
  const $target = $(e.target);
  $target.find('.has-error').removeClass('has-error');
  $target.find('.help-block').html('');

  _.each(errors, function(error) {
    let translated = "";
    _.each(error.messages, (message) => { translated += I18n.get(message); });

    let element = $target.find('[name=' + error.attribute + ']');
    element.parent().addClass('has-error');
    element.next().html(translated);
  });
};
