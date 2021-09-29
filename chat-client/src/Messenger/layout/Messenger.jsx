import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { Box, Grid } from "@material-ui/core";
import Conversation from "./Conversation";
import ConversationsList from "./ConversationsList";
import { connect } from "react-redux";
import Loader from "../../Loader/Loader";
import socketInit from "../socket-init";

import * as messengerActions from "../redux/messengerReducer";

const Messenger = ({
  match,
  auth,
  messenger,
  loadMessenger,
  sendMessage,
  resetUnRead,
}) => {
  // socket connection
  const [socket, modifySocket] = useState();
  useEffect(() => {
    const socket = socketInit();
    modifySocket(socket);
  }, []);

  // fetching data
  useEffect(() => {
    loadMessenger();
  }, []);

  // event handlers
  const onSend = (message, e, modifyMessage) => {
    modifyMessage("");
    sendMessage(
      { text: message, conversationId: match.params.conversationId },
      socket
    );
  };

  const onResetUnread = (conversationId, userId) => {
    resetUnRead(conversationId, userId, socket);
  };

  const getTitle = (conversations) =>
    conversations &&
    Object.values(conversations).find(
      (conversation) => conversation.unRead != 0
    )
      ? "Unread Message"
      : "Messenger";

  return (
    <Box>
      <Helmet>
        <title>{getTitle(messenger.conversations)}</title>
      </Helmet>
      <Box bgcolor={"rgb(251 251 251)"}>
        {messenger.loading ? (
          <Loader />
        ) : (
          <Grid container>
            <Grid item md={4} lg={3}>
              <ConversationsList
                user={auth.user}
                conversations={messenger.conversations}
                resetUnRead={onResetUnread}
                active={match.params.conversationId}
              />
            </Grid>
            <Grid item md={8} lg={9}>
              {match.params.conversationId && (
                <Conversation
                  conversation={
                    messenger.conversations[match.params.conversationId]
                  }
                  user={auth.user}
                  onSend={onSend}
                  resetUnRead={onResetUnread}
                />
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ auth, messenger: { loading, ...rest } }) => ({
  auth,
  messenger: { loading, conversations: rest },
});

export default connect(mapStateToProps, messengerActions)(Messenger);
