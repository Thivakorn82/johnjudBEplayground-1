import { Entity, Column, ObjectIdColumn, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, OneToOne } from 'typeorm'; 
import { Double, ObjectID } from 'mongodb';
import {User} from 'src/user/user.entity';

@Entity()
export class petinfo{
  /*
    save() {
      throw new Error('Method not implemented.');
    }
    static id(id: any, PetStatus: any): petinfo | PromiseLike<petinfo> {
      throw new Error('Method not implemented.');
    }
    */
    @ObjectIdColumn()
    _id: string;

    @PrimaryColumn()
    petid: string;

    @Column()
    PetName: string;

    @Column()
    PetBreed: string;

    @Column()
    PetGender: string;

    @Column()
    Type: string;

    @Column()
    PetPicURL: string;

    @Column()
    DelPicURL: string;

    @Column()
    PetStatus: string;

    @Column()
    PetLength: number;

    @Column()
    PetHeight: number;

    @Column()
    PetCerURL: string;

    @Column()
    TimeStampUpdate: Date;

    @Column()
    UserId: string;

    @Column()
    AdopUserId: string;

    @Column()
    CodePet: string;

    @Column()
    CheckCode: boolean;

    @Column()
    TimeUpdate: Date;
    
    @Column()
    Describe: string;

    @Column()
    PetAddress: string;

    @Column()
    GenCode: string;
}


