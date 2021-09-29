import { combineReducers } from "redux";
import messengerReducer from "./messenger-reducer";
import authReducer from "./auth-reducer";

const reducers = combineReducers({
  messenger: messengerReducer,
  auth: authReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
