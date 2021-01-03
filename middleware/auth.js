const User = require('../models/Users');
const auth = (req, res, next) => {
  const token = req.cookies.x_auth;
  if (!token) {
    next();
  }

  User.findByToken(token, process.env.JWT_SECRET_KEY3)
    .then(user => {
      if (!user) {
        // console.log('auth : 로그인 안되어 있습니다!');
        return res.clearCookie('x_auth');
      }
      req.token = token;
      req.user = user;
      next();
    })
    .catch(err => {
      //   console.log('auth : 로그인 안되어 있습니다!');
      //   res.clearCookie('x_auth');
      throw new Error('please authenticate');
    });
};

module.exports = { auth };
// if (!token) {
//     next();
//   }
//   try {
//     User.findByToken(token, process.env.JWT_SECRET_KEY3).then(user => {
//       if (!user) {
//         console.log('auth : 로그인 안되어 있습니다!');
//         res.clearCookie('x_auth');
//       }
//       req.token = token;
//       req.user = user;
//       next();
//     });
//   } catch (e) {
//     // res.clearCookie('x_auth');
//     throw new Error('please authenticate');
//     // res.status(401).send({ error: 'please authenticate.' });
//   }
