const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    // ref: true,
  },
  completed: { type: String, required: true, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

memoSchema.methods.createMemo = function (text) {
  const memo = new this({
    text: text,
  });
  return memo.save();
};

// memoSchema.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject();

//   delete userObject.password;
//   delete userObject.tokens;
//   delete userObject.avatar;

//   return userObject;
// };

module.exports = mongoose.model('Memo', memoSchema);