const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();
const {
  getMemo,
  writeMemo,
  deleteMemo,
  getMemobyId,
  patchMemo,
} = require('../controllers/Memos');

router.route('/').get(auth, getMemo).post(auth, writeMemo);
// router.route('/').post();
router
  .route('/:memoId')
  .delete(auth, deleteMemo)
  .get(auth, getMemobyId)
  .patch(auth, patchMemo);

module.exports = router;
