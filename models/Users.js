const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        // 유닉 옵션 때문에 이메일 중복시 안만들어짐
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        // 공백 제거
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        default: Date.now,
    },
    token: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
});

//
// UserSchema.statics.create = function (email, password, name, age) {
//     const user = new this({
//         email,
//         password,
//         name,
//         age,
//     });
//     return user.save();
// };

//페스워드 들어가기 전 해싱됨
// 화살표 함수가 this 범위를 바꿔서 오류
UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
//비밀번호 대조하는 함수
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

//
UserSchema.methods.generateToken = function () {
    // 첫번째 파라미터는 토큰에 넣을 데이터, 두번째는 비밀 키, 세번째는 옵션, 네번째는 콜백함수
    const token = jwt.sign(this._id.toHexString(), process.env.JWT_SECRET_KEY);
    this.token = token;
    return this.save()
        .then(user => user)
        .catch(err => err);
};
// statics와 methods의 차이 전자는 모델 자체를 가리키고 후자는 데이터를 가리킨다
UserSchema.statics.findByToken = function (token) {
    let user = this;
    return jwt.verify(token, 'secretToken', function (err, decoded) {
        return user
            .findOne({ _id: decoded, token })
            .then(user => user)
            .catch(err => err);
    });
};

UserSchema.methods.generateEmailToken = function () {
    // console.log(this._id);
    // this.resetPasswordToken = '';
    this.resetPasswordToken = jwt.sign(
        this._id.toHexString(),
        process.env.JWT_SECRET_RESET_KEY,
        // { expiresIn: '20m' },
    );
    // this.resetPasswordToken = crypto.randomBytes(20).toString();
    this.resetPasswordExpires = Date.now() + 3600000;
    return this.save()
        .then(user => user.resetPasswordToken)
        .catch(err => err);
};
module.exports = mongoose.model('User', UserSchema);
