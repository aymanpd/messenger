const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
    },
    text: {
      type: String,
      required: [true, "Message can't be empty"],
      trim: true,
    },
    state: {
      type: String,
      enum: ["sent", "delivered"],
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;
