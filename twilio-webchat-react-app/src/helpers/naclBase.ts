import { box, randomBytes } from "tweetnacl";
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";

const { encode: encodeUInt8, decode: decodeUInt8 } = require("uint8-to-base64");

export class NaclBase {
    secretOrSharedKey?: Uint8Array;
    keyPair = box.keyPair();

    constructor(otherPartyPublicKey?: string) {
        otherPartyPublicKey && this.init(otherPartyPublicKey);
    }

    private newNonce = () => randomBytes(box.nonceLength);

    init = (otherPartyPublicKey: string) => {
        const otherPartyPublicKeyAsUInt8 = decodeUInt8(otherPartyPublicKey);
        this.secretOrSharedKey = box.before(otherPartyPublicKeyAsUInt8, this.keyPair.secretKey);
    };

    myPublicKey = () => encodeUInt8(this.keyPair.publicKey);

    encrypt = (msg: string) => {
        const nonce = this.newNonce();
        const messageUint8 = decodeUTF8(msg);
        const encrypted = box.after(messageUint8, nonce, this.secretOrSharedKey!);
        const fullMessage = new Uint8Array(nonce.length + encrypted.length);
        fullMessage.set(nonce);
        fullMessage.set(encrypted, nonce.length);
        return encodeBase64(fullMessage);
    };

    decrypt = (messageWithNonce: string) => {
        const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
        const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
        const message = messageWithNonceAsUint8Array.slice(box.nonceLength, messageWithNonce.length);
        const decrypted = box.open.after(message, nonce, this.secretOrSharedKey!);

        if (!decrypted) {
            throw new Error("Could not decrypt message");
        }

        return encodeUTF8(decrypted);
    };
}
