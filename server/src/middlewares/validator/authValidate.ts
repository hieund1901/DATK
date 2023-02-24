import asyncHandler from "../../utils/asyncHandler";
import {validate} from 'class-validator'
import {plainToClass} from "class-transformer";
import {ResgisterInputDto} from "../../common/dto/auth.dto";
import {BadRequestError} from "../../common/error";

export const RegisterInputDtoValidator = asyncHandler(async (req, res, next) => {
    const errs = await validate(plainToClass(ResgisterInputDto, req.body));
    if (errs.length > 0) throw new BadRequestError({data: errs});
    return next!();
})


