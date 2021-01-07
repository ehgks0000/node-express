const Comment = require('../models/Comments');

exports.writeComment = async (req, res) => {
  const { post, text } = req.body;
  const data = {
    text,
    post,
    author: req.user.id,
  };
  if ('parentComment' in req.body) {
    data.parentComment = req.body.parentComment;
  }
  if ('depth' in req.body) {
    data.depth = req.body.depth;
  }

  const comment = new Comment(data);

  comment
    .save()
    .then(() => {
      console.log('댓글 작성 : ', req.user.email);
      return res.json({ comment });
    })
    .catch(e => {
      console.error(e);
      return res.status(500).send();
    });
};

exports.getCommentsMine = async (req, res) => {
  const user = req.user;
  try {
    await user.populate('comments').execPopulate();

    return res.json(user.comments);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
exports.getCommentsAll = async (req, res) => {
  //   const user = req.user;
  try {
    const comments = await Comment.find().populate('parentComment');
    return res.json(comments);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
