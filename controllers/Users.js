const User = require('../models/Users');

exports.register = async (req, res) => {
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
                console.log(err);
                return res.json({ message: 'err' });
            }
            return res.status(200).json({
                message: 'success',
            });
        });
        // res.json(savedUser);
        // res 2개 이상 뿌려줘서 오류 발생
    } catch (err) {
        res.json({ message: 'err2' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
};
exports.deleteUser = async (req, res) => {
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
            res.json({
                loginSuccess: false,
                message: '비밀번호가 일치하지 않습니다!',
            });
            // return console.log('비밀번호가 매치하지 않습니다!', password);
        }
        // 비밀번호가 일치하면 Users 모델의 generateToken 함수로 토큰 생성 후 저장
        user.generateToken()
            .then(user => {
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id,
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
            })
            .catch(err => {
                res.json({ loginSuccess: false, err });
            });
        // console.log('로그인 돼었습니다!', isMatch);
    });
};
