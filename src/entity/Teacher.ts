import {Entity, Index,PrimaryGeneratedColumn, Column,ManyToMany, JoinTable} from "typeorm";
import { Student } from "./Student";

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    emailId: string;

    // @ManyToMany(type => Student, student => student.id)
    // @JoinTable()
    // students: Student[];

}
