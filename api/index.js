const express = require("express");
const multer = require("multer");
const { orderCall } = require("./handlers/calls.js");
const { applyRequest } = require("./handlers/requests.js");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.post("/api/calls", orderCall);
app.post("/api/requests", upload.single("order"), applyRequest);

module.exports = app;
