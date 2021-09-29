import { store } from "../";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../action-creators";

export const useActions = () => {
  const dispatch = store.dispatch;
  return bindActionCreators(ActionCreators, dispatch);
};
