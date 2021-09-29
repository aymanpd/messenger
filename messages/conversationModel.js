const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    unread: {
      type: {},
      default: {},
    },
    lastSeen: {
      type: {},
      default: {},
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    toJSON: { virtuals: true },
    minimize: false,
  }
);

ConversationSchema.pre("save", async function (next) {
  const conversation = this;

  if (conversation.isNew) {
    conversation.unread = conversation.members.reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: 0,
      }),
      {}
    );
  }
  next();
});

ConversationSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "conversationId",
});

const conversationModel = mongoose.model("Conversation", ConversationSchema);

module.exports = conversationModel;
