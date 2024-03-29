import React from "react";
import { Provider } from "react-redux";
import { store } from "./state";
import AppRouter from "./AppRouter";

const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

export default App;
