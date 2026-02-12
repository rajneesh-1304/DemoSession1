import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({default:false})
  isBanned: boolean;
}