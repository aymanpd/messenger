import ActionType from "../action-types";
import { Conversation, Message, User } from "../data";

export interface MessengerLoadingAction {
  type: ActionType.MESSENGER_LOADING;
}

export interface MessengerLoadedAction {
  type: ActionType.MESSENGER_LOADED;
  payload: {
    data: Conversation[];
    error: string;
  };
}

export interface RecievingMessageAction {
  type: ActionType.RECIEVING_MESSAGE;
  payload: {
    message: Message;
  };
}

export interface RecievingMessageInfoAction {
  type: ActionType.RECIEVING_MESSAGE_INFO;
  payload: {
    message: Message;
    localId: string;
  };
}

export interface SendingMessageAction {
  type: ActionType.SENDING_MESSAGE;
  payload: Message;
}

export interface ResetUnreadAction {
  type: ActionType.RESET_UNREAD;
  payload: string;
}

export interface UpdateLastSeenAction {
  type: ActionType.UPDATE_LASTSEEN;
  payload: {
    conversationid: string;
    lastSeen: { [key: string]: string };
  };
}

//Auth
export interface AuthLoadingAction {
  type: ActionType.AUTH_LOADING;
}

export interface AuthCompletedAction {
  type: ActionType.Auth_COMPLETED;
  payload: { data: User | undefined; error: string };
}

export type Action =
  | MessengerLoadingAction
  | MessengerLoadedAction
  | RecievingMessageAction
  | SendingMessageAction
  | ResetUnreadAction
  | UpdateLastSeenAction
  | AuthLoadingAction
  | AuthCompletedAction
  | RecievingMessageInfoAction;
