const mongoose = require("mongoose");

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

})

module.exports = mongoose.model("User", UserSchema);