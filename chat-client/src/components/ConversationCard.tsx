import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import moment from "moment";
import { Conversation, User } from "../state";
import { ensure } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginBottom: "1.5rem",
    backgroundColor: "#FFF",
    padding: "10px",
    borderRadius: "5px",
    textDecoration: "none",
    "&:focus, &:active, &:visited": {
      color: "inherit",
    },
    borderLeft: (props: { active: boolean }) =>
      props.active ? "4px solid hsl(12deg 100% 66%)" : "none",
  },
  image: {
    marginRight: "1rem",
    "& img": {
      width: 50,
      height: 50,
      borderRadius: "50%",
    },
  },
  details: {
    flexGrow: 1,
    "& h4": {
      margin: 0,
      color: "hsl(0deg 0% 12%)",
      marginBottom: "5px",
    },
    "& p": {
      margin: 0,
      color: "rgb(189 192 200)",
      fontSize: ".8rem",
    },
  },
  lastSent: {
    display: "block",
    marginBottom: "8px",
    color: "rgb(189 192 200)",
    fontSize: ".8rem",
  },
  unread: {
    display: "block",
    width: 20,
    height: 20,
    lineHeight: "20px",
    margin: "auto",
    fontSize: ".8rem",
    borderRadius: "50%",
    color: "#FFF",
    backgroundColor: "rgb(255 119 84)",
    textAlign: "center",
  },
}));

const sliceText = (conversation: Conversation) =>
  conversation.messages.length > 0 &&
  `${conversation.messages[conversation.messages.length - 1].text.slice(
    0,
    30
  )} ${
    conversation.messages[conversation.messages.length - 1].text.length > 30
      ? "..."
      : ""
  }`;

interface ConversationCardProps {
  conversation: Conversation;
  user: User;
  resetUnread: (conversationId: string) => void;
  active: boolean;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  user,
  resetUnread,
  active,
}) => {
  const classes = useStyles({ active });
  const member = ensure(
    conversation.members.find((member) => member._id !== user._id)
  );

  return (
    <Link
      onClick={() => conversation.unread !== 0 && resetUnread(conversation._id)}
      className={classes.root}
      to={`/messenger/${conversation._id}`}
    >
      <Box className={classes.image}>
        <img alt='conv' src={member.picture} />
      </Box>
      <Box className={classes.details}>
        <h4>{`${member.firstName} ${member.lastName}`}</h4>
        <p>{sliceText(conversation)}</p>
      </Box>
      <Box>
        <span className={classes.lastSent}>
          {conversation.messages.length > 0 &&
            moment(
              conversation.messages[conversation.messages.length - 1].createdAt
            ).fromNow()}
        </span>
        {conversation.unread !== 0 && (
          <span className={classes.unread}>{conversation.unread}</span>
        )}
      </Box>
    </Link>
  );
};

export default ConversationCard;
