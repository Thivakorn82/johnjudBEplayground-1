import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ObjectID, Repository, Not, IsNull, ObjectType} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {petinfo} from './petInfo.entity';
import {User} from 'src/user/user.entity';
import { petinfoinput } from './petinfo.input';
import { notiinput } from 'src/notification/notification.input';
import { v4 as uuid } from 'uuid';

import { notiService } from 'src/notification/notification.service';
import { deleteinput } from './delete.input';

//import { noti } from 'src/notification/notification.entity';

@Injectable()
export class petInfoService {

  constructor(
    @InjectRepository(petinfo)
    private petInfoRepository: Repository<petinfo>,
    //private userRepository: Repository<User>
    
    @InjectRepository(User)
    private UserRepository: Repository<User>
    

    ){}



  //all pet, PetStatus = [ava, pend, done]
  async findAll(): Promise<petinfo[]> {
    const res = await this.petInfoRepository.find();
    
    return res;
  }

  //find only pet show in webApp, del pet not in this case
  async findPetInWeb(): Promise<petinfo[]> {
    //console.log('findPetWeb');
    //const res = await this.petInfoRepository.find({where:{ PetStatus: Not("delete") }});
    const res = await this.petInfoRepository.find({
        where:{$or:[{PetStatus: 'ava'},{PetStatus:'pend'},{PetStatus:'done'}]}
      });
    console.log(res);
    
    return res;
  }

  //test filter height
  async findPetlt(): Promise<petinfo[]> {
    //console.log('findPetWeb');
    //const res = await this.petInfoRepository.find({where:{ PetStatus: Not("delete") }});
    const petheight = "60.2";
    const testint = parseFloat(petheight);
    console.log(testint);
    const res = await this.petInfoRepository.find({
        where:{$and:[{$or:[{PetStatus: 'ava'},{PetStatus:'pend'},{PetStatus:'done'}]},{PetHeight:{$lt:{ testint }}}]}
      });
    console.log(res);
    
    return res;
  }

  async findPetHP(): Promise<petinfo[]> {
    const res = await this.petInfoRepository.find({
        where:{PetStatus: 'ava'}
      });
    
    return res;
  }

  async findPetHPrec(userid:string): Promise<petinfo[]> {
    const res = await this.petInfoRepository.find({
        where:{
          $and:[{PetStatus: 'ava'}, {UserId:{$not:{$eq:userid}}}]
        }
      });
    
    return res;
  }

  async findPetHPdon(userid:string): Promise<petinfo[]> {
    const res = await this.petInfoRepository.find({
        where:{
          $and:[{PetStatus:{$not:{$eq:null}}}, {UserId:{$eq:userid}}]
        }
          
      });
    
    return res;
  }

  async getPetById(petid: string): Promise<petinfo> {
    const found = await this.petInfoRepository.findOne({where:{ petid }});
    //const found = await this.petInfoRepository.findByIds();
    if (!found) {
      throw new NotFoundException(`Task with ID ${petid} not found`);
    }
    //test
    return found;
  }

  //GENCODE################
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  async createPetInfo(petinfoinput:petinfoinput, User:User): Promise<object>{
    //console.log(User);
    const { petid,PetName,PetBreed,PetGender,Type,PetPicURL,DelPicURL,PetStatus,PetLength,PetHeight, PetCerURL,TimeStampUpdate, UserId,AdopUserId,CodePet, CheckCode,TimeUpdate,Describe,PetAddress,GenCode} = petinfoinput;
    const newPet = this.petInfoRepository.create({
      petid: uuid()
    });
    
    const TimePost = new Date();
    //console.log(User.id);
    newPet.PetName = PetName;
    newPet.PetBreed = PetBreed;
    newPet.PetGender = PetGender;
    newPet.Type = Type.toUpperCase();
    newPet.PetPicURL = PetPicURL;
    newPet.DelPicURL = DelPicURL;
    newPet.PetStatus = 'ava'
    newPet.PetLength = PetLength;
    //const height = PetHeight;
    //const pethh = parseFloat(height);
    newPet.PetHeight = PetHeight;
    newPet.PetCerURL = PetCerURL;
    newPet.TimeStampUpdate = TimePost;

    //edit after as User Entity
    const Userid = User.id; 
    newPet.UserId = Userid;
    //console.log(User.id);

    newPet.AdopUserId = '';

    newPet.GenCode = this.makeid();
    newPet.CodePet = '';


    newPet.CheckCode = false;
    newPet.TimeUpdate = TimePost;
    newPet.Describe = Describe;
    newPet.PetAddress = PetAddress;
    await this.petInfoRepository.save(newPet);
    const pet = newPet.petid;
    return {"success": true, pet};
  }
 

  async checkCode(petinfoinput:petinfoinput, User:User): Promise<petinfo>{
    const {petid,PetName,PetBreed,PetGender,Type,PetPicURL,DelPicURL,PetStatus,PetLength,PetHeight, PetCerURL,TimeStampUpdate, UserId,AdopUserId, CodePet, CheckCode,TimeUpdate,Describe,PetAddress,GenCode} = petinfoinput;
    const petinfo = await this.petInfoRepository.findOne({where:{petid}});
    
    if(User.id===petinfo.UserId){
      throw new ConflictException('Can not get your own pet')
    }
    if(petinfo.CheckCode==true){
      throw new ConflictException('This pet was adopted')
    }
    if (CodePet===petinfo.GenCode){
      petinfo.CodePet = CodePet;
      petinfo.CheckCode = true;
      petinfo.AdopUserId = User.id;
      petinfo.PetStatus = 'pend';
      //await this.notiSer
    } 
    else if (CodePet!==petinfo.GenCode){
      throw new ConflictException('Your code is not correct')
    }
    await this.petInfoRepository.save(petinfo);
    console.log(petinfo);
    return petinfo;

  }
  
  //update pend to done
  async updatePetStatus(petinfoinput:petinfoinput, User:User): Promise<petinfo> {
    
    const {petid,PetName,PetBreed,PetGender,Type,PetPicURL,DelPicURL,PetStatus,PetLength,PetHeight, PetCerURL,TimeStampUpdate, UserId,AdopUserId,CodePet, CheckCode,TimeUpdate,Describe,PetAddress} = petinfoinput;
    const petinfo = await this.petInfoRepository.findOne({where:{petid}});
    const userid = User.id;

    if(User.id!==petinfo.UserId){
      throw new ConflictException('not your pet')
    }

    if(petinfo.PetStatus==='ava'){
      throw new ConflictException('this pet has not get the right code')
    }

    if(petinfo.PetStatus==='done'){
      throw new ConflictException('this pet was adopted alredy')
    }
    /*
    if (petinfo.PetStatus == 'ava') {
      petinfo.PetStatus = 'pend';
    }
    */
    if (petinfo.PetStatus == 'pend') {
      petinfo.PetStatus = 'done';
    }
    await this.petInfoRepository.save(petinfo);
    return petinfo;
  }

  async removePet(deleteinput:deleteinput): Promise<object> {
    //const { petid,PetName,PetBreed,PetGender,Type,PetPicURL,DelPicURL,PetStatus,PetLength,PetHeight, PetCerURL,TimeStampUpdate, UserId,AdopUserId, CheckCode,TimeUpdate,Describe,PetAddress} = petinfoinput;
    const {UserId,petid} = deleteinput;
    const pet = await this.petInfoRepository.findOne({where:{petid}});
    const User = await this.UserRepository.findOne({where:{id:UserId}});
    console.log(User);
    const userid = User.id;
    if (pet.UserId !== userid){
      console.log('error');
      return null;
    }
    pet.PetStatus = null;
    await this.petInfoRepository.save(pet);

    const id = petid;
    //return pet;
    return {"success": true, id};
  }

    
  async editPet(petinfoinput:petinfoinput, User:User): Promise<object> {
    console.log('edit start');
    const { petid,PetName,PetBreed,PetGender,Type,PetPicURL,DelPicURL,PetStatus,PetLength,PetHeight, PetCerURL,TimeStampUpdate, UserId,AdopUserId, CheckCode,TimeUpdate,Describe, PetAddress} = petinfoinput;
    const petinfo = await this.petInfoRepository.findOne({where:{petid}});
    console.log(petinfo);
    const userid = User.id;
    if (petinfo.UserId !== userid){
      console.log('this accout is not pet owner')
      throw new ConflictException('You dont have permission to edit this pet')  
    }
    if (petinfo.PetStatus !== 'ava'){
      console.log('cannot edit')
      throw new ConflictException('this pet cannnot edit')  
    }
    const today = new Date();
    const postday = petinfo.TimeStampUpdate;
    let fromDate = new Date(Date.now() - 60 * 60 * 24 * 2 * 1000);
    console.log(fromDate);
    if (fromDate>postday){
      console.log('can not edit')
      throw new ConflictException('Editing time is up')
    }

    petinfo.PetName = PetName;
    petinfo.PetBreed = PetBreed;
    petinfo.PetGender = PetGender;
    petinfo.Type = Type;

    if (PetPicURL != null){
      petinfo.PetPicURL = PetPicURL;
    }
  
    petinfo.DelPicURL = DelPicURL;
    petinfo.PetLength = PetLength;
    petinfo.PetHeight = PetHeight;

    if (PetCerURL != null){
      petinfo.PetCerURL = PetCerURL;
    }
    // petinfo.PetCerURL = PetCerURL;
    petinfo.TimeUpdate = today;
    petinfo.Describe = Describe;
    petinfo.PetAddress = PetAddress;

    await this.petInfoRepository.save(petinfo);
    console.log(petinfo);

    const id = petid;
    return {"success": true, id};
  }

  
  
  async updateImg(
    display: string, 
    del: string, 
    petId: string, 
    token: string,
    user: User
  ){
    const found = await this.getPetById(petId);

    found.PetPicURL = display;
    found.DelPicURL = del;

    await this.petInfoRepository.save(found);
  }

  async updateCer(
    display: string, 
    del: string, 
    petId: string, 
    token: string,
    user: User
  ){
    const found = await this.getPetById(petId);

    found.PetCerURL = display;

    await this.petInfoRepository.save(found);
  }

  
  
}
  

