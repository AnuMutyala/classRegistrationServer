import {Entity, PrimaryGeneratedColumn,Index, Column} from "typeorm";

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    emailId: string;

    @Column({default: 0})
    suspended: number

}
