import { Conversation, Participant } from "@twilio/conversations";
import { Dispatch } from "redux";
import { init } from "../../../helpers/nacl";

import {
    ACTION_ADD_AGENT_PUBLIC_KEY,
    ACTION_ADD_PARTICIPANT,
    ACTION_REMOVE_PARTICIPANT,
    ACTION_UPDATE_PARTICIPANT
} from "../actionTypes";

export const initParticipantsListener = (conversation: Conversation, dispatch: Dispatch) => {
    conversation.addListener("updated", ({ conversation: _conversation, updateReasons }) => {
        console.log("@@@ updated - conversation: ", _conversation);
        console.log("@@@ updated - updateReasons: ", updateReasons);

        if (!updateReasons.includes("attributes")) {
            return;
        }

        const { agentPublicKey } = _conversation.attributes;

        if (!agentPublicKey) {
            return;
        }

        init(agentPublicKey);

        dispatch({
            type: ACTION_ADD_AGENT_PUBLIC_KEY,
            payload: agentPublicKey
        });
    });

    conversation.addListener("participantJoined", async (participant: Participant) => {
        const user = await participant.getUser();
        dispatch({
            type: ACTION_ADD_PARTICIPANT,
            payload: { participant, user }
        });
    });

    conversation.addListener("participantLeft", (participant: Participant) => {
        dispatch({
            type: ACTION_REMOVE_PARTICIPANT,
            payload: { participant }
        });
    });

    const dispatchParticipantUpdate = (participant: Participant) => {
        dispatch({
            type: ACTION_UPDATE_PARTICIPANT,
            payload: { participant }
        });
    };
    conversation.addListener("participantUpdated", ({ participant }) => dispatchParticipantUpdate(participant));
    conversation.addListener("typingStarted", dispatchParticipantUpdate);
    conversation.addListener("typingEnded", dispatchParticipantUpdate);
};
