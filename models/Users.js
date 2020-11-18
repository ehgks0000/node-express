const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
});

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
    const token = jwt.sign(this._id.toHexString(), 'secretToken');
    this.token = token;
    return this.save()
        .then(user => user)
        .catch(err => err);
};
module.exports = mongoose.model('User', UserSchema);
