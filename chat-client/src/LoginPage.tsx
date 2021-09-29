import React, { useEffect } from "react";
import Loader from "./Loader/Loader";
import { Box, makeStyles } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import GoogleButton from "./GoogleButton/GoogleButton";
import { useActions, useTypedSelector } from "./state/hooks";

const useStyles = makeStyles({
  VerticalAlign: {
    position: "absolute",
    top: "50%",
    left: " 50%",
    transform: "translate(-50%, -50%)",
  },
});

const LoginPage: React.FC = () => {
  const { authLoading } = useActions();
  const auth = useTypedSelector(({ auth }) => auth);
  useEffect(() => {
    !auth.user && authLoading();
    // warning
  }, []);

  const classes = useStyles();
  return (
    <>
      {auth.loading && <Loader />}
      {!auth.loading && !auth.user && (
        <Box className={classes.VerticalAlign}>
          <GoogleButton />
        </Box>
      )}
      {auth.user && <Redirect to='/messenger'></Redirect>}
    </>
  );
};

export default LoginPage;
