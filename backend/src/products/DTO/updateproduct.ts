import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateProduct {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'rating must be a valid decimal number' },
  )
  rating?: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity?: number;
}
