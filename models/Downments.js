const mongoose = require('mongoose');

const downSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  writer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Upment',
  },
  memo_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Memo',
  },
  created_at: {
    type: Number,
    default: Date.now,
  },
  updated_at: {
    type: Number,
    default: Date.now,
  },
  count: {
    type: Number,
    default: 0,
  },
});

downSchema.methods.createDownment = function (text) {
  const ment = new this({
    text: text,
  });
  return ment.save();
};

module.exports = mongoose.model('Downment', downSchema);
