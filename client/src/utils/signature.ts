// const crypto = require('crypto');
import {AES} from "crypto-js";

// const privateKey = String(process.env.SIGNATURE_SECRET_KEY).replace(/\\n/g, '\n')
// const publicKey = String(process.env.SIGNATURE_PUBLIC_KEY).replace(/\\n/g, '\n')

export function sign(data){
    // return crypto.sign("sha256", Buffer.from(JSON.stringify(data)), {
    //     key: privateKey,
    //     padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    // }).toString("base64");
    return AES.encrypt(String(JSON.stringify(data)), process.env.SIGNATURE_AES_PRIVATE_KEY!).toString();
}