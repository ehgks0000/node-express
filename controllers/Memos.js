const Memo = require('../models/Memos');
const { update } = require('../models/Users');
const User = require('../models/Users');

exports.getMemo = async (req, res) => {
  try {
    // const memo = await Memo.find({ userId: req.user._id });
    await req.user.populate('memos').execPopulate();

    console.log('메모찾기 완료');
    res.json(req.user.memos);
  } catch (e) {
    console.log('메모찾기 오류');
    res.status(500).send();
  }
};
exports.getMemobyId = async (req, res) => {
  const _id = req.params.memoId;
  try {
    const memo = await Memo.findOne({ _id, userId: req.user._id });
    // await memo.populate('userId').execPopulate();
    // memo.userId;

    if (!memo) {
      return res.status(404).send();
    }
    return res.send(memo);
  } catch (e) {
    res.status(500).send();
  }

  //   const user = await User.findById();
  //   await user.populate('memos').execPopulate();
  //   user.memos;

  return res.json({ memo: memo.userId });
};

exports.writeMemo = async (req, res) => {
  //   const text = req.body.text;
  //   const memo = new Memo({ text: text });
  try {
    const memo = new Memo({ ...req.body, userId: req.user._id });
    memo
      .save()
      .then(() => {
        console.log('메모작성 : ', req.user.email);
        return res.json({ memo });
      })
      .catch(e => {
        console.log(error);
      });
  } catch (e) {
    res.status(500).send();
  }
};

exports.deleteMemo = async (req, res) => {
  try {
    const removedMemo = await Memo.findOneAndDelete({
      _id: req.params.memoId,
      userId: req.user._id,
    });

    // const removedMemo = await Memo.deleteOne({});
    return res.json({ deleteSuccess: true, removedMemo });
  } catch (e) {
    return res.status(404).send();
  }
};

exports.patchMemo = async (req, res) => {
  //배열의 키만 모아서 저장, 수정하고 싶은 키값들만 저장, 바디와 수정하고 싶은 키값들을 대조
  const updates = Object.keys(req.body);
  const allowedUpdates = ['text', 'completed'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update),
  );
  if (!isValidOperation) {
    return res.status(404).send();
  }
  try {
    const memo = await Memo.findOne({
      _id: req.params.memoId,
      userId: req.user._id,
    });

    if (!memo) {
      return res.status(404).send();
    }
    updates.forEach(update => {
      memo[update] = req.body[update];
    });
    await memo.save();

    return res.status(200).send(memo);
  } catch (e) {
    res.status(400).send();
  }

  return res.json();
};
