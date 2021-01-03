const User = require('../models/Users');
const macaddress = require('node-macaddress');
const sharp = require('sharp');
const { sendingMail } = require('../lib/nodemailer');
const prod_url = process.env.EC2_PRODUCTION_URL_HTTPS;

exports.register = async (req, res) => {
  const { name, email } = req.body;

  //   if (req.user) {
  //     return;
  //   }
  const bodys = Object.keys(req.body);
  //   const bodys = ['email', 'password', 'name'];
  const allowBodys = ['email', 'password', 'name'];

  const validate = bodys.every(function (body) {
    return allowBodys.includes(body);
  });
  console.log(validate);

  //   const validate = bodys.every(body => {
  //     console.log(body);
  //     allowBodys.includes(body);
  //   });
  if (!validate) {
    console.log('회원가입 필수 폼을 채우세요');
    return res.status(404).send();
  }
  //회원 가입시 인증 메일 발송
  //body parser필요 없으면 undefined 출력됨
  const user = new User(req.body);
  try {
    await user.save((err, doc) => {
      //save 되기전 패스워드 해싱이 이뤄진다
      if (err) {
        return res.json({ message: '중복된 아이디 입니다!', err });
      }
      //

      console.log('회원가입 인증메일 발송! : ', doc.email);

      const expiresTime = '1h';
      user
        .generateToken(process.env.JWT_SECRET_KEY3, expiresTime)
        .then(certifyToken => {
          const options = {
            from: `${process.env.MAILER_EMAIL_ID}`,
            to: `${email}`,
            subject: 'Test sending email',
            text: `
                        Sending Test Mail
                        
                        Your info :
                        Name : ${name}
                        Email : ${email}
                        Please click this link if you want to be certified. : ${prod_url}/users/certify/${certifyToken}`,
            // Please click this link if you want to be certified. : ${process.env.CLIENT_URL}/users/certify/${certifyToken}`,
          };
          sendingMail(options);
        });

      return res.status(200).json({
        message: 'success hashing password',
        data: doc,
      });
    });
    // res.json(savedUser);
    // res 2개 이상 뿌려줘서 오류 발생
  } catch (err) {
    console.log('회원가입 오류');
    return res.json({ message: 'err2' });
  }
};
exports.certifyUser = async (req, res) => {
  // console.log('회원 인증 접근');
  // 나중에 회원 인증되면 홈으로 리디렉션을 넣어주자
  const token = req.params.token;
  User.findByToken(token, process.env.JWT_SECRET_KEY3)
    .then(user => {
      if (!user) {
        // console.log('auth : 로그인 안되어 있습니다!');
        return res.status(404).send();
        // return res.clearCookie('x_auth');
      }
      // req.token = token;
      user.isCertified = true;
      user.save().then(() => {
        console.log(`회원님의 이메일이 인증 되었습니다! ${user.email}`);
      });
      return res.json({
        message: '회원님의 이메일이 인증 되었습니다! ',
        token: token,
      });
    })
    .catch(err => {
      //   console.log('auth : 로그인 안되어 있습니다!');
      //   res.clearCookie('x_auth');
      console.log('이메일 인증 오류');
      return res.json({ message: err });
    });
};
// exports.certifyUser = async (req, res) => {
//   console.log('회원 인증 접근');
//   const token = req.params.token;
//   try {
//     const updatedUser = await User.updateOne(
//       //회원 자기자신 수정하기
//       { token: token },
//       {
//         $set: {
//           isCertified: true,
//           // password: req.body.password,
//         },
//       },
//     );
//     console.log(`회원님의 이메일이 인증 되었습니다! ${updatedUser} : ${token}`);
//     return res.json({
//       message: '회원님의 이메일이 인증 되었습니다! ',
//       token: token,
//     });
//   } catch (err) {
//     console.log('이메일 인증 오류');
//     return res.json({ message: err });
//   }
// };
exports.getUsers = async (req, res) => {
  console.log('회원 전체검색 접근');
  try {
    const user = await User.find().populate('memos');
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
};
exports.getUserById = async (req, res) => {
  console.log('특정회원 검색 접근');
  try {
    const user = await User.findById(req.params.userId);
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log('해당 id를 가진 회원이 없습니다!');
    res.json({
      message: `해당 id : ${req.params.userId} 는 없는 회원입니다!`,
    });
  }
};
exports.me = (req, res) => {
  if (!req.user) {
    return res.json({ message: '유저가 없음' });
  }
  const user = req.user;

  return res.json(user);
};
exports.deleteUser = async (req, res) => {
  if (!req.user) {
    return;
  }
  if (req.user.isAdmin) {
    try {
      const removedUser = await User.deleteOne({
        _id: req.params.userId,
      });
      console.log(`Admin이 아이디를 삭제 하였습니다! ${req.params.userId}`);
      return res.json({
        message: '아이디가 삭제 되었습니다!',
        data: removedUser,
      });
    } catch (err) {
      return res.json({ message: err });
    }
  }
  //미들웨어 auth에서 유저 id를 받아야 삭제 가능
  // const userId = req.user._id;
  try {
    await req.user.remove();
    // const removedUser = await User.deleteOne({ _id: req.user._id });
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

//이름과 나이 정보 수정
exports.patchUser = async (req, res) => {
  if (!req.user) {
    return;
  }
  console.log('회원정보 수정 접근');

  if (req.user.isAdmin) {
    //어드민 자신은 어떻게 수정하지? 디비에서 직접 수정해야 하나?
    try {
      const updatedUser = await User.updateOne(
        //admin이 로그인 해서 파라미터 값으로 회원 정보 수정하기
        { _id: req.params.userId },
        {
          $set: {
            name: req.body.name,
            age: req.body.age,
            isAdmin: req.body.isAdmin,
            // password: req.body.password,
          },
        },
      );
      console.log(
        `Admin이 회원님의 정보를 수정하였습니다! userId : ${req.params.userId}`,
      );
      return res.json({
        message: 'Admin이 회원님의 정보를 수정하였습니다!',
        userId: req.params.userId,
        data: updatedUser,
      });
    } catch (err) {
      return res.json({ message: err });
    }
  }

  //미들웨어 auth에서 유저 id를 받아야 수정가능
  try {
    req.user.name = req.body.name;
    req.user.age = req.body.age;
    await req.user.save();
    // const updatedUser = await User.updateOne(
    //     //회원 자기자신 수정하기
    //     { _id: req.user._id },
    //     {
    //         $set: {
    //             name: req.body.name,
    //             age: req.body.age,
    //             // password: req.body.password,
    //         },
    //     },
    // );
    return res.json(req.user);
  } catch (err) {
    return res.json({ message: err });
  }
};
// 로그인 한 유저가 비밀번호 리셋 토큰 발급 issuingResetToken
exports.selfResetPassword = async (req, res) => {
  if (!req.user) {
    // 왜 오류 발생?
    return;
  }
  req.user = password = req.body.password;
  await req.user.save();

  return res.status(200).send('패스워드가 변경되었습니다!');
};

//패스워드 찾기
//Node Mailer 사용하여 비밀번호 수정
exports.sendingResetEmail = (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).send({ message: error });
  }

  User.findOne({ email: req.body.email }, async (err, user) => {
    if (err || !user) {
      return res.json({
        message: '해당 계정이 없습니다!',
      });
    }
    try {
      // const resetPasswordToken = await user.generateToken(
      const expiresTime = '10m';
      const resetPasswordToken = await user.generateResetPasswordToken(
        process.env.JWT_SECRET_KEY2,
        expiresTime,
      );
      console.log('리셋 토큰 : ', resetPasswordToken);
      const options = {
        from: process.env.MAILER_EMAIL_ID,
        to: req.body.email,
        subject: '패스워드 초기화 안내 메일',
        text: `
                회원님의 패스워드 초기화 안내

                Your info :
                Id : ${user._id}
                Email : ${user.email}
                Please click this link to change your password. : ${prod_url}/users/reset/${resetPasswordToken}`,
      };
      sendingMail(options);
      // sendingMail(user._id, user.email,options, resetPasswordToken);

      return res.json({
        message: '비밀번호 초기화 이메일이 발송 되었습니다!',
      });
    } catch (err) {
      return res.json({ sendingResetEmail: false, err });
    }
  });
};
//
exports.resetPasswordbyEmail = async (req, res) => {
  // console.log(req.params);
  User.findOne({ resetPasswordToken: req.params.token }).then(async user => {
    if (!user) {
      return res.json({
        message: '비밀번호 초기화 토큰이 유효하지 않습니다!',
      });
    }
    //기존 패스워드랑 다르게 변경
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      return res.json({ message: '기존 패스워드와 동일합니다!' });
    }

    user.password = req.body.password;
    //패스워드 수정하게 되면 기존 로그인 되어있는 토큰들 모두 만료
    user.tokens = [];
    user.resetPasswordToken = undefined;

    user.save((err, doc) => {
      //save 되기전 패스워드 해싱이 이뤄진다
      if (err) {
        // console.log(err);
        return res.json({ message: 'err' });
      }
      // console.log('패스워드가 변경되었습니다! 다시 로그인 해주세요!');
      return res.clearCookie('x_auth').status(200).json({
        message: '패스워드가 변경 되었습니다. (토큰 삭제)',
      });
    });
  });
};
exports.finding = (req, res) => {
  const { email, name } = req.body;
  if (!req.body.email) {
    return res.status(400).send();
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.json({
        loginSuccess: false,
        message: '존재하지 않는 아이디입니다.',
      });
    }
    return res.json({
      message: '이메일 찾기 성공!',
      email: user.email,
    });
  });
};
//
exports.login = (req, res) => {
  //   console.log('로그인 접근');
  if (req.user) {
    return res.status(200).json({ alreadyLoggedIn: true, user: req.user });
  }
  const { email, password } = req.body;
  User.findOne(
    { email },
    // { isActivated: ++1 },
    async (err, user) => {
      if (err) {
        return res.json({
          loginSuccess: false,
          message: '존재하지 않는 아이디입니다.',
        });
      }
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 일치하지 않습니다!',
        });
        // return console.log('비밀번호가 매치하지 않습니다!', password);
      }
      if (!user.isCertified) {
        console.log('이메일을 인증하세요!', email);
        return res.json({
          loginSuccess: false,
          message: '인증되지 않았습니다! 이메일을 확인 해주세요!',
        });
      }

      try {
        const expiresTime = '1h'; // >> 토큰 만료시간되면 로그아웃이 되는데 isActivated 수는 안줄어든다
        const userToken = await user.generateToken(
          process.env.JWT_SECRET_KEY3,
          expiresTime,
        );
        console.log('로그인 되었습니다!', email);
        return res
          .cookie('x_auth', userToken)
          .clearCookie('reset_auth')
          .status(200)
          .json({ loginSucess: true, user });
      } catch (err) {
        return res.json({ loginSuccess: false, err: '토큰 오류' });
      }
    },
  );
};

exports.logout = async (req, res) => {
  // useFindAndModify
  if (!req.user) {
    return res.json({ message: '유저가 없음' });
  }

  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    // req.user.isActivated = req.user.isActivated - 1;
    await req.user.save();
    console.log('로그아웃 되었습니다!', req.user.email);
    res.clearCookie('x_auth').send('로그아웃 되었습니다!');
  } catch (e) {
    res.status(500).send('로그아웃 에러');
  }
};
//로그인 되어있는 모든 토큰 삭제
exports.logoutAll = async (req, res) => {
  // useFindAndModify
  if (!req.user) {
    return res.json({ message: '유저가 없음' });
  }

  try {
    req.user.tokens = [];
    req.user.isActivated = 0;
    await req.user.save();
    console.log('모든 기기에서 로그아웃 되었습니다!', req.user.email);

    res.clearCookie('x_auth').send('전체 로그아웃 되었습니다!');
  } catch (e) {
    res.status(500).send('로그아웃 에러');
  }
};

exports.uploadImg = async (req, res) => {
  // console.log(req.file);
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  req.user.avatar = buffer;
  await req.user.save();

  return res.send();
};

exports.deleteImg = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  return res.send();
};

exports.getImg = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    return res.send(user.avatar);
    // res.set('Content-Type', 'application/json');
  } catch (e) {
    return res.status(404).send;
  }
};
exports.test = (req, res) => {
  const mac = macaddress.one((err, mac) => {});
  console.log('mac : ', mac);

  User.findOne({ email: req.user.email }, (err, user) => {
    // if (user) {
    //     return res.json({ data: user });
    // }
    user.macTest('mac test', mac);
    console.log(user.tests);
    return res.json({ data: user });
  });
};
// exports.test = (req, res) => {
//     User.findOneAndUpdate(
//         { email: req.user.email },
//         { tests: 'asdfasdf' },
//         (err, user) => {
//             // user.test();
//             return res.json({ data: user });
//         },
//     );
// };
