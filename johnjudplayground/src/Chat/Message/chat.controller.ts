import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { chatnotiDto } from "../Chatnotification/chatnotification.dto";
import { CreateNewChatDto } from "../dto/create-newchat.dto";
import Newchat from "./chat.entity";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController{
    constructor(private ChatService: ChatService,
                private UserService: UserService){}

    @Post(':UserId/:roomId/addmessage')
    @UseGuards(AuthGuard())
    async addMessage(@Param('UserId') UserId: string,
                     @Param('roomId') roomId : string,
                     @GetUser() User: User,
                     @Body() CreateNewChatDto: CreateNewChatDto){
        CreateNewChatDto.createAt = new Date();
        CreateNewChatDto.ownerId = UserId;
        CreateNewChatDto.roomId = roomId;
        if(CreateNewChatDto.message == ''){
            throw new HttpException('Bad request',HttpStatus.BAD_REQUEST)
        }
        else{
            return this.ChatService.addMessage(CreateNewChatDto);
        }
    }

    @Get(':UserId/getusermessage')
    async getusermessage(@Param('UserId') UserId: string): Promise<Newchat>{
        return this.ChatService.getMessage(UserId)
    }

    @Get(':roomId/getmessage')
    async getAllMessageFromRoom(@Param('roomId') roomId: string): Promise<Newchat[]>{
        return this.ChatService.getAllMessageFromRoom(roomId);
    }

    @Post(':sender/:UserId/notification')
    async chatnotification(@Param('UserId') UserId: string,
                           @Param('sender') sender: string,
                           @Body() chatnotiDto: chatnotiDto){
        const senderName = await this.UserService.findUserId(sender)
        chatnotiDto.User = UserId
        chatnotiDto.sender = senderName.UserName
        chatnotiDto.isread = false
        chatnotiDto.NotiDate = new Date()
        return this.ChatService.chatnoti(chatnotiDto);
    }
}