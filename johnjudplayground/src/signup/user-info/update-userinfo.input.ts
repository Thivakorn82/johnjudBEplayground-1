import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsDateString, IsEmail, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsPhoneNumber, IsUrl, Length, MaxLength, MinLength } from "class-validator";

@InputType()
export class UpdateUserInfoInput{
    @Field()
    UserName: string;

    @Field()
    Password: string;

    @IsNotEmpty()
    @Field()
    FirstName: string;

    @IsNotEmpty()
    @Field()
    LastName: string;

    // @IsNotEmpty()
    // @IsUrl()
    @Field()
    ProfilePicURL: string;

    @IsNotEmpty()
    // @IsDate()
    @IsDateString()
    @Field()
    Birthday: Date;

    @IsNotEmpty()
    @Field()
    Gender: string;

    @IsNotEmpty()
    @IsPhoneNumber("TH")
    @Field()
    PhoneNo: string;

    @IsNotEmpty()
    @IsEmail()
    @Field()
    Email: string;

    @IsNotEmpty()
    @IsLatitude()
    @Field()
    LocationLat: string;

    @IsNotEmpty()
    @IsLongitude()
    @Field()
    LocationLong: string;

    @Field()
    AvgPoint: Number;
    
    @Field()
    Description: string;

    @IsNotEmpty()
    // @IsDate()
    @IsDateString()
    @Field()
    TimeUpdate: Date;
}