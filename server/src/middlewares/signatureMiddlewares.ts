import asyncHandler from '../utils/asyncHandler';
import {BadRequestError} from "../common/error";
import {sign, verify} from "../utils/signature";
import * as appStatus from '../common/const/appStatus';

export const verifySignature = asyncHandler(async (req, res, next) => {
    if (req.body.signature === null) {
        throw new BadRequestError({message: 'Signature required!', appStatus: appStatus.VERIFY_SIGNATURE_FAILED});
    }
    const {signature} = req.body;
    const data = {...req.body, signature: undefined};
    const isVerified = verify(data, signature);
    if (!isVerified) {
        throw new BadRequestError({message: 'Verify signature failed!', appStatus: appStatus.VERIFY_SIGNATURE_FAILED});
    }
    return next!();
});

export const createSignature = ((data) => {
    return sign(data);
});