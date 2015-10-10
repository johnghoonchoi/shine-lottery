
PostValidator = {
  schema: {
    title: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },

    content: {
      type: 'object',
      required: true,
      object: {
        version: {
          type: 'string',
          required: true,
          values: ['0.0.1', '0.0.2']
        },
        type: {
          type: 'string',
          required: true,
          values: ['markdown', 'html']
        },
        data: {
          type: 'string',
          required: true,
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

    validator.validate(object, ['title', 'content']);

    return validator;
  },

  validateUpdate: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content']);

    return validator;
  },

  validatePublish: function() {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content', 'categoryId']);

    return validator;
  }
};


matchPostInsert = function(object) {
  var validation = PostValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchPostUpdate = function(object) {
  var validation = PostValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};

matchPostPublish = function() {
  var validation = PostValidator.validatePublish(object);
  return _.isEmpty(validation.errors());
};
