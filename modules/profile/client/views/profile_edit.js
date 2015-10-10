Template.profileEditForm.events({
  'submit #formProfileEdit'(e, instance) {
    e.preventDefault();

    const object = {
      email: instance.$('#email').val().trim()
    };

    const validation = AccountValidator.validateUpdate(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'validation_errors');
      return;
    }

    Meteor.call('profileUpdate', object, (error) => {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'profile_update_success');
      }
    });
  }
});
