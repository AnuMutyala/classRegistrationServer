import {Entity, PrimaryGeneratedColumn, Column,CreateDateColumn} from "typeorm";

@Entity()
export class StudentNotification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    notificationId: number;

    @Column()
    studentId: number;
}
