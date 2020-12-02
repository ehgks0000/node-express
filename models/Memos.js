const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    // ref: true,
  },
});

// memoSchema.pre('save', function (next) {
//   const memo = this;
//   if (memo.isModified('text')) {
//     next();
//   } else {
//     next();
//   }
// });
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
