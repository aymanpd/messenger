import React from "react";
import { makeStyles } from "@material-ui/core";
import googleLogo from "./icons8-google.svg";

const useStyles = makeStyles({
  root: {
    display: "flex",
    color: "#333",
    "&, &:visited,&:hover": {
      textDecoration: "none",
    },
  },
  text: {
    alignSelf: "center",
  },
});

const GoogleButton = () => {
  const classes = useStyles();

  return (
    <a
      href={process.env.REACT_APP_BASE_URL + "/users/google"}
      className={classes.root}
    >
      <img src={googleLogo} alt="React Logo" />
      <span className={classes.text}>Login with google</span>
    </a>
  );
};

export default GoogleButton;
