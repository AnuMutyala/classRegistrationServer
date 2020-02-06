import {Entity, PrimaryGeneratedColumn, Column,CreateDateColumn} from "typeorm";

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    notification: string;

    @Column()
    studentId: number;

    @Column()
    teacherId: number;

    @CreateDateColumn()
    createdAt: Date;

}
