import { Dispatch } from "react";
import axiosInstance from "../../axiosInstance";
import ACTIONTYPE from "../action-types";
import ActionType from "../action-types";
import guid from "guid";
import {
  RecievingMessageAction,
  UpdateLastSeenAction,
  Action,
  RecievingMessageInfoAction,
} from "../actions";
import { Message, User } from "../data";

export const messengerLoadingAction =
  () => async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.MESSENGER_LOADING,
    });

    try {
      const res = await axiosInstance.get(`/messaging/conversations`);
      dispatch({
        type: ActionType.MESSENGER_LOADED,
        payload: {
          data: res.data,
          error: "",
        },
      });
    } catch (e) {
      dispatch({
        type: ActionType.MESSENGER_LOADED,
        payload: {
          data: [],
          error: e.data,
        },
      });
    }
  };

export const recievingMessageAction = (
  message: Message
): RecievingMessageAction => ({
  type: ActionType.RECIEVING_MESSAGE,
  payload: {
    message,
  },
});

export const recievingMessageInfoAction = (
  message: Message,
  localId: string
): RecievingMessageInfoAction => ({
  type: ActionType.RECIEVING_MESSAGE_INFO,
  payload: {
    message,
    localId,
  },
});

export const sendingMessageAction =
  (
    text: string,
    conversationId: string,
    from: string,
    socket: SocketIOClient.Socket
  ) =>
  (dispatch: Dispatch<Action>) => {
    const message: Message = {
      text,
      conversationId,
      createdAt: Date.now().toString(),
      from,
      state: "sending",
      _id: guid.raw(),
    };
    try {
      socket.emit("sendMessage", message);
    } catch (e) {
      console.log("error sending message: ", e);
    }
    dispatch({
      type: ActionType.SENDING_MESSAGE,
      payload: message,
    });
  };

export const resetUnreadAction =
  (conversationId: string, socket: SocketIOClient.Socket) =>
  (dispatch: Dispatch<Action>) => {
    try {
      socket.emit("resetUnread", { conversationId });
    } catch (e) {
      console.log("error resetting unread: ", e);
    }
    dispatch({
      type: ActionType.RESET_UNREAD,
      payload: conversationId,
    });
  };

export const updateLastSeenAction = (
  conversationid: string,
  lastSeen: {
    [key: string]: string;
  }
): UpdateLastSeenAction => ({
  type: ActionType.UPDATE_LASTSEEN,
  payload: {
    conversationid,
    lastSeen,
  },
});

// Auth

export const authLoading = () => async (dispatch: Dispatch<Action>) => {
  dispatch({
    type: ACTIONTYPE.AUTH_LOADING,
  });

  try {
    const response: { data: User } = await axiosInstance.get("/users/me", {
      timeout: 5000,
    });
    dispatch({
      type: ActionType.Auth_COMPLETED,
      payload: { error: "", data: response.data },
    });
  } catch (e) {
    dispatch({
      type: ActionType.Auth_COMPLETED,
      payload: { error: e.data, data: undefined },
    });
  }
};
