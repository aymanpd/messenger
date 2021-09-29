import React, { FormEvent, useRef, useState } from "react";
import TelegramIcon from "@material-ui/icons/Telegram";
import { makeStyles } from "@material-ui/core";
import EmojiPicker from "./emojiPicker";

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
    [theme.breakpoints.down("sm")]: {
      width: 40,
      height: 40,
    },
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

interface MessageFormProps {
  onSend: (message: string, e: FormEvent) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSend }) => {
  const clases = useStyles();
  const [message, modifyMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;
    console.log("!");
    onSend(message.trimEnd(), e);
    modifyMessage("");
  };

  return (
    <form ref={formRef} className={clases.root} onSubmit={onSubmit}>
      <textarea
        className={clases.input}
        placeholder='Write your  message...'
        value={message}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            onSubmit(e);
          }
        }}
        onChange={(e) => {
          modifyMessage(e.target.value);
        }}
      />
      <EmojiPicker
        value={message}
        onSelection={(value) => modifyMessage(value)}
      />
      <button className={clases.icon}>
        <TelegramIcon />
      </button>
    </form>
  );
};

export default MessageForm;
