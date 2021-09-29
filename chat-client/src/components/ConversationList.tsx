import React, { useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import ConversationCard from "./ConversationCard";
import { Conversation } from "../state";
import { useTypedSelector } from "../state/hooks";
import { ensure } from "../utils";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
// import axiosInstance from "../axiosInstance";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(() => ({
  root: {
    height: "100vh",
    overflowY: "scroll",
    padding: "10px ",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
      margin: "20px 0 860px ",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "hsl(225deg 12% 81% / 52%)",
      height: "20px",
    },
  },
  addFriend: {
    display: "flex",
    justifyContent: "space-evenly",
    borderTop: "1px solid #adadad",
    paddingTop: "1.5rem",
    marginBottom: "1rem",
    "& input": {
      padding: "5px 5px",
    },
    "& button": {
      display: "inline-block",
      marginLeft: "5px",
      padding: "5px 8px",
      backgroundColor: "#ff7754",
      color: "#FFF",
      border: "none",
      cursor: "pointer",
      "& svg": {
        fontSize: "1.2rem",
        verticalAlign: "sub",
      },
    },
  },
}));

//friend request

interface requestResponse {
  error: string | undefined;
  loading: boolean;
  success: boolean;
}
const sendFriendRequest = (
  handler: string,
  modifyResponse: React.Dispatch<React.SetStateAction<requestResponse>>
): void => {
  modifyResponse({ error: "Wrong handler", loading: false, success: false });
};

interface ConversationsListProps {
  conversations: { [key: string]: Conversation };
  resetUnread: (conversationid: string) => void;
  active: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  resetUnread,
  active,
}) => {
  const classes = useStyles();
  const user = ensure(useTypedSelector(({ auth }) => auth.user));
  const [friendInput, modifyFriendInput] = useState<string>("");
  const [response, modifyResponse] = useState<requestResponse>({
    loading: false,
    success: false,
    error: undefined,
  });
  return (
    <Box className={classes.root}>
      <Box height="101%">
        {conversations &&
          Object.keys(conversations).map((id) => (
            <ConversationCard
              key={id}
              user={user}
              conversation={conversations[id]}
              resetUnread={resetUnread}
              active={active === id}
            />
          ))}
        <Box className={classes.addFriend}>
          <input
            onChange={(e) => modifyFriendInput(e.target.value)}
            value={friendInput}
            type="text"
            placeholder="@handle"
          />
          <button
            onClick={(e) => sendFriendRequest(friendInput, modifyResponse)}
          >
            Add <GroupAddIcon />
          </button>
        </Box>
        {!response.loading && response.error && (
          <Alert severity="warning">wrong handler</Alert>
        )}
      </Box>
    </Box>
  );
};

export default ConversationsList;
