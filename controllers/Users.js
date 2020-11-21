const { isAdmin } = require('../middleware/auth');
const User = require('../models/Users');

const { sendingMail } = require('./nodemailer');

exports.register = async (req, res) => {
    if (req.user) {
        return;
    }
    console.log('회원 가입 접근');

    //body parser필요 없으면 undefined 출력됨

    // const user = new User({
    //     email: req.body.email,
    //     password: req.body.password,
    //     name: req.body.name,
    //     age: req.body.age,
    // });
    const user = new User(req.body);
    //postman에서 post 할때 body를 json 형식으로 보내야한다.
    // console.log(user);

    try {
        const savedUser = await user.save((err, doc) => {
            //save 되기전 패스워드 해싱이 이뤄진다
            if (err) {
                // console.log(err);
                return res.json({ message: 'err' });
            }
            console.log('회원가입 완료!');
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
            const resetPasswordToken = await user.generateResetToken();
            console.log('리셋 토큰 발급 : ', resetPasswordToken);
            res.json({
                message: '리셋 토큰 발급',
                resetToken: resetPasswordToken,
            });
        } catch (err) {
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
            const resetPasswordToken = await user.generateResetToken();
            console.log('리셋 토큰 : ', resetPasswordToken);
            sendingMail(user._id, user.email, resetPasswordToken);

            return res.json({
                message: '비밀번호 초기화 이메일이 발송 되었습니다!',
            });
        } catch (err) {
            return res.json({ sendingResetEmail: false, err });
        }
    });
};
//
exports.resetPassword = (req, res) => {
    // console.log(req.params);
    User.findOne({ resetPasswordToken: req.params.resetPasswordToken }).then(
        user => {
            if (!user) {
                return res.json({
                    message: '비밀번호 초기화 토큰이 유효하지 않습니다!',
                });
            }

            //기존 패스워드랑 다르게 변경
            const isMatch = user.comparePassword(req.body.password);
            if (isMatch) {
                return res.json({ message: '기존 패스워드와 동일합니다!' });
            }

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            // user.resetPasswordExpires = undefined;

            user.save((err, doc) => {
                //save 되기전 패스워드 해싱이 이뤄진다
                if (err) {
                    // console.log(err);
                    return res.json({ message: 'err' });
                }
                console.log('패스워드가 변경되었습니다!');
                return res.clearCookie('x_auth').status(200).json({
                    message: '패스워드가 변경 되었습니다. (토큰 삭제)',
                });
            });
        },
    );
};
//
exports.login = (req, res) => {
    console.log('로그인 접근');
    const { email, password } = req.body;
    User.findOne({ email }, async (err, user) => {
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
        // 비밀번호가 일치하면 Users 모델의 generateToken 함수로 토큰 생성 후 저장
        try {
            const userToken = await user.generateToken();
            // console.log(userToken);
            res.cookie('x_auth', userToken.token).status(200).json({
                loginSuccess: true,
                userId: user._id,
                isAdmin: user.isAdmin,
                token: userToken.token,
            });
            if (user.isAdmin) {
                console.log('Admin 로그인 되었습니다!');
            } else {
                console.log('로그인 되었습니다!');
            }
        } catch (err) {
            res.json({ loginSuccess: false, err });
        }
    });
};

exports.logout = (req, res) => {
    console.log('로그아웃 접근');
    // useFindAndModify
    if (!req.user) {
        return;
    }
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: ' ' },
        // { $set: { token: '' } },
        (err, user) => {
            if (err) return res.json({ logoutSuccess: false, err });
            // res.clearCookie('x_auth');
            return res.clearCookie('x_auth').status(200).send({
                logoutSuccess: true,
                message: '로그아웃 되었습니다!',
            });
        },
    );
    console.log('로그아웃 되었습니다!');
};
