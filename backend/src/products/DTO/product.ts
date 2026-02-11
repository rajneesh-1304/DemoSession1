import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber, IsOptional, IsArray, ArrayNotEmpty
} from 'class-validator';

export class ProductDefinition {
  
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  sellerId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
  
  @IsOptional()
  images:string;
}