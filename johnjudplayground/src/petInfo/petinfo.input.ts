import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsUrl, Length, MaxLength, MinLength } from "class-validator";
import { Double } from "mongodb";
//import { Double } from "mongodb";
//import {User} from 'src/user/user.entity';

@InputType()
export class petinfoinput{

    @Field()
    petid: string;

    @IsNotEmpty()
    @Field()
    PetName: string;

    @Field()
    PetBreed: string;

    @IsNotEmpty()
    @Field()
    PetGender: string;

    @IsNotEmpty()
    @Field()
    Type: string;

    @IsNotEmpty()
    @Field()
    PetPicURL: string;

    @Field()
    DelPicURL: string;

    @Field()
    PetStatus: string;

    //@IsNumber()
    @Field()
    PetLength: number;

    //@IsNumber()
    @Field()
    PetHeight: number;

    @Field()
    PetCerURL: string;

    @Field()
    TimeStampUpdate: Date;

    @Field()
    UserId: string;

    @Field()
    AdopUserId: string;

    @Field()
    CodePet: string;

    @Field()
    CheckCode: boolean;

    @Field()
    TimeUpdate: Date;

    @Field()
    Describe: string;

    @Field()
    PetAddress: string;

    @Field()
    GenCode: string;

}