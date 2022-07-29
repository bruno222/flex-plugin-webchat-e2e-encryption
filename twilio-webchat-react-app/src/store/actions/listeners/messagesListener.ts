import { Conversation, Message } from "@twilio/conversations";
import { Dispatch } from "redux";
import { decrypt } from "../../../helpers/nacl";

import { ACTION_ADD_MESSAGE, ACTION_REMOVE_MESSAGE, ACTION_UPDATE_MESSAGE } from "../actionTypes";

export interface MessageDecrypted extends Message {
    bodyDecrypted?: string;
}

export const initMessagesListener = (conversation: Conversation, dispatch: Dispatch) => {
    conversation.addListener("messageAdded", (message: MessageDecrypted) => {
        message.bodyDecrypted = message.body ? decrypt(message.body) : message.body;

        dispatch({
            type: ACTION_ADD_MESSAGE,
            payload: { message }
        });
    });
    conversation.addListener("messageRemoved", (message: Message) => {
        dispatch({
            type: ACTION_REMOVE_MESSAGE,
            payload: { message }
        });
    });
    conversation.addListener("messageUpdated", ({ message }) => {
        dispatch({
            type: ACTION_UPDATE_MESSAGE,
            payload: { message }
        });
    });
};
