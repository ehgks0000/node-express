const User = require('../models/Users');
const macaddress = require('node-macaddress');
const multer = require('multer');
const { sendingMail } = require('../lib/nodemailer');

exports.register = async (req, res) => {
    if (req.user) {
        return;
    }
    console.log('회원 가입 접근');
    //회원 가입시 인증 메일 발송
    //body parser필요 없으면 undefined 출력됨
    const user = new User(req.body);
    try {
        await user.save((err, doc) => {
            //save 되기전 패스워드 해싱이 이뤄진다
            if (err) {
                // if (!doc.isCertified) {
                //     return res.json({
                //         message:
                //             '인증되지 않은 아이디 입니다. 메일을 확인해 주세요!',
                //     });
                // }
                return res.json({ message: '중복된 아이디 입니다!', err });
            }
            //

            console.log('회원가입 인증메일 발송! : ', doc);

            const { name, email } = req.body;
            const expiresTime = '1h';
            user.generateToken(process.env.JWT_SECRET_KEY3, expiresTime).then(
                certifyToken => {
                    const options = {
                        from: `${process.env.MAILER_EMAIL_ID}`,
                        to: `${email}`,
                        subject: 'Test sending email',
                        text: `
                        Sending Test Mail
                        
                        Your info :
                        Name : ${name}
                        Email : ${email}
                        Please click this link if you want to be certified. : ${process.env.CLIENT_URL}/users/certify/${certifyToken}`,
                    };

                    console.log('회원 인증 토큰 : ', certifyToken);
                    sendingMail(options);
                },
            );

            return res.status(200).json({
                message: 'success hashing password',
                data: doc,
            });
        });
        // res.json(savedUser);
        // res 2개 이상 뿌려줘서 오류 발생
    } catch (err) {
        return res.json({ message: 'err2' });
    }
};
exports.certifyUser = async (req, res) => {
    const token = req.params.token;
    try {
        const updatedUser = await User.updateOne(
            //회원 자기자신 수정하기
            { token: token },
            {
                $set: {
                    isCertified: true,
                    // password: req.body.password,
                },
            },
        );
        console.log(
            `회원님의 이메일이 인증 되었습니다! ${updatedUser} : ${token}`,
        );
        return res.json({
            message: '회원님의 이메일이 인증 되었습니다! ',
            token: token,
        });
    } catch (err) {
        return res.json({ message: err });
    }
};
exports.getUsers = async (req, res) => {
    console.log('회원 전체검색 접근');
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
};
exports.getUserById = async (req, res) => {
    console.log('특정회원 검색 접근');
    try {
        const user = await User.findById(req.params.userId);
        console.log(`
            id : ${user._id}, 
            email : ${user.email},
            isAdmin : ${user.isAdmin},
            name : ${user.name}`);
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
            console.log(
                `Admin이 아이디를 삭제 하였습니다! ${req.params.userId}`,
            );
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
        const removedUser = await User.deleteOne({ _id: req.user._id });
        console.log(`회원님의 아이디가 삭제 되었습니다! ${req.user.userId}`);
        res.json({
            message: '아이디가 삭제 되었습니다!',
            data: removedUser,
        });
    } catch (err) {
        res.json({ message: err });
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
        const updatedUser = await User.updateOne(
            //회원 자기자신 수정하기
            { _id: req.user._id },
            {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    // password: req.body.password,
                },
            },
        );
        console.log(
            `회원 정보가 수정되었습니다! ${updatedUser} : ${req.user._id}`,
        );
        return res.json(updatedUser);
    } catch (err) {
        return res.json({ message: err });
    }
};
// 로그인 한 유저가 비밀번호 리셋 토큰 발급 issuingResetToken
exports.issuingResetPasswordToken = (req, res) => {
    console.log('회원 비밀번호 수정 접근');

    if (!req.user) {
        // 왜 오류 발생?
        return;
    }

    User.findOne({ _id: req.user._id }, async (err, user) => {
        if (err || !user) {
            return res.json({
                message: '해당 아이디가 없습니다.',
            });
        }
        try {
            // process.env.JWT_SECRET_KEY
            const expiresTime = '1h';
            const resetPasswordToken = await user.generateResetPasswordToken(
                process.env.JWT_SECRET_KEY,
                expiresTime,
            );
            // generateResetPasswordToken
            console.log('리셋 토큰 발급 : ', resetPasswordToken);
            // res.cookie('x_auth', userToken).status(200).json({
            res.cookie('reset_auth', resetPasswordToken).json({
                message: '리셋 토큰 발급',
                resetPasswordToken: resetPasswordToken,
            });
        } catch (err) {
            console.log(err);
            res.json({ message: '에러' });
        }
    });
};

//패스워드 수정
//Node Mailer 사용하여 비밀번호 수정
exports.sendingResetEmail = (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err || !user) {
            return res.json({
                message: '해당 계정이 없습니다!',
            });
        }
        try {
            // process.env.JWT_SECRET_KEY2
            const resetPasswordToken = await user.generateToken(
                process.env.JWT_SECRET_KEY2,
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
                Please click this link to change your password. : ${process.env.CLIENT_URL}/users/reset/${resetPasswordToken}`,
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
exports.resetPassword = async (req, res) => {
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
        user.token = undefined;
        user.resetPasswordToken = undefined;

        user.save((err, doc) => {
            //save 되기전 패스워드 해싱이 이뤄진다
            if (err) {
                // console.log(err);
                return res.json({ message: 'err' });
            }
            console.log('패스워드가 변경되었습니다! 다시 로그인 해주세요!');
            return res.clearCookie('x_auth').status(200).json({
                message: '패스워드가 변경 되었습니다. (토큰 삭제)',
            });
        });
    });
};
//
exports.login = (req, res) => {
    console.log('로그인 접근');
    if (req.user) {
        const { isAdmin, isCertified, _id, email, name, age } = req.user;
        console.log('이미 로그인 되어있습니다!');
        return res.json({
            message: '이미 로그인 되어있습니다!',
            user: { _id, email, isAdmin, isCertified, name, age },
        });
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
                return res.json({
                    loginSuccess: false,
                    message: '인증되지 않았습니다! 이메일을 확인 해주세요!',
                });
            }
            if (user.isActivated > 3) {
                // 잘 작동하는데 만약 로그인 해놓고 토큰 만료가 된다면?
                return res.json({
                    message: '3개 이상 활성화',
                });
            }
            // 비밀번호가 일치하면 Users 모델의 generateToken 함수로 토큰 생성 후 저장
            try {
                const expiresTime = '1h'; // >> 토큰 만료시간되면 로그아웃이 되는데 isActivated 수는 안줄어든다
                const userToken = await user.generateToken(
                    process.env.JWT_SECRET_KEY3,
                    expiresTime,
                );
                user.incrementActivated(); //로그인 시
                if (user.isAdmin) {
                    console.log('Admin 로그인 되었습니다!');
                } else {
                    console.log('일반회원 로그인 되었습니다!');
                }
                return res
                    .cookie('x_auth', userToken)
                    .clearCookie('reset_auth')
                    .status(200)
                    .json(user);
                // loginSuccess: true,
                // userId: user._id,
                // isAdmin: user.isAdmin,
                // isCertified: user.isCertified,
                // token: userToken,
                // isActivated: user.isActivated,
            } catch (err) {
                res.json({ loginSuccess: false, err: '토큰 오류' });
            }
        },
    );
};

exports.logout = (req, res) => {
    console.log('로그아웃 접근');
    // useFindAndModify
    if (!req.user) {
        return res.json({ message: '유저가 없음' });
    }
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            token: ' ',
            resetPasswordToken: ' ',
        },
        // { $set: { token: '' } },
        (err, user) => {
            if (err) return res.json({ logoutSuccess: false, err });
            console.log('로그아웃 되었습니다! : ', user._id);
            user.decrementActivated();
            return res
                .clearCookie('x_auth')
                .clearCookie('connect.sid') //구글 로그인할때 생기는데 왜생기냐?
                .status(200)
                .send({
                    logoutSuccess: true,
                    message: '로그아웃 되었습니다!',
                });
        },
    );
    // console.log('로그아웃 되었습니다!');
};

exports.uploadImg = (req, res) => {
    // console.log('mac : ', mac);

    return res.send();
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
