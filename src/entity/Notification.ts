import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    notification: string;

    @Column()
    teacherId: number;


}
