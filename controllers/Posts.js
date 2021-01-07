const Post = require('../models/Posts');
const { update } = require('../models/Users');
const User = require('../models/Users');
const Comment = require('../models/Comments');
const e = require('express');

exports.getPost = async (req, res) => {
  const user = req.user;
  try {
    // const post = await Post.find({ userId: req.user._id });
    // await user.populate('memos', 'text userId').execPopulate();
    await user.populate('posts').execPopulate();
    res.json(user.posts);
  } catch (e) {
    console.log('메모찾기 오류');
    res.status(500).send();
  }
};
exports.getAllPost = async (req, res) => {
  try {
    const post = await Post.find().populate('upments');
    // const user = await User.find().populate('memos');

    res.json(post);
  } catch (e) {
    console.log('메모찾기 오류', e);
    res.status(500).send();
  }
};
exports.getPostbyId = async (req, res) => {
  const _id = req.params.postId;
  try {
    const post = await Post.findOne({ _id, userId: req.user._id });
    // await post.populate('userId').execPopulate();
    // post.userId;

    if (!post) {
      return res.status(404).send();
    }
    return res.send(post);
  } catch (e) {
    res.status(500).send();
  }

  //   const user = await User.findById();
  //   await user.populate('memos').execPopulate();
  //   user.memos;

  return res.json({ post: post.userId });
};

exports.writePost = async (req, res) => {
  //   const text = req.body.text;
  //   const post = new Post({ text: text });
  try {
    const post = new Post({ ...req.body, userId: req.user._id });
    post
      .save()
      .then(() => {
        console.log('메모작성 : ', req.user.email);
        return res.json({ post });
      })
      .catch(e => {
        console.log(error);
      });
  } catch (e) {
    res.status(500).send();
  }
};

exports.deletePost = async (req, res) => {
  try {
    const removedPost = await Post.findOneAndDelete({
      _id: req.params.postId,
      userId: req.user._id,
    });

    // const removedMemo = await Post.deleteOne({});
    return res.json({ deleteSuccess: true, removedPost });
  } catch (e) {
    return res.status(404).send();
  }
};

exports.patchPost = async (req, res) => {
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
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.user._id,
    });

    if (!post) {
      return res.status(404).send();
    }
    updates.forEach(update => {
      post[update] = req.body[update];
    });
    await post.save();

    return res.status(200).send(post);
  } catch (e) {
    res.status(400).send();
  }

  return res.json();
};

exports.getPostAndComments = async (req, res) => {
  const { postid } = req.params;
  console.log('파람 : ', postid);
  try {
    const post = await Post.findOne({ _id: postid }).populate({
      path: 'userId',
      select: 'email',
    });
    const comments = await Comment.find({ post: postid })
      .sort('createdAt')
      .populate({ path: 'author', select: 'email' });

    return res.status(202).json({ post, comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
