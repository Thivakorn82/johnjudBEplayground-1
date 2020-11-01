import { Injectable} from '@nestjs/common';
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

    async createBookmark(bookmarkinput: bookmarkinput,User:User):Promise<object>{
        const {bmid, petid, petPicUrl, UserIdBookmark} = bookmarkinput;
        const newBookmark = this.BookmarkRepository.create({
                bmid: uuid()
              }
        );
        const found = await this.petInfoRepository.findOne({where:{petid}});
        newBookmark.petid = petid;
        
        console.log(found);
        newBookmark.petPicUrl = found.PetPicURL;
        newBookmark.UserIdBookmark = User.id;
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