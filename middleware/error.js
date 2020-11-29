const errorHandler = (err, req, res, next) => {
    res.status(400).send({
        error: err.message,
    });
};

module.exports = errorHandler;
