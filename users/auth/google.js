const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.baseUrl}/users/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOrCreate(profile);
        return done(false, user);
      } catch (e) {
        return done(e, false);
      }
    }
  )
);
