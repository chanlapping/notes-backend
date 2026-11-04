const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body  :", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected username to be unique" });
  }

  next(err);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
