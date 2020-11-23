import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUrl, Length, Matches, MaxLength, MinLength } from "class-validator";

@InputType()
export class RegisterInput{
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Field()
    UserName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password is too weak!' },
    )
    @Field()
    Password: string;

    @IsNotEmpty()
    @Field()
    FirstName: string;

    @IsNotEmpty()
    @Field()
    LastName: string;

    @IsNotEmpty()
    // @IsDateString()
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
    @IsString()
    @Field()
    Address: string;
}