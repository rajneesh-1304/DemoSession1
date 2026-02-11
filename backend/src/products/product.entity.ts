import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellerId:number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: true })
  isAvaliable: boolean;

  @Column({ nullable: true })
  images: string;
}
