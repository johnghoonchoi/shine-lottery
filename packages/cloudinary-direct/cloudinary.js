const buttonDeps = new Tracker.Dependency;

const selectors = {
  uploader: '.cloudinary-uploader',
  button: '.cloudinary-uploader .btn',
  inputFile: 'input.cloudinary-fileupload',
  progressWindow: '.cloudinary-progress',
  progressBar: '.cloudinary-progress .progress-bar'
};

/**
 *
 * @type {{_buttonHTML: string, getButtonHTML: Function, setButtonHTML: Function, setEventHandler: Function, uploadImage: Function, uploadVideo: Function, uploadFile: Function}}
 */
Cloudinary = {
  _buttonHTML: '<span>upload...</span>',

  getButtonHTML: function() {
    buttonDeps.depend();
    return this._buttonHTML;
  },

  setButtonHTML: function(html) {
    this._buttonHTML = html;
    buttonDeps.changed();
  },

  setEventHandler: function(selector, showProgress, callback) {
    $(selector).on('cloudinarystart', function() {
      if (showProgress) {
        $(selectors.progressWindow).show();
      }
    }).on('cloudinarydone', function(e, data) {
      if (showProgress) {
        $(selectors.progressWindow).hide();
      }
      if (typeof callback === 'function') {
        callback(e, data);
      }
    }).on('cloudinaryprogress', function(e, data) {
      if (showProgress) {
        $(selectors.progressBar).css('width',
          Math.round((data.loaded * 100.0) / data.total) + '%');
      }
    });
  },

  /**
   * upload image to the repository of Cloudinary.com
   *
   * @param options
   *    config: cloud_name & api_key
   *    buttonHTML: button HMTL code
   *    showProgress: if true, show upload progress bar
   *    addons: additional options for uploading
   *
   * @param callback: callback function to process the result
   *    callback parameters
   *      error: returned error when upload fails
   *      data: result value when upload succeeds
   */
  uploadImage: function(options, callback) {
    if (options.ui && options.ui.buttonHTML) {
      this.setButtonHTML(options.ui.buttonHTML);
    }

    Meteor.call('cloudinaryUploadTag',
      'image_id',
      options.options,
      (error, response) => {
        $(selectors.inputFile).remove();
        $(selectors.button).append(response);

        $.cloudinary.config(options.config);
        $(selectors.inputFile).cloudinary_fileupload();

        var showProgress = (options.ui && options.ui.showProgress) ?
          options.ui.showProgress : true;
        this.setEventHandler(selectors.inputFile, showProgress, callback);
      }
    );
  },

  uploadVideo: function(options, callback) {
    callback();
  },

  uploadFile: function(options, callback) {
    callback();
  }
};

Template.cloudinaryUploader.helpers({
  buttonHTML: function() {
    return Cloudinary.getButtonHTML();
  }
});
