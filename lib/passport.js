const passport = require('passport');
const User = require('../models/Users');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

const googleCredentials = require('../config/google.json');
const naverCredentials = require('../config/naver.json');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (user, done) {
    // done(null, user);

    User.findById(user.id).then(user => {
        done(null, user);
    });
});
// const id = process.env.GOOGLE_ID;

passport.use(
    new GoogleStrategy(
        {
            clientID: googleCredentials.web.client_id,
            clientSecret: googleCredentials.web.client_secret,
            callbackURL: googleCredentials.web.redirect_uris,
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            // console.log('profile.json : ', profile);
            // console.log('accessToken : ', accessToken);
            const { sub, name, email } = await profile?._json;

            User.findOne({ email }).then(user => {
                if (user) {
                    user.googleId = sub;
                    // console.log('이미 있는 아이디 : ', user);
                    return done(null, user);
                } else {
                    //구글 로그인은 자동인증
                    const user = new User({
                        email,
                        password: 'passss', // 구글로그인 할때 패스워드는 어떻게 해야하나?
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
        },
    ),
);

passport.use(
    new NaverStrategy(
        {
            clientID: naverCredentials.web.naver_client_id,
            clientSecret: naverCredentials.web.naver_client_secret,
            callbackURL: naverCredentials.web.naver_redirect_uris,
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                // console.log(profile);
                // const user = {
                //     id: profile.id,
                //     name: profile.displayName,
                //     email: profile.emails[0].value,
                //     username: profile.displayName,
                //     provider: 'naver',
                //     naver: profile._json,
                // };

                const { id, name, email } = profile._json;

                User.findOne({ email: email }).then(user => {
                    console.log('asdfasdfasdf TEst', user);
                    if (user) {
                        user.naverId = id;
                        return done(null, user);
                    } else {
                        //구글 로그인은 자동인증
                        const user = new User({
                            email,
                            password: 'nanapassss', // 구글로그인 할때 패스워드는 어떻게 해야하나?
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

module.exports = passport;
