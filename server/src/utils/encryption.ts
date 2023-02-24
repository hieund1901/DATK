import {AES} from 'crypto-js';
import {compare, genSalt, hash} from 'bcryptjs';

export const decodePassword = (cipher: string) => AES.decrypt(cipher, process.env.ENCODE_PWD_KEY!).toString();

export const hashPassword = async (plainPwd: string) => {
    const salt = await genSalt();
    return hash(`${plainPwd}${process.env.PASSWORD_PEPPER}`, salt);
}

export const comparePassword = (hash: string, plainPwd: string) => {
    return compare(`${plainPwd}${process.env.PASSWORD_PEPPER}`, hash);
}

