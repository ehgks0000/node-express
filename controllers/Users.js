const User = require('../models/Users');

exports.register = async (req, res) => {
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
            res.status(200).json({
                message: 'success',
                data: savedUser,
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
        console.log('검색 되었습니다!');
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        console.log('해당 id를 가진 회원이 없습니다!');
        res.json({ message: err });
    }
};
exports.deleteUser = async (req, res) => {
    console.log('회원 가입');

    //미들웨어 auth에서 유저 id를 받아야 삭제 가능
    const userId = req.user._id;
    try {
        const removedUser = await User.deleteOne({ _id: userId });
        // const removedUser = await User.deleteOne({ _id: req.params.userId });
        // res.json(removedUser);
        res.json({
            message: '아이디가 삭제 되었습니다!',
            data: removedUser,
        });
    } catch (err) {
        res.json({ message: err });
    }
};

exports.patchUser = async (req, res) => {
    console.log('회원 수정 접근');

    //미들웨어 auth에서 유저 id를 받아야 수정가능
    const userId = req.user._id;
    try {
        const updatedUser = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    password: req.body.password,
                },
            },
        );
        res.json(updatedUser);
    } catch (err) {
        res.json({ message: err });
    }
};

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
            console.log('로그인 되었습니다!');
            res.cookie('x_auth', userToken.token).status(200).json({
                loginSuccess: true,
                userId: user._id,
                token: userToken.token,
            });
        } catch (err) {
            res.json({ loginSuccess: false, err });
        }
        // user.generateToken()
        //     .then(user => {
        //         res.cookie('x_auth', user.token)
        //             .status(200)
        //             .json({
        //                 loginSuccess: true,
        //                 userId: user._id,
        //             })
        //             .catch(err => {
        //                 res.status(400).send(err);
        //             });
        //     })
        //     .catch(err => {
        //         res.json({ loginSuccess: false, err });
        //     });
    });
};

exports.logout = (req, res) => {
    console.log('로그아웃 접근');
    try {
        const userLogout = User.findOneAndUpdate(
            { _id: req.user._id },
            { token: ' ' },
        );
        console.log(userLogout);
        // res.clearCookie('x_auth').status(200).send({
        //     success: true,
        // });
    } catch (err) {
        res.json({ success: false, err });
    }
    // User.findOneAndUpdate(
    //     { _id: req.user._id },
    //     { token: ' ' },
    //     // { $set: { token: '' } },
    //     (err, user) => {
    //         if (err) return res.json({ success: false, err });
    //         // res.clearCookie('x_auth');
    //         return res.clearCookie('x_auth').status(200).send({
    //             success: true,
    //         });
    //     },
    // );
};