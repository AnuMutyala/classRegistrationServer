import {Entity, PrimaryGeneratedColumn,Index, Column,ManyToMany, JoinTable} from "typeorm";
import { Teacher } from "./Teacher";

// @Index(["emailId"], {unique: true})
@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    emailId: string;

    @Column({default: 0})
    suspended: number

    // @ManyToMany(type => Teacher, teacher => teacher.id)
    // @JoinTable()
    // teachers: Teacher[];

}
