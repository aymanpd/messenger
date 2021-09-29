const express = require("express");
const http = require("http");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { usersRouter } = require("../users");
const { messagingRouter } = require("../messages");
const { errorHandler } = require("../utils");
const path = require("path");

const serverInit = (app) => {
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(passport.initialize());

  // routes
  app.use("/users", usersRouter);
  app.use("/messaging", messagingRouter);
  app.use(errorHandler);

  if (process.env.NODE_ENV == "production") {
    app.use(express.static("./chat-client/build"));
    app.get("*", (req, res) => {
      res.sendFile(
        path.resolve(__dirname, "../chat-client", "build", "index.html")
      );
    });
  }

  return http.createServer(app);
};

module.exports = serverInit;
