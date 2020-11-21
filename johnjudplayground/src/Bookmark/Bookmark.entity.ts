import {Entity,Column,ObjectIdColumn}  from 'typeorm';
import { ObjectID} from 'mongodb';


@Entity()
export class bookmark{
    @ObjectIdColumn()
    id?: string;
    
    @Column()
    bmid: string;

    @Column()
    petid: string;

    @Column()
    petPicUrl: string;

    @Column()
    UserIdBookmark: string;

    @Column()
    bmStatus: Boolean;

    @Column()
    PetName: string;
}
