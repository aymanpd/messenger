import React, { FormEvent, useEffect, useRef } from "react";
import Message from "./Message";
import { Box, makeStyles } from "@material-ui/core";
import MessageForm from "./MessengerForm";
import moment from "moment";
import { Conversation as ConversationType, User } from "../state";
import { ensure } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflow: "hidden",
    padding: "0 40px 0 0",
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  messages: {
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none",
    },
    height: "90vh",
    overflowY: "scroll",
    overflowAnchor: "none",
  },
}));

const timeDiffrence = (a: string, b: string): number =>
  moment(a).diff(moment(b), "minutes");
interface ConversationProps {
  conversation: ConversationType;
  onSend: (message: string, event: FormEvent) => void;
  user: User;
  resetUnread: (conversationId: string) => void;
}

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  onSend,
  user,
  resetUnread,
}) => {
  const messagesBox = useRef<HTMLDivElement | null>(null);
  const classes = useStyles();

  useEffect(() => {
    if (messagesBox && messagesBox.current) {
      messagesBox.current.scrollTo(0, messagesBox.current.scrollHeight);
    }
  }, [conversation.messages.length]);

  // refactor
  const lastSeen: {
    [key: string]: string[];
  } = Object.values(conversation.lastSeen).reduce<{
    [key: string]: string[];
  }>((prev, curr: string) => ({ ...prev, [curr]: [] }), {});

  Object.keys(conversation.lastSeen).forEach((member) =>
    lastSeen[conversation.lastSeen[member]].push(
      ensure(conversation.members.find((user) => user._id === member)).picture
    )
  );

  const lastSeenMessageindex = conversation.messages.findIndex(
    (message) => Object.values(conversation.lastSeen)[0] === message._id
  );
  return (
    <Box
      onClick={() => conversation.unread !== 0 && resetUnread(conversation._id)}
      className={classes.root}
    >
      <div ref={messagesBox} className={classes.messages}>
        {conversation.messages.map((message, index) => (
          <div>
            <Message
              key={message._id}
              withTime={
                index === 0 ||
                timeDiffrence(
                  message.createdAt,
                  conversation.messages[index - 1].createdAt
                ) > 15
              }
              withState={lastSeenMessageindex < index}
              message={message}
              lastSeenPictures={lastSeen[message._id] || []}
              user={user}
              from={
                message.from
                  ? ensure(
                      conversation.members.find(
                        (member) => member._id === message.from
                      )
                    )
                  : user
              }
            />
          </div>
        ))}
      </div>
      <MessageForm onSend={onSend} />
    </Box>
  );
};

export default Conversation;
