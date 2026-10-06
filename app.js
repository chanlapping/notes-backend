const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");

const app = express();

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info("connected to mongo db"))
  .catch((error) => logger.error(error.message));

app.use(express.json());
app.use(express.static("dist"));
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;
