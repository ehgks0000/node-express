const multer = require('multer');

const upload = multer({
    // dest: 'img',
    limits: {
        fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload an image (jpg, jpeg, png)'));
        }
        cb(undefined, true);
    },
});

module.exports = { upload };
