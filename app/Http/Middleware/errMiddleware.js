
const logger = require("./logger");

const errMiddleware = (err, req, res, next) => {
    logger.error("Unhandled error", err, { method: req.method, url: req.url });
    res.status(500).json({ error: "Something went wrong" });
}

module.exports = errMiddleware;