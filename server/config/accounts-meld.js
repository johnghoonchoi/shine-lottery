var meldUserCallback = function(srcUser, dstUser){
  // create a melded user object here and return it
  var meldedUser = _.clone(dstUser);

  // 'createdAt' field: keep the oldest between the two
  if (srcUser.createdAt < dstUser.createdAt)
    meldedUser.createdAt = srcUser.createdAt;

  if (!dstUser.username && srcUser.username)
    meldedUser.username = srcUser.username;

  dstUser.profile = dstUser.profile || {};
  meldedUser.profile = _.extend(dstUser.profile, srcUser.profile || {});
  dstUser.oauths = dstUser.oauths || {};
  meldedUser.oauths = _.extend(dstUser.oauths, srcUser.oauths || {});

  return meldedUser;
};

var meldDBCallback = function(src_user_id, dst_user_id){
  // Here you can modify every collection you need for the document referencing
  // to src_user_id to be modified in order to point to dst_user_id

  // Todo : refactoring here
  Posts.update(
    {'author._id': src_user_id},
    {$set: {'author._id': dst_user_id}},
    {multi: true}
  );
  PostComments.update(
    {'user._id': src_user_id},
    {$set: {'user._id': dst_user_id}},
    {multi: true}
  );
};


var serviceAddedCallback = function(userId, serviceName, serviceData, options){
  var name, picture;
  var set = {};

  var user = Meteor.users.find(userId);

  if (user) {
    if (serviceName === 'facebook') {
      picture = "http://graph.facebook.com/"+ serviceData.id +"/picture?type=square&height=160&width=160";
    }
    if (serviceName === 'google')
      picture = serviceData.picture;

    if (serviceName === 'twitter')
      picture = serviceData.profile_image_url_https;

    if (serviceName === 'meetup') {
      var meetup = Systems.findOne({_id: 'meetupLogin'});

      var userMeetupId = serviceData.id;
      var apiKey = meetup.apiKey;
      var requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId
        + '?key=' + apiKey + '&signed=true&fields=email';
      var response = HTTP.get(requestUrl, {
        params: {
          format: 'json'
        }
      });

      var userData = response.data;

      set["services." + serviceName] = _.extend(serviceData, userData);

      if (userData.photo && userData.photo.photo_link)
        picture = userData.photo.photo_link;
    }

    if (serviceName === 'naver' || serviceName === 'kakao') {
      picture = options.profile.profile_image;
      set["services." + serviceName] = _.extend(serviceData, options.profile);
    }

    name = options.profile.name;

    if (name) set["oauths." + serviceName + ".name"] = name;
    if (picture) {
      set["oauths." + serviceName + ".picture"] = picture;
      set["profile.avatar"] = picture;
    }

    Meteor.users.update(userId, {$set: set});

    console.log('External service just added for user');
  }
};

AccountsMeld.configure({
  askBeforeMeld: true,
  meldUserCallback: meldUserCallback,
  meldDBCallback: meldDBCallback,
  serviceAddedCallback: serviceAddedCallback
});
