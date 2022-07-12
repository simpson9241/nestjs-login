import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column()
  userName: string;

  @PrimaryColumn()
  userID: string;

  @Column()
  password: string;

  @Column()
  role: string;

}

export type UserReturnType={
  userID: string;
  userName: string;
  role: string;
}