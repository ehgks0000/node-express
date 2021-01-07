const express = require('express');
const router = express.Router();
const {
  writeComment,
  getCommentsMine,
  getCommentsAll,
  writeReplyComment,
} = require('../controllers/Comments');
const { auth } = require('../middleware/auth');
const Post = require('../models/Posts');

router.route('/').post(auth, writeComment).get(auth, getCommentsMine);
// router.route('/re').post(auth, writeReplyComment);
router.route('/all').get(getCommentsAll);

const checkPostId = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.query.postId });
    res.locals.post = post;
    // req.post = post
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
};
module.exports = router;
