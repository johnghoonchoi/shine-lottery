/**
 * PostDrafts
 *    _id
 *    categoryId          String
 *    title               String 1..100
 *    content
 *      version           "1.0"
 *      texts             Array of String
 *      images            { _id, url, surl }
 *      videos            { _id, url, surl }
 *
 *    author              { _id, username, name }
 *    createdAt           Date
 *    updatedAt           Date
 *
 */
PostDrafts = new Mongo.Collection('postDrafts');

Meteor.methods({
  postDraftInsert: function(object) {
    check(object, Match.Where(matchPostDraftInsert));

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var user = Meteor.user();

    // build insert object
    var author = {
      _id: user._id,
      username: user.username,
      name: user.name
    };

    var now = new Date();

    var draft = {
      categoryId: object.categoryId,
      title: object.title,
      content: object.content,
      author: author,
      createdAt: now,
      updatedAt: now
    };

    draft._id = PostDrafts.insert(draft);

    return draft._id;
  },

  postDraftUpdate: function(draftId, object) {
    check(draftId, String);
    check(object, Match.Where(matchPostDraftUpdate));

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var data = {
      title: object.title,
      content: object.content,
      updatedAt: new Date()
    };

    var updated = PostDrafts.update({ _id: draftId }, { $set: data });

    return updated;
  },

  postDraftRemove: function(draftId) {
    check(draftId, String);

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var removed = PostDrafts.remove({ _id: draftId, 'author._id': this.userId });

    return removed;
  }
});
