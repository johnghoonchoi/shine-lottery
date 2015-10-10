'use strict';

Template.postTextarea.onCreated(function() {
//  this.subscribe('systemView', {});

  this.cloudinary = function () {
    return Systems.findOne({_id: 'cloudinary'});
  };
});

Template.postTextarea.onRendered(function() {
  var instance = this;

  instance.$("[data-provide=markdown]").markdown();
  instance.$("[data-provide=markdown]").tabOverride().flexText();

  instance.autorun(function() {
    if (Template.instance().subscriptionsReady()) {
      Cloudinary.uploadImage(
        {
          config: {
            cloud_name: instance.cloudinary().cloudName,
            api_key: instance.cloudinary().apiKey
          },
          options: { upload_preset: 'ps_posts' },
          ui: { buttonHTML: '<i class="fa fa-upload"></i>', showProgress: true }
        },
        function(e, data) {
          const object = {
            url: data.result.url,
            surl: data.result.secure_url,
            size: data.result.bytes,
            width: data.result.width,
            height: data.result.height,
            ext: data.result.format,
            mime: data.originalFiles[0].type,
            original: data.originalFiles[0].name,
            repoId: data.result.public_id
          };

          Meteor.call('postImageInsert', object, (error, imageId) => {
            if (error) {
              console.log('error reason: ', error.reason);
              return;
            }

            let $textareaBlock = $('[data-provide=markdown]');
            let textareaNode = $textareaBlock[0];
            let selectPosition = $textareaBlock.selection('getPos');
            let selectionStart = selectPosition.start;
            let selectionEnd = selectPosition.end;

            let source = '![alt](' + object.url + ' "image title")';

            $textareaBlock.selection('insert', { text: source });

            if (selectionStart === selectionEnd) {
              textareaNode.selectionStart = selectionStart + 2;
              textareaNode.selectionEnd   = selectionStart + 5;
            } else {
              textareaNode.selectionStart = selectionEnd + 2;
              textareaNode.selectionEnd   = selectionEnd + 5;
            }

            console.log(imageId);
          });
        }
      );
    }
  });
});

Template.postTextarea.events({
  'click [data-handler=bootstrap-markdown-cmdUpload]': function(e) {
    e.stopImmediatePropagation();
    $('input.cloudinary-fileupload').trigger('click');
    console.log('image upload click trigger..');
  },

  'click [data-handler=bootstrap-markdown-cmdPreview]': function(e) {
    e.stopImmediatePropagation();
    var $pre = $('.flex-text-wrap>pre');
    $pre.toggleClass('hidden');
  },

  'click .md-control-fullscreen': function(e) {
    e.stopImmediatePropagation();
    var wrapper = $('#wrapper');
    if (! wrapper.hasClass('aside-right-set'))
      wrapper.addClass('aside-left-set');
  }
});

