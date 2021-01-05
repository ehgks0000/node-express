const mongoose = require('mongoose');

const upmentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  writer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  memo_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Memo',
  },
  created_ad: {
    type: Number,
    default: Date.now,
  },
  count: {
    type: Number,
    default: 0,
  },
});

upmentSchema.methods.createUpment = function (text) {
  const ment = new this({
    text: text,
  });
  return ment.save();
};

// memoSchema.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject();

//   delete userObject.password;
//   delete userObject.tokens;
//   delete userObject.avatar;

//   return userObject;
// };

module.exports = mongoose.model('Upment', upmentSchema);
