import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import ConversationCard from "./ConversationCard";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflowY: "scroll",
    padding: "20px 10px 0 80px",
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
}));

const ConversationsList = ({ conversations, user, resetUnRead, active }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box height='101%'>
        {conversations &&
          Object.keys(conversations).map((id) => (
            <ConversationCard
              key={id}
              user={user}
              conversation={conversations[id]}
              resetUnRead={resetUnRead}
              active={active == id}
            />
          ))}
      </Box>
    </Box>
  );
};

export default ConversationsList;
