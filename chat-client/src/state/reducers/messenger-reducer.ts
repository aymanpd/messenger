import { Conversation } from "../data";
import { Action } from "../actions";
import ActionTypes from "../action-types";
import { produce } from "immer";

export const a = 1;

interface MessengerState {
  loading: boolean;
  conversations: { [key: string]: Conversation };
  error: string;
}

const initialState: MessengerState = {
  loading: false,
  conversations: {},
  error: "",
};

const messengerReducer = produce((state, action: Action): MessengerState => {
  switch (action.type) {
    case ActionTypes.MESSENGER_LOADING: {
      state.loading = true;
      return state;
    }
    case ActionTypes.MESSENGER_LOADED: {
      state.loading = false;
      const { error, data } = action.payload;
      if (error !== "") {
        state.conversations = {};
        state.error = error;
        return state;
      }
      state.conversations =
        data.length === 0
          ? {}
          : data.reduce<{ [key: string]: Conversation }>(
              (prev: { [key: string]: Conversation }, curr: Conversation) => ({
                ...prev,
                [curr._id]: { ...curr, page: 1 },
              }),
              {}
            );
      return state;
    }

    case ActionTypes.RECIEVING_MESSAGE: {
      const { message } = action.payload;
      state.conversations[message.conversationId].messages.push(message);
      state.conversations[message.conversationId].unread++;
      return state;
    }
    case ActionTypes.RECIEVING_MESSAGE_INFO: {
      const { message, localId } = action.payload;
      const index = state.conversations[
        message.conversationId
      ].messages.findIndex((_message) => _message._id === localId);
      state.conversations[message.conversationId].messages[index] = message;
      return state;
    }

    case ActionTypes.SENDING_MESSAGE: {
      const message = action.payload;
      state.conversations[message.conversationId].messages.push(message);
      return state;
    }

    case ActionTypes.RESET_UNREAD: {
      state.conversations[action.payload].unread = 0;
      return state;
    }
    case ActionTypes.UPDATE_LASTSEEN: {
      const { conversationid, lastSeen } = action.payload;
      state.conversations[conversationid].lastSeen = lastSeen;
      return state;
    }
    default:
      return state;
  }
}, initialState);

export default messengerReducer;
