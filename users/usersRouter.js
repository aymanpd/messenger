const express = require("express");
const passport = require("passport");
const User = require("./userModel");
const Request = require("./requestModel");
const appError = require("../utils/appError");
const { setCookie, catchAsync } = require("../utils");

const usersRouter = new express.Router();

// user signup
usersRouter.post(
  "/signup",
  catchAsync(async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    if (!password) {
      return next(new appError("Password is required", 400));
    }
    const newUser = new User({ email, password, firstName, lastName });
    await newUser.save();

    setCookie(newUser, res);
    res.status(201).send(newUser);
  })
);

// user login

usersRouter.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      return next(new appError("Email is required"), 400);
    }
    if (!password) {
      return next(new appError("Password is required"), 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new appError("That email and password combination didn't work", 401)
      );
    }
    const passwordVerified = await user.verifyPassword(password);
    if (!passwordVerified) {
      return next(
        new appError("That email and password combination didn't work", 401)
      );
    }

    setCookie(user, res);
    res.status(200).send(user);
  })
);

//google login

usersRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["https://www.googleapis.com/auth/plus.login", "email"],
  })
);

usersRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.baseUrl,
  }),
  function (req, res) {
    setCookie(req.user, res);
    res.redirect(process.env.baseUrl);
  }
);

// user profile

usersRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res, next) => {
    res.send(req.user);
  })
);

// send friend request

usersRouter.post(
  "/request/:userId",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res, next) => {
    const recipient = await User.findById(req.params.userId);

    if (!recipient || recipient.id === req.user.id) {
      return next(new appError("Wrong recipient", 400));
    }

    const alreadyFriends = req.user.friends.find(
      (friendId) => friendId == recipient.id
    );
    if (alreadyFriends) {
      return next(new appError("you are already friends"), 400);
    }

    const alreadySent = await Request.findOne({
      from: req.user.id,
      to: recipient.id,
      status: { $not: /accepted/ },
    });
    if (alreadySent) {
      return next(new appError("Request already sent", 400));
    }

    const alreadyRecived = await Request.findOne({
      from: recipient.id,
      to: req.user.id,
      status: { $not: /accepted/ },
    }); // accept request
    if (alreadyRecived) {
      alreadyRecived.status = "accepted";
      req.user.friends.push(recipient.id);
      recipient.friends.push(req.user.id);
      Promise.all([
        alreadyRecived.save(),
        req.user.save(),
        recipient.save(),
      ]).then(([request, user, recipient]) => {
        res
          .status(201)
          .send(
            `You and ${recipient.firstName} ${recipient.lastName} are friends now`
          );
      });
      return;
    }

    const newRequest = new Request({ from: req.user.id, to: recipient.id });
    await newRequest.save();
    res
      .status(201)
      .send(
        `Request to ${recipient.firstName} ${recipient.lastName} has been sent correctly`
      );
  })
);

// cancel friend request
// usersRouter.delete("/request:")

module.exports = usersRouter;
