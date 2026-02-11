import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Products } from './product.entity';
import { ILike } from 'typeorm'; 

@Injectable()
export class ProductService {
  constructor(private readonly dataSource: DataSource) { }

  async addDish(prodData, files: Express.Multer.File) {
    if (!prodData.title || prodData.title.trim() === '') {
      throw new BadRequestException('Product title is required');
    }

    if (!prodData.price || prodData.price <= 0) {
      throw new BadRequestException('Product price must be greater than 0');
    }

    const prodRepo = this.dataSource.getRepository(Products);
    const existingProduct = await prodRepo.findOne({
      where: {
        sellerId: prodData.sellerId,
        title: prodData.title,
      },
    });
    if (existingProduct) {
      throw new ConflictException('Product with this title already exists');
    }
    console.log(files)
    const imageUrls = `http://localhost:3001/uploads/${files[0]?.filename}`;

    const prod = prodRepo.create({
      sellerId: prodData.sellerId,
      title: prodData.title,
      description: prodData.description,
      price: prodData.price,
      images: imageUrls,
      isAvaliable: true,
    });

    await prodRepo.save(prod);
    return { message: 'Product added successfully' };
  }

  async getAll(query: any) {
    const limit = Number(query?.limit) || 10;
    const page = Number(query?.page) || 1;
    const skip = (page - 1) * limit;
    const sellerId = query.sellerId;
    const searchValue = query.searchValue;

    const prodRepo = this.dataSource.getRepository(Products);
    const queryBuilder = prodRepo.createQueryBuilder('products');

    if (sellerId) {
      queryBuilder.where('products.sellerId = :sellerId', { sellerId });
      queryBuilder.andWhere('products.isAvaliable = :isAvaliable', { isAvaliable: true });
    } 
    if(searchValue){
      queryBuilder.andWhere('products.title ILike :title', {
            title: `%${searchValue}%`,
        });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getDishes(query: any) {
    const limit = Number(query?.limit) || 10;
    const page = Number(query?.page) || 1;
    const skip = (page - 1) * limit;
    const sellerId = query.sellerId;

    const prodRepo = this.dataSource.getRepository(Products);
    const queryBuilder = prodRepo.createQueryBuilder('products');

    if (sellerId) {
      queryBuilder.where('products.sellerId = :sellerId', { sellerId });
    } 


    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateDish(productId, productData, file?: Express.Multer.File) {
    const id = Number(productId);
    console.log(file)
    if (!id) {
      throw new BadRequestException('Product id is not present');
    }

    if (!productData && (!file)) {
      throw new BadRequestException('User does not provide data for update');
    }

    const prodRepo = this.dataSource.getRepository(Products);
    const existProduct = await prodRepo.findOne({ where: { id } });

    if (!existProduct) throw new ConflictException('Product does not exist.');
    const imageUrls = `http://localhost:3001/uploads/${file[0]?.filename}`;

    productData.images = imageUrls;
    await prodRepo.update(productId, productData);

    return { message: 'Product updated successfully!' };
  }

  async banDish(id: number) {
    const dishRepo = this.dataSource.getRepository(Products);
    const product = await dishRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Dish not found');

    product.isAvaliable = false;
    await dishRepo.save(product);
    return product;
  }

  async unbanDish(id: number) {
    const dishRepo = this.dataSource.getRepository(Products);
    const product = await dishRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Dish not found');

    product.isAvaliable = true;
    await dishRepo.save(product);
    return product;
  }
}
