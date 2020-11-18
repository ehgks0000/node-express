const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        // 유닉 옵션 때문에 이메일 중복시 안만들어짐
        lowercase: true
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
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    }

});

UserSchema.pre("save", function(next) {

    var user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt)=>{
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash)=>{
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// model methods // 4
UserSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
  };

module.exports = mongoose.model("User", UserSchema);