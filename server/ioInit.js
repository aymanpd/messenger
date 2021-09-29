const socketIo = require("socket.io");
const cookie = require("cookie");
const passport = require("passport");
const { Conversation, Message, messagingRouter } = require("../messages");

const clients = {};

const ioInit = (server) => {
  const io = socketIo(server).use((socket, next) => {
    socket.request.cookies = cookie.parse(socket.handshake.headers.cookie);
    try {
      passport.authenticate("jwt", { session: false })(
        socket.request,
        {},
        next
      );
    } catch (e) {
      next(e);
    }
  });

  io.on("connection", (socket) => {
    clients[socket.request.user._id] = socket.id;
    socket.on("sendMessage", async (payload) => {
      sendMessage(socket, payload);
    });
    socket.on("resetUnread", async (payload) => {
      resetUnread(socket, payload);
    });
    socket.on("disconnect", function () {
      delete clients[socket.request.user._id];
    });
  });

  return io;
};

/*************** methods  ****************/

const getMembers = (members, userId) => {
  const [user1, user2] = members;

  return JSON.stringify(user1) == JSON.stringify(userId)
    ? { me: user1, to: user2 }
    : { me: user2, to: user1 };
};

// sending a messages
const sendMessage = async (socket, { text, conversationId, _id }) => {
  // get data
  const conversation = await Conversation.findById(conversationId);
  const { me, to } = getMembers(conversation.members, socket.request.user._id);

  //create new message
  const newMessage = new Message({
    text,
    from: me,
    conversationId,
    state: clients[to] ? "delivered" : "sent",
  });
  await newMessage.save();

  // sending message
  socket.emit("messageInfo", { message: newMessage, localId: _id });
  if (clients[to]) {
    socket.to(clients[to]).emit("receiveMessage", { message: newMessage });
  }

  conversation.unread = { [me]: 0, [to]: conversation.unread[to] + 1 };
  await conversation.save();
};

const resetUnread = async (socket, { conversationId }) => {
  const conversation = await Conversation.findById(conversationId).populate(
    "messages"
  );
  const { me, to } = getMembers(conversation.members, socket.request.user._id);

  const lastMessage =
    conversation.messages[conversation.messages.length - 1].from == me
      ? conversation.messages[conversation.messages.length - 2].id
      : conversation.messages[conversation.messages.length - 1].id;

  conversation.lastSeen = { ...conversation.lastSeen, [me]: lastMessage };

  conversation.unread = { ...conversation.unread, [me]: 0 };

  if (clients[to]) {
    socket.to(clients[to]).emit("seen", {
      conversationId,
      lastSeen: { [me]: conversation.lastSeen[me] },
    });
  }
  await conversation.save();
};

module.exports = ioInit;
