const passport = require('passport');
const User = require('../models/Users');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const prod = process.env.EC2_PRODUCTION_URL;
module.exports = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (user, done) {
    // done(null, user);

    User.findById(user.id).then(user => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URIS,
        passReqToCallback: true,
      },

      function (request, accessToken, refreshToken, profile, done) {
        // console.log('profile.json : ', profile);
        // console.log('accessToken : ', accessToken);
        process.nextTick(() => {
          const { sub, name, email } = profile._json;

          User.findOne({ email }).then(user => {
            // user.incrementActivated();
            if (user) {
              user.googleId = sub;
              user.isCertified = true;
              // console.log('이미 있는 아이디 : ', user);
              return done(null, user);
            } else {
              //구글 로그인은 자동인증
              const user = new User({
                email,
                password: Math.random().toString(36).slice(2),
                name,
                googleId: sub,
                isCertified: true,
              });
              // console.log('새로 가입 : ', user);
              user.save().then(user => {
                // console.log('user : ', user);
                return done(null, user);
              });
            }
          });
        });
      },
    ),
  );

  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_REDIRECT_URIS,
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          // const user = {
          //     id: profile.id,
          //     name: profile.displayName,
          //     email: profile.emails[0].value,
          //     username: profile.displayName,
          //     provider: 'naver',
          //     naver: profile._json,
          // };

          const { id, name, email } = profile._json;

          User.findOne({ email }).then(user => {
            // user.incrementActivated();

            if (user) {
              user.naverId = id;
              user.isCertified = true;

              return done(null, user);
            } else {
              //구글 로그인은 자동인증
              const user = new User({
                email,
                password: Math.random().toString(36).slice(2), // 구글로그인 할때 패스워드는 어떻게 해야하나?
                name,
                naverId: id,
                isCertified: true,
              });
              // console.log('새로 가입 : ', user);
              user.save().then(user => {
                // console.log('user : ', user);
                return done(null, user);
              });
            }
          });

          // console.log('user=', user);
          // console.log(user);
          // return done(null, user);
        });
      },
    ),
  );
};
