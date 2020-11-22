import { Body, Controller, Post, UsePipes, ValidationPipe, Get, Param ,Delete, Patch, HttpException, HttpStatus, UseGuards} from '@nestjs/common';
import { CreateUserInput } from './create-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';
import { petinfo } from 'src/petInfo/petInfo.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('User')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    async findAll(): Promise<User[]>{
        return this.userService.findAll();
    }

    @Get('/:id')
    async findUserId(
        @Param('id') id: string,
    ): Promise<User>{
        return this.userService.findUserId(id);
    }
    
    @Patch(':id/setting/phone')
    @UseGuards(AuthGuard())
    async UpdateUserPhone(@Param('id') id: string,
                          @Body('PhoneNO') PhoneNO: string,
                          @GetUser() User: User
                          ): Promise<User>{
        return this.userService.UpdateUserPhoneNO(id,PhoneNO);  
    }

    @Patch(':id/setting/email')
    @UseGuards(AuthGuard())
    async UpdateUserEmail(@Param('id') id: string,
                          @Body('Email') Email: string,
                          @GetUser() User: User
                          ): Promise<User>{
        return this.userService.UpdateUserEmail(id,Email);
    }

    @Patch(':id/setting/description')
    async UpdateUserDes(@Param('id') id: string,
                        @Body('Description') Description: string,
                        @GetUser() User: User
                        ): Promise<User>{
        return this.userService.UpdateUserDescription(id,Description);
    }

    @Patch(':id/setting/infosetting')
    async UpdateUserInfo(@Param('id') id: string,
                         @Body('FirstName') FirstName: string,
                         @Body('LastName') LastName: string,
                         @Body('Birthday') Birthday: Date,
                         @Body('Gender') Gender: string,
                         @Body('Facebook') Facebook: string,
                         @Body('Address') Address: string,
                         @GetUser() User: User      
        ): Promise<User>{
        if((FirstName!='')
        && (LastName!='')
        && (Birthday!=null)
        && (Address!='')
        && (Gender!='')){
            return this.userService.UpdateUserInfo(id,FirstName,LastName,Birthday,Gender,Facebook,Address);
        }
        else{
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }

    @Patch(':UserName/setting/uploadIMG')
    @UseGuards(AuthGuard())
    async UploadImg(
        @Body('display_url') display_url: string,
        @Body('delete_url') delete_url: string,
        @GetUser() user: User,
    ): Promise<object>{
        return this.userService.SaveImgURL(user, display_url, delete_url);
    }
    
    @Get('/:id/getpetregcount')
    @UsePipes(ValidationPipe)
    GetPetRegCount(
        @Param('id') id: string,
    ){
        return this.userService.getPetRegCount(id);
    }

    @Get('/:id/getpetregdetail')
    @UsePipes(ValidationPipe)
    GetPetRegDetail(
        @Param('id') id: string,
    ){
        return this.userService.getPetRegDetail(id);
    }

    @Get('/:id/getpetadoptcount')
    GetPetAdoptCount(
        @Param('id') id: string,
    ){
        return this.userService.getPetAdoptCount(id);
    }

    @Get('/:id/getpetadoptdetail')
    GetPetAdoptDetail(
        @Param('id') id: string,
    ){
        return this.userService.getPetAdoptDetail(id);
    }

    @Get('/:id/getpetdonatedcount')
    GetPetDonatedCount(
        @Param('id') id: string,
    ){
        return this.userService.getPetDonatedCount(id);
    }

    @Get('/:id/getpetdonateddetail')
    GetPetDonatedDetail(
        @Param('id') id: string,
    ){
        return this.userService.getPetDonatedDetail(id);
    }
}