const Memo = require('../models/Memos');

exports.getMemo = async (req, res) => {
  const memo = await Memo.find({});
  return res.json({ memo });
};

exports.writeMemo = async (req, res) => {
  const text = req.body.text;

  const memo = new Memo({ text: text });
  memo
    .save()
    .then(() => {
      console.log(memo);
      return res.json({ memo });
    })
    .catch(e => {
      console.log(error);
    });
};

exports.deleteMemo = async (req, res) => {
  const removedMemo = await Memo.deleteOne({
    _id: req.params.memoId,
  });
  //   const data = Memo.deleteOne({ _id: id });
  return res.json({ deleteSuccess: true, removedMemo });
};
