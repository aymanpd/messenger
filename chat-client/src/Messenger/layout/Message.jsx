import React, { useMemo } from "react";
import { Box, makeStyles } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: (props) => props.flexDirection,
    marginBottom: "2.6rem",
  },
  img: {
    width: "40px",
    height: "40px",
    margin: "0 1.5rem ",
    borderRadius: "50%",
  },
  messageContainer: {
    maxWidth: "50%",
  },
  message: {
    backgroundColor: (props) => props.backgroundColor,
    borderRadius: (props) => props.borderRadius,
    color: (props) => props.color,
    whiteSpace: "break-spaces",
    marginBottom: "5px",
    padding: "12px 20px",
  },
  lastSeen: {
    textAlign: "right",
    "& img": {
      width: "15px",
      height: "15px",
      borderRadius: "50%",
    },
  },
  time: {
    textAlign: "center",
    margin: 10,
    color: "#949494",
  },
}));

const homeMessageStyles = {
  backgroundColor: "#FFF",
  flexDirection: "row",
  color: "#333",
  borderRadius: "8px 8px 8px 0",
};

const awayMessageStyles = {
  backgroundColor: "#4343a7",
  flexDirection: "row-reverse",
  color: "rgb(217 217 230)",
  borderRadius: "8px 8px 0 8px ",
};

const getMessageType = (user, from) => {
  return from._id !== user._id ? "away" : "home";
};

const Message = ({ message, user, from, withTime, lastSeen }) => {
  const messageType = useMemo(() => getMessageType(user, from), []);
  const classes = useStyles(
    messageType == "away" ? awayMessageStyles : homeMessageStyles
  );
  const createdAt = moment(message.createdAt);
  const messageTime =
    moment().diff(createdAt, "days") == 0
      ? createdAt.format("LT")
      : createdAt.format("ddd LT");

  return (
    <>
      <Box className={classes.time}>{withTime && messageTime}</Box>
      <Box className={classes.root}>
        <img className={classes.img} src={from.picture} alt='profile pic' />
        <Box className={classes.messageContainer}>
          <Box className={classes.message}>{message.text}</Box>
          <Box className={classes.lastSeen}>
            {lastSeen.map((pic) => (
              <img title='seen' src={pic} />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Message;
