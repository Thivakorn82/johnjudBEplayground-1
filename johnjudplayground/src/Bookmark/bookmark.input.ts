import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsUrl, Length, MaxLength, MinLength } from "class-validator";
//import { Double } from "mongodb";
//import {User} from 'src/user/user.entity';

@InputType()
export class bookmarkinput{

    @Field()
    bmid: string;

    @Field()
    petid: string;

    @Field()
    petPicUrl: string;

    @Field()
    UserIdBookmark: string;

    @Field()
    bmStatus: Boolean;

    @Field()
    PetName: string;
}