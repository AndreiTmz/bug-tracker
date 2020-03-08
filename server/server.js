"use strict";
require("dotenv").config({ silent: true });
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routers/user-router");

const app = express();
app.use(bodyParser.json());
app.use(express.static("../client/public"));
app.use("/bug-tracker-api", userRouter);

app.listen(8080);
