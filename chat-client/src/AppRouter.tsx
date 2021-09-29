import React from "react";
// import theme from "./theme";
import { BrowserRouter, Route } from "react-router-dom";
import Messenger from "./components/Messenger";
import LoginPage from "./LoginPage";
import PrivateRoute from "./PrivateRoute";
const AppRouter = () => {
  return (
    <div>
      <BrowserRouter>
        <Route path='/' exact component={LoginPage}></Route>
        <PrivateRoute
          path='/messenger/:conversationId?'
          exact
          component={Messenger}
        ></PrivateRoute>
      </BrowserRouter>
    </div>
  );
};

export default AppRouter;
