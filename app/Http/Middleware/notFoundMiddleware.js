const logger = require("./logger");

const notFoundMiddleware = (req, res, next) => {
    const err = new Error(`Not Found: ${req.method} ${req.url}`);
    err.status = 404;
    logger.error("404 Not Found", err, { method: req.method, url: req.url });
    next(err);
};

module.exports = notFoundMiddleware;
