const express = require("express");
const passport = require("passport");
const {
  getAllConversations,
  getConversation,
} = require("./messagingController");
const { catchAsync } = require("../utils");

const messagingRoute = new express.Router();

messagingRoute.get(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getAllConversations)
);

messagingRoute.get(
  "/conversation/:id",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getConversation)
);

module.exports = messagingRoute;
