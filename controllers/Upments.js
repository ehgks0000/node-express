const Upment = require('../models/Upments');

exports.writeMent = async (req, res) => {
  const user = req.user;
  try {
    const upment = new Upment({ ...req.body, writer_id: req.user._id });

    upment
      .save()
      .then(() => {
        console.log('댓글 작성 : ', req.user.email);
        return res.json({ upment });
      })
      .catch(e => {
        console.error(e);
      });
  } catch (e) {
    console.log('메모찾기 오류');
    res.status(500).send();
  }
};

exports.getMent = async (req, res) => {
  const user = req.user;
  try {
    await user.populate('upments').execPopulate();

    return res.json(user.upments);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
exports.getAllMent = async (req, res) => {
  //   const user = req.user;
  try {
    const upment = await Upment.find().populate('downments');
    return res.json(upment);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
