const express = require('express');
const router = express.Router();
const { writeMent, getAllMent, getMent } = require('../controllers/Downments');
const { auth } = require('../middleware/auth');

router.route('/').post(auth, writeMent).get(auth, getMent);
router.route('/all').get(getAllMent);
module.exports = router;
