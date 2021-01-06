const Downment = require('../models/Downments');

exports.writeMent = async (req, res) => {
  const user = req.user;
  try {
    const downment = new Downment({ ...req.body, writer_id: req.user._id });

    downment
      .save()
      .then(() => {
        console.log('댓글 작성 : ', req.user.email);
        return res.json({ downment });
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
    await user.populate('downments').execPopulate();

    return res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
exports.getAllMent = async (req, res) => {
  //   const user = req.user;
  try {
    const downment = await Downment.find();
    return res.json(downment);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
