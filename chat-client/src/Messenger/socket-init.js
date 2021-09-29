import store from "../store";
import socketIOClient from "socket.io-client";
import { receiveMessage, updateLastSeen } from "./redux/messengerReducer";

export default () => {
  const socket = socketIOClient(process.env.REACT_APP_BASE_URL, {
    reconnection: false,
  });
  socket.on("receiveMessage", (payload) => {
    store.dispatch(receiveMessage(payload));
  });
  socket.on("seen", ({ conversationId, lastSeen }) => {
    store.dispatch(updateLastSeen(conversationId, lastSeen));
  });
  return socket;
};
