import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber, IsOptional, 
} from 'class-validator';

export class Address{

  @IsNotEmpty()
  sellerId: number;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  images:string;
}