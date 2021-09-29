import React, { FormEvent, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import Conversation from "./Conversation";
import socketInit from "./socketio";
import { match } from "react-router-dom";
import { useActions, useTypedSelector } from "../state/hooks";
import Loader from "../Loader/Loader";
import ConversationsList from "./ConversationList";
import { ensure } from "../utils";
import { Howl } from "howler";
import "emoji-mart/css/emoji-mart.css";
import Drawer from "./Drawer";

const sendMessageSound = new Howl({
  src: ["/knob.mp3"],
  volume: 0.5,
});
interface MessengerProps {
  match: match<{ conversationId: string }>;
}

const Messenger: React.FC<MessengerProps> = ({ match }) => {
  const { messengerLoadingAction, sendingMessageAction, resetUnreadAction } =
    useActions();

  const { messenger, auth } = useTypedSelector(({ messenger, auth }) => ({
    messenger,
    auth,
  }));

  // socket connection
  const [socket, modifySocket] = useState<SocketIOClient.Socket>();
  useEffect(() => {
    const socket = socketInit();
    modifySocket(socket);
  }, []);

  // fetching data
  useEffect(() => {
    messengerLoadingAction();
  }, []);

  // event handlers
  const onSend = (message: string, e: FormEvent) => {
    if (!match.params.conversationId || !socket) {
      console.log("ERROR!");
      return;
    }

    sendingMessageAction(
      message,
      match.params.conversationId,
      ensure(auth.user)._id,
      socket
    );
    sendMessageSound.play();
  };

  const onResetUnread = (conversationId: string) => {
    if (!socket) {
      console.log("ERROR!");
      return;
    }
    resetUnreadAction(conversationId, socket);
  };

  return (
    <Box>
      <Box height="100vh" bgcolor={"rgb(251 251 251)"}>
        {messenger.loading ? (
          <Loader />
        ) : (
          <Drawer
            Content={
              <ConversationsList
                conversations={messenger.conversations}
                resetUnread={onResetUnread}
                active={match.params.conversationId}
              />
            }
            Main={
              match.params.conversationId && (
                <Conversation
                  key={match.params.conversationId}
                  conversation={
                    messenger.conversations[match.params.conversationId]
                  }
                  user={ensure(auth.user)}
                  onSend={onSend}
                  resetUnread={onResetUnread}
                />
              )
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default Messenger;
