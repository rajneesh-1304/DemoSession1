import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sellerId: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    images: string;
}