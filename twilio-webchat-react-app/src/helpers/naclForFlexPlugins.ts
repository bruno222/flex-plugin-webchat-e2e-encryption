import { NaclBase } from "./naclBase";

interface Channels {
    [key: string]: NaclBase;
}
class ChannelEncrypt {
    channels: Channels = {};
    constructor() {}

    init = (chSid: string, otherPartyPublicKey: string) => {
        console.log("@@@ ChannelEncrypt init - chSid: ", chSid);
        this.channels[chSid] = new NaclBase(otherPartyPublicKey);
    };

    destroy = (chSid: string) => delete this.channels[chSid];
    encrypt = (chSid: string, msg: string) => this.channels[chSid].encrypt(msg);
    decrypt = (chSid: string, msg: string) => this.channels[chSid].decrypt(msg);
    myPublicKey = (chSid: string) => this.channels[chSid].myPublicKey();
}

export const encrypt = new ChannelEncrypt();
