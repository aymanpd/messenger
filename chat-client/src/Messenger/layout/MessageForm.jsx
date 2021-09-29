import React, { useState } from "react";
import TelegramIcon from "@material-ui/icons/Telegram";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    borderTop: "2px solid #DDD",
    paddingTop: "1rem",
    paddingRight: "15px",
  },
  input: {
    border: "none",
    background: "transparent",
    color: "#EEE",
    padding: "10px 8px",
    marginRight: "1rem",
    flexGrow: 1,
    color: "#333",
    height: "10vh",
    "&:focus": {
      outline: "none",
    },
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#ff7754",
    textAlign: "center",
    color: "#FFF",
    position: "relative",
    cursor: "pointer",
    border: "none",
    "&:focus": {
      outline: "none",
    },
    "& svg": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
}));

const MessageForm = ({ handleSubmit }) => {
  const clases = useStyles();
  const [message, modifyMessage] = useState("");

  return (
    <form
      className={clases.root}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(message, e, modifyMessage);
      }}
    >
      <textarea
        className={clases.input}
        type='text'
        placeholder='Write your  message...'
        value={message}
        onKeyPress={(e) => {
          if (e.key == "Enter" && !e.shiftKey) {
            handleSubmit(message, e, modifyMessage);
          }
        }}
        onChange={(e) => {
          modifyMessage(e.target.value);
        }}
      />
      <button className={clases.icon}>
        <TelegramIcon />
      </button>
    </form>
  );
};

export default MessageForm;
