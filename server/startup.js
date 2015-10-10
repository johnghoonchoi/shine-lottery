/**
 * Server startup
 */
Meteor.startup(function() {

  Connection.collection.remove({});

  // setting external cloud image upload service, Cloudinary, for local test
  // if these keys is for production, you have to set such keys via admin panel.
  const cloudinary = Systems.findOne({ _id: 'cloudinary' });
  if (cloudinary) CloudinaryServer.init(cloudinary);

  const mode = "production";

  if (mode === "development") {
    if (! cloudinary) {
      Systems.insert({
        _id: 'cloudinary',
        cloudName: Meteor.settings.public.cloudinary.cloudName,
        apiKey: Meteor.settings.public.cloudinary.apiKey,
        apiSecret: Meteor.settings.cloudinary.apiSecret,
        createdAt: new Date()
      });
    }

    // setting external login services keys for local login test
    // if these keys is for production, you have to set such keys via admin panel.
    if (! Systems.findOne({ _id: 'facebookLoginLocal' })) {
      Systems.insert({
        _id: 'facebookLoginLocal',
        appId: Meteor.settings.public.facebook.appId,
        secret: Meteor.settings.facebook.secret,
        createdAt: new Date()
      });
    }

    if (! Systems.findOne({ _id: 'twitterLoginLocal' })) {
      Systems.insert({
        _id: 'twitterLoginLocal',
        consumerKey: Meteor.settings.public.twitter.consumerKey,
        secret: Meteor.settings.twitter.secret,
        createdAt: new Date()
      });
    }

    if (! Systems.findOne({ _id: 'githubLoginLocal' })) {
      Systems.insert({
        _id: 'githubLoginLocal',
        clientId: Meteor.settings.public.github.clientId,
        secret: Meteor.settings.github.secret,
        createdAt: new Date()
      });
    }

    if (! Systems.findOne({ _id: 'meetupLoginLocal' })) {
      Systems.insert({
        _id: 'meetupLoginLocal',
        clientId: Meteor.settings.public.meetup.clientId,
        secret: Meteor.settings.meetup.secret,
        createdAt: new Date()
      });
    }

    if (! Systems.findOne({ _id: 'googleLoginLocal' })) {
      Systems.insert({
        _id: 'googleLoginLocal',
        clientId: Meteor.settings.public.google.clientId,
        secret: Meteor.settings.google.secret,
        createdAt: new Date()
      });
    }

    if (! Systems.findOne({ _id: 'meteorLoginLocal' })) {
      Systems.insert({
        _id: 'meteorLoginLocal',
        clientId: Meteor.settings.public.meteor.clientId,
        secret: Meteor.settings.meteor.secret,
        createdAt: new Date()
      });
    }

    if (! Systems.findOne({ _id: 'naverLoginLocal' })) {
      Systems.insert({
        _id: 'naverLoginLocal',
        clientId: Meteor.settings.public.naver.clientId,
        secret: Meteor.settings.naver.secret,
        createdAt: new Date()
      });
    }


    if (! Systems.findOne({ _id: 'kakaoLoginLocal' })) {
      Systems.insert({
        _id: 'kakaoLoginLocal',
        clientId: Meteor.settings.public.kakao.clientId,
        createdAt: new Date()
      });
    }
  }

  if (Meteor.users.find().count() === 0) {
    const users = [
      {
        username: 'admin',
        email: 'leesn@bookp.al',
        password: '74123',
        roles: [ 'ROLE_ADMIN' ]
      },

      {
        username: 'test',
        email: 'test@bookp.al',
        password: '74123'
      }
    ];

    users.forEach(function(user) {
      user._id = Accounts.createUser({
        username: user.username,
        email: user.email,
        password: user.password
      });

      if (user.roles && user.roles.length > 0) {
        Roles.addUsersToRoles(user._id, user.roles);
      }
    });
  }

  if (Categories.find().count() === 0) {
    const now = new Date();
    const categories = [
      {
        _id: 'news',
        title: 'News & Information',
        seq: 1,
        state: 'ON',
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'lectures',
        title: 'Lectures',
        seq: 2,
        state: 'ON',
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'techtips',
        title: 'Tech-tips',
        seq: 3,
        state: 'ON',
        createdAt: now,
        updatedAt: now
      }
    ];

    categories.forEach(function(category) {
      Categories.insert(category);
    });
  }
});
