import { Action } from "../actions";
import { produce } from "immer";
import { User } from "../data";
import ACTIONTYPE from "../action-types";

interface AuthState {
  loading: boolean;
  error: string;
  user: User | undefined;
}

const initialState: AuthState = {
  loading: false,
  error: "",
  user: undefined,
};

const authReducer = produce((state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case ACTIONTYPE.AUTH_LOADING: {
      state.loading = true;
      state.error = "";
      return state;
    }
    case ACTIONTYPE.Auth_COMPLETED: {
      const { error, data } = action.payload;
      state.loading = false;
      state.error = error;
      state.user = data;
      return state;
    }
    default:
      return state;
  }
}, initialState);

export default authReducer;
