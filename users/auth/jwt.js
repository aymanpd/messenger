const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../userModel");
const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const userId = jwt_payload.id;
    const user = await User.findById(userId);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  })
);
