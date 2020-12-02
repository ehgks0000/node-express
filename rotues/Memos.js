const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();
const { getMemo, writeMemo, deleteMemo } = require('../controllers/Memos');

router.route('/').get(getMemo).post(writeMemo);
// router.route('/').post();
router.route('/:memoId').delete(deleteMemo);

module.exports = router;
