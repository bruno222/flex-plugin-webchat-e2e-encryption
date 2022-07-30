import { box, randomBytes } from "tweetnacl";
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";

const { encode: encodeUInt8, decode: decodeUInt8 } = require("uint8-to-base64");

const newNonce = () => randomBytes(box.nonceLength);
let secretOrSharedKey: Uint8Array;
const keyPair = box.keyPair();

export const myPublicKey = () => encodeUInt8(keyPair.publicKey);
console.log("myPublicKey", myPublicKey(), box.nonceLength);
let lastOtherPublicKey: string;

export const init = (otherPublicKey: string) => {
    if (lastOtherPublicKey === otherPublicKey) {
        return;
    }
    const otherPublicKeyAsUInt8 = decodeUInt8(otherPublicKey);
    secretOrSharedKey = box.before(otherPublicKeyAsUInt8, keyPair.secretKey);
    lastOtherPublicKey = otherPublicKey;
    console.log("@@@ init", otherPublicKey, secretOrSharedKey);
};

export const decrypt = (messageWithNonce: string) => {
    const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(box.nonceLength, messageWithNonce.length);

    const decrypted = box.open.after(message, nonce, secretOrSharedKey);

    if (!decrypted) {
        throw new Error("Could not decrypt message");
    }

    const base64DecryptedMessage = encodeUTF8(decrypted);
    return base64DecryptedMessage;
};

export const encrypt = (msg: string) => {
    const nonce = newNonce();
    const messageUint8 = decodeUTF8(msg);
    const encrypted = box.after(messageUint8, nonce, secretOrSharedKey);

    const fullMessage = new Uint8Array(nonce.length + encrypted.length);
    fullMessage.set(nonce);
    fullMessage.set(encrypted, nonce.length);

    const base64FullMessage = encodeBase64(fullMessage);
    return base64FullMessage;
};
