import socketIOClient from "socket.io-client";
import { Message } from "../state";
import { useActions } from "../state/hooks";
import { Howl } from "howler";

const reciveMessageSound = new Howl({
  src: ["/beep.mp3"],
});

const Ioinit = (): SocketIOClient.Socket => {
  const {
    recievingMessageAction,
    updateLastSeenAction,
    recievingMessageInfoAction,
  } = useActions();
  const socket = socketIOClient(process.env.REACT_APP_API_URL || "", {
    reconnection: true,
  });
  socket.on("receiveMessage", (payload: { message: Message }) => {
    recievingMessageAction(payload.message);
    reciveMessageSound.play();
  });
  socket.on(
    "seen",
    (payload: {
      conversationId: string;
      lastSeen: { [key: string]: string };
    }) => updateLastSeenAction(payload.conversationId, payload.lastSeen)
  );

  socket.on("messageInfo", (payload: { message: Message; localId: string }) => {
    recievingMessageInfoAction(payload.message, payload.localId);
  });

  return socket;
};

export default Ioinit;
