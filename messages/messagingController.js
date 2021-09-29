const Conversation = require("./conversationModel");
const appError = require("../utils/appError");

const getAllConversations = async (req, res, next) => {
  const conversations = await Conversation.find({ members: req.user.id })
    .populate("messages")
    .populate("members")
    .sort({ updatedAt: -1 });

  conversations.forEach((conversation) => {
    conversation.unread = conversation.unread[req.user.id] || 0;
    delete conversation.lastSeen[req.user.id];
  });

  res.send(conversations);
};

const getConversation = async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    members: req.user._id,
  })
    .populate("messages")
    .populate("members");

  if (!conversation) {
    return next(new appError("no such conv", 404));
  }
  res.send(conversation);
};

module.exports = {
  getConversation,
  getAllConversations,
};

/********** utils *********/
