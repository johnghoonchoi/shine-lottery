
PostDraftValidator = {
  schema: {
    title: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },

    content: {
      type: 'object',
      required: false,
      object: {
        version: {
          type: 'string',
          required: false,
          values: ['0.0.1', '0.0.2']
        },
        type: {
          type: 'string',
          required: false,
          values: ['markdown', 'html']
        },
        data: {
          type: 'string',
          required: false,
          minLength: 1,
          maxLength: 65536
        }
      }
    },

    categoryId: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    }
  },

  validateInsert: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content', 'categoryId']);

    return validator;
  },

  validateUpdate: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content']);

    return validator;
  }
};


matchPostDraftInsert = function(object) {
  var validation = PostDraftValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchPostDraftUpdate = function(object) {
  var validation = PostDraftValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};

