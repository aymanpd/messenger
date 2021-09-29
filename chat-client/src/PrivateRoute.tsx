import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useTypedSelector } from "./state/hooks";

interface PrivateRouteProps extends RouteProps {
  component: React.FC<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const auth = useTypedSelector(({ auth }) => auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        return auth.user ? <Component {...props} /> : <Redirect to='/' />;
      }}
    ></Route>
  );
};

export default PrivateRoute;
