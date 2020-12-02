const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const { delete } = require('..');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // 유닉 옵션 때문에 이메일 중복시 안만들어짐
    lowercase: true,
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
  },
  naverId: {
    type: String,
    unique: true,
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
    trim: true,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  date: {
    type: Number,
    default: Date.now,
  },
  // token: {
  //     type: String,
  // },
  //토큰 배열 어케하지? ㄱㄷ
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
  resetPasswordToken: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isCertified: {
    //회원 가입 후 인증된 회원
    type: Boolean,
    default: false,
  },
  // resetPasswordExpires: {
  //     type: Date,
  // },
  isActivated: {
    type: Number,
    default: 0,
    min: 0,
  },
  tests: [
    {
      test: { type: String },
      mac: { type: String, unique: true },
    },
  ],
  avatar: {
    type: Buffer,
  },
});

UserSchema.virtual('memos', {
  ref: 'Memo',
  localField: '_id',
  foreignField: 'userId',
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
    const saltFactor = 10;
    bcrypt.genSalt(saltFactor, function (err, salt) {
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
//검색 못하게 막는다 안보여줌 디비엔 있는데
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};
//비밀번호 대조하는 함수
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//
UserSchema.methods.generateToken = async function (secret_key, expiresTime) {
  // 첫번째 파라미터는 토큰에 넣을 데이터, 두번째는 비밀 키, 세번째는 옵션, 네번째는 콜백함수
  const user = this;
  const token = jwt.sign({ _id: this._id.toHexString() }, secret_key, {
    expiresIn: expiresTime,
  });

  // user.token = token;
  //concat 대신 push는 왜 안될까

  user.tokens = user.tokens.concat({ token: token });

  await user.save();
  return token;
  // return user.save()
  //     .then(user => user.token)
  //     .catch(err => err);
};
// statics와 methods의 차이 전자는 모델 자체를 가리키고 후자는 데이터를 가리킨다
UserSchema.statics.findByToken = function (token, secret_key) {
  const user = this;
  return jwt.verify(token, secret_key, function (err, decoded) {
    return user
      .findOne({ _id: decoded, 'tokens.token': token })
      .then(user => user)
      .catch(err => err);
  });
};

UserSchema.methods.generateResetPasswordToken = async function (
  secret_key,
  expresTime,
) {
  this.resetPasswordToken = jwt.sign(
    { _id: this._id.toHexString() },
    secret_key,
    { expiresIn: expresTime },
  );

  return await this.save()
    .then(user => user.resetPasswordToken)
    .catch(err => err);
};

UserSchema.methods.macTest = function (text, mac) {
  this.tests.push({ test: text, mac: mac });
  // this.tests.push({ 1: 'asdddf', 2: '2' });
  this.save();
};

module.exports = mongoose.model('User', UserSchema);
