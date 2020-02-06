import {Entity,PrimaryColumn, PrimaryGeneratedColumn, Column,Index} from "typeorm";

// @Index(["studentId", "teacherId"], {unique: true})
@Entity()
export class Register {

    // @PrimaryGeneratedColumn()
    // id: number;

    @PrimaryColumn()
    studentId: number;

    @PrimaryColumn()
    teacherId: number;

}
