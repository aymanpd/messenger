import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { Box, makeStyles } from "@material-ui/core";
import MessageForm from "./MessageForm";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    padding: "0 40",
    overflow: "hidden",
  },
  messages: {
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none",
    },
    height: "90vh",
    overflowY: "scroll",
  },
}));

const timeDiffrence = (a, b) => moment(a).diff(moment(b), "minutes");

const Conversation = ({ conversation, onSend, user, resetUnRead }) => {
  const conversationBox = useRef(null);

  useEffect(() => {
    conversationBox.current.scrollTo(0, conversationBox.current.scrollHeight);
  }, [conversation.messages.length]);

  const lastSeen = Object.values(conversation.lastSeen).reduce(
    /* {messageId: []} */
    (prev, curr) => ({ ...prev, [curr]: [] }),
    {}
  );

  Object.keys(conversation.lastSeen).forEach((member) =>
    lastSeen[conversation.lastSeen[member]].push(
      conversation.members.find((user) => user._id == member).picture
    )
  );

  const classes = useStyles();
  return (
    <Box
      onClick={() =>
        conversation.unRead != 0 && resetUnRead(conversation._id, "me")
      }
      className={classes.root}
    >
      <Box ref={conversationBox} className={classes.messages}>
        {conversation.messages.map((message, index) => (
          <Message
            key={message._id}
            withTime={
              index == 0 ||
              timeDiffrence(
                message.createdAt,
                conversation.messages[index - 1].createdAt
              ) > 15
            }
            message={message}
            lastSeen={lastSeen[message._id] || []}
            user={user}
            from={
              message.from
                ? conversation.members.find(
                    (member) => member._id == message.from
                  )
                : user
            }
          />
        ))}
      </Box>
      <MessageForm handleSubmit={onSend} />
    </Box>
  );
};

export default Conversation;
