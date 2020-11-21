import { ConflictException, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ObjectID, ObjectId} from 'mongodb';

import { bookmark } from './Bookmark.entity';
import { petinfo } from 'src/petInfo/petInfo.entity';
import { bookmarkinput} from './bookmark.input';
import { User } from 'src/user/user.entity';
import { v4 as uuid } from 'uuid';


@Injectable()
export class BookmarkService{
    constructor(
        @InjectRepository(bookmark)
        private BookmarkRepository: Repository<bookmark>,

        @InjectRepository(petinfo)
        private petInfoRepository: Repository<petinfo>
    ) {}

    async findAll(): Promise<bookmark[]>{
        return this.BookmarkRepository.find();
    }

    async findBookmark(UserId:string): Promise<bookmark[]>{
        return this.BookmarkRepository.find({where:{UserIdBookmark:UserId}});
    }

    async createBookmark(createBookmarkInput):Promise<object>{
        //const {bmid, petid, petPicUrl, UserIdBookmark} = bookmarkinput;
        const {UserId, petid}=createBookmarkInput; 
        const newBookmark = this.BookmarkRepository.create({
                bmid: uuid()
              }
        );
        const found = await this.petInfoRepository.findOne({where:{petid}});
        newBookmark.petid = petid;

        let check: bookmarkinput | null = await this.BookmarkRepository.findOne({
            where:{$and:[{petid:petid},{UserIdBookmark:UserId}]}
        });

        if (check != null){
            console.log("here");
            throw new ConflictException('already save in bookmark')
            
        }
        // if (checkbm.UserIdBookmark === UserId){
        //     console.log(checkbm);
        //     throw new ConflictException('already save in bookmark')
        // }
        
        console.log(found);
        newBookmark.petPicUrl = found.PetPicURL;
        newBookmark.UserIdBookmark = UserId;
        newBookmark.bmStatus = true;
        newBookmark.PetName = found.PetName;
        await this.BookmarkRepository.save(newBookmark);
        
        const id = newBookmark.bmid;
        //return newBookmark;
        return {"success": true, id};
    }

    async remove(id: string): Promise<object> {
        await this.BookmarkRepository.delete(id);
        return {"success": true, id};
      }
}