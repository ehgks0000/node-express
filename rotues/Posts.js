const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();
const {
  getPost,
  writePost,
  deletePost,
  getPostbyId,
  patchPost,
  getAllPost,
  getPostAndComments,
} = require('../controllers/Posts');

router.route('/').get(auth, getPost).post(auth, writePost);
router.route('/all').get(getAllPost);
router.route('/test/:postid').get(getPostAndComments);
router
  .route('/:postId')
  .delete(auth, deletePost)
  .get(auth, getPostbyId)
  .patch(auth, patchPost);
module.exports = router;
