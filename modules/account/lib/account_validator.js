/**
 * validate user account
 *
 * Password can NOT be tested at the server side,
 * since it be sent with encrypted format.
 *
 */

var checkUsername = function(value) {
  var regex = /^[a-z0-9]+$/i;
  if (! regex.test(value)) {
    throw new Meteor.Error(ERROR_CODE_MATCH, 'error_invalid_type');
  }
};

var checkPassword = function(value) {
  var regex = /^[A-Za-z0-9!@#$%^&*()_]+$/;
  if (! regex.test(value)) {
    throw new Meteor.Error(ERROR_CODE_MATCH, 'error_invalid_type');
  }
};

var checkEmail = function(value) {
  var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  if (! regex.test(value)) {
    throw new Meteor.Error(ERROR_CODE_MATCH, 'error_invalid_type');
  }
};

AccountValidator = {
  schema: {
    username: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 18,
      custom: checkUsername
    },

    email: {
      type: 'string',
      required: true,
      custom: checkEmail
    }
  },

  validateInsert: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['username', 'email']);

    return validator;
  },

  validateUpdate: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['email']);

    return validator;
  }
};

matchAccountUpdate = function(object) {
  var validation = AccountValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};

