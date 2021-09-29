import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import authReducer from "./Login/authReducer";
import messengerReducer from "./Messenger/redux/messengerReducer";

const store = createStore(
  combineReducers({
    auth: authReducer,
    messenger: messengerReducer,
  }),
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

export default store;
