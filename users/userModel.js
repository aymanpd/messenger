const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Conversation = require("../messages/conversationModel");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "user email is required"],
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Invalid email address",
      },
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      trim: true,
    },
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    picture: { type: String },
    friends: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isNew) {
    try {
      const adminConversation = new Conversation({
        members: [user.id, "5f7f7ced8609d32cf0483e55"],
      });
      await adminConversation.save();
    } catch (e) {
      console.log("error creating admin conversation", e);
    }
  }
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  if (!user.password) {
    //oauth account with no password
    return false;
  }
  const isMatch = await bcrypt.compare(password.toString(), user.password);
  return isMatch;
};

userSchema.methods.toJSON = function () {
  // romove private data from user object when send to client
  const user = this;
  const userObject = user.toObject(); // convert from user schema to object

  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  return userObject;
};

userSchema.statics.findOrCreate = async (profile) => {
  const { email, given_name, family_name, picture } = profile._json;
  let user = await userModel.findOne({ email });

  if (!user) {
    user = new userModel({
      email,
      firstName: given_name,
      lastName: family_name,
      picture,
    });
    await user.save();
  }
  return user;
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
