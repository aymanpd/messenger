import axiosInstance from "../../axiosInstance";
import axios from "../../axiosInstance";

export const loadConv = (conversationId, offset) => async (dispatch) => {
  try {
    dispatch({ type: "CONV_LOADING", payload: conversationId });
    const res = await axios.get(`/messaging/conversation/${conversationId}`);
    dispatch({ type: "CONV_LOADED", payload: res.data });
  } catch (e) {
    console.log(e, "error loading conversation");
  }
};

export const loadMessenger = () => async (dispatch) => {
  try {
    dispatch({ type: "MESSENGER_LOADING" });
    const res = await axios.get(`/messaging/conversations`);
    dispatch({ type: "MESSENGER_LOADED", payload: res.data });
  } catch (e) {
    console.log(e, "error loading conversation");
  }
};

export const sendMessage = (message, socket) => async (dispatch) => {
  try {
    socket.emit("sendMessage", message);
  } catch (e) {
    console.log("error sending message: ", e);
  }
};

export const receiveMessage = (payload) => ({
  type: "RECIEVED_MESSAGE",
  payload,
});

export const resetUnRead = (conversationId, userId, socket) => async (
  dispatch
) => {
  try {
    socket.emit("resetUnread", { conversationId, userId });
    dispatch(resetUnreadLocal(conversationId, userId));
  } catch (e) {
    console.log("error resetting unread: ", e);
  }
};
export const resetUnreadLocal = (conversationId, userId) => ({
  type: "RESET_UNREAD",
  payload: { conversationId, userId },
});

export const updateLastSeen = (conversationId, lastSeen) => ({
  type: "UPDATE_LASTSEEN",
  payload: { conversationId, lastSeen },
});

//reducer
export default (prevState = { loading: false }, { type, payload }) => {
  switch (type) {
    //loading messenger
    case "MESSENGER_LOADING":
      return { loading: true };
    case "MESSENGER_LOADED":
      const conversations = payload.reduce(
        (prev, curr) => ({ ...prev, [curr._id]: curr }),
        {}
      );
      return { loading: false, ...conversations };
    //Conversation loading
    case "CONV_LOADING":
      return { ...prevState, [payload]: { loading: true } };
    case "CONV_LOADED":
      return { ...prevState, [payload._id]: { loading: false, ...payload } };

    //Recieved message
    case "RECIEVED_MESSAGE": {
      const { message, me } = payload;
      console.log(me);
      const { [message.conversationId]: conversation, ...rest } = prevState;
      conversation.messages.push(message);

      !me && conversation.unRead++;
      return {
        ...rest,
        [message.conversationId]: conversation,
      };
    }
    //Reset Unread Counter
    case "RESET_UNREAD": {
      const { conversationId, userId } = payload;
      const { [conversationId]: conversation, ...rest } = prevState;
      conversation.unRead = 0;
      return {
        ...rest,
        [conversationId]: conversation,
      };
    }
    //UPDATE_LASTSEEN
    case "UPDATE_LASTSEEN": {
      const { conversationId, lastSeen } = payload;
      const { [conversationId]: conversation, ...rest } = prevState;
      conversation.lastSeen = lastSeen;
      return {
        ...rest,
        [conversationId]: conversation,
      };
    }
    default:
      return prevState;
  }
};
