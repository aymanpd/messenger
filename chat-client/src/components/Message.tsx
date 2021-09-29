import React, { useMemo } from "react";
import { Box, makeStyles } from "@material-ui/core";
import moment from "moment";
import { Message as MessageType, User } from "../state";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // @ts-ignore
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
    backgroundColor: (props: any) => props.backgroundColor,
    borderRadius: (props: any) => props.borderRadius,
    color: (props: any) => props.color,
    whiteSpace: "break-spaces",
    marginBottom: "5px",
    padding: "12px 20px",
    [theme.breakpoints.up("md")]: {
      backgroundColor: "red",
    },
  },
  lastSeen: {
    "& img": {
      width: "15px",
      display: "block",
      height: "15px",
      borderRadius: "50%",
      marginTop: "-10px",
    },
  },
  state: {
    color: "#adadad",
    marginTop: "-10px",
    "& svg": {
      fontSize: "15px",
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

const getMessageType = (user: string, from: string): string => {
  return from !== user ? "away" : "home";
};

const renderIcon = (state: "sending" | "sent" | "delivered") => {
  if (state === "sending")
    return (
      <span title='Sending'>
        <RadioButtonUncheckedIcon />
      </span>
    );
  if (state === "sent")
    return (
      <span title='sent'>
        <CheckCircleOutlineIcon />
      </span>
    );
  return (
    <span title='delivered'>
      <CheckCircleIcon />
    </span>
  );
};

interface MessageProps {
  message: MessageType;
  user: User;
  from: User;
  withTime: boolean;
  lastSeenPictures: string[];
  withState: boolean;
}

const Message: React.FC<MessageProps> = ({
  message,
  user,
  from,
  withTime,
  lastSeenPictures,
  withState,
}) => {
  const messageType = useMemo(() => getMessageType(user._id, from._id), [
    user._id,
    from._id,
  ]);
  const classes = useStyles(
    messageType === "away" ? awayMessageStyles : homeMessageStyles
  );
  const createdAt = moment(message.createdAt);
  const messageTime =
    moment().diff(createdAt, "days") === 0
      ? createdAt.format("LT")
      : createdAt.format("ddd LT");

  return (
    <>
      <Box className={classes.time}>{withTime && messageTime}</Box>
      <Box className={classes.root}>
        <img className={classes.img} src={from.picture} alt='profile pic' />
        <Box className={classes.messageContainer}>
          <Box className={classes.message}>{message.text}</Box>
          {lastSeenPictures.length > 0 && (
            <Box className={classes.lastSeen}>
              {lastSeenPictures.map((pic) => (
                <img key={pic} title='seen' alt='seen pic' src={pic} />
              ))}
            </Box>
          )}
          {withState && messageType === "home" && (
            <Box className={classes.state}>{renderIcon(message.state)}</Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Message;
