import {IsDateString, IsEmail, IsEnum, Length} from 'class-validator';
import {Gender} from '../enum/gender.enum';

export class ResgisterInputDto {
    name: string;
    @IsEmail()
    email: string;

    @Length(6, 50)
    password: string;

    @IsDateString()
    dateOfBirth: string;

    @IsEnum(Gender)
    gender: string;
}