// const crypto = require('crypto');
import {AES, enc} from "crypto-js";
import _ from 'lodash';
// const privateKey = String(process.env.SIGNATURE_SECRET_KEY).replace(/\\n/g, '\n')
// const publicKey = String(process.env.SIGNATURE_PUBLIC_KEY).replace(/\\n/g, '\n')

export function sign(data) {
    // return crypto.sign("sha256", Buffer.from(JSON.stringify(data)), {
    //     key: privateKey,
    //     padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    // }).toString("base64");
    return AES.encrypt(String(JSON.stringify(data)), process.env.SIGNATURE_AES_PRIVATE_KEY!).toString();
}

export function verify(data, signature) {
    // return crypto.verify(
    //     "sha256", Buffer.from(JSON.stringify(data)),
    //     {
    //         key: publicKey,
    //         padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    //     },
    //     Buffer.from(signature, 'base64')
    // );
    const requestData = _.pick(data, _.identity);
    const signatureData = _.pick(JSON.parse(AES.decrypt(signature, process.env.SIGNATURE_AES_PRIVATE_KEY!).toString(enc.Utf8)), _.identity);
    return _.isEqual(requestData, signatureData);
}