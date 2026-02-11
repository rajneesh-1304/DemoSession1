import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Query, Patch, Param, UploadedFiles, } from '@nestjs/common';
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductService } from './product.service';
import { ProductDefinition } from './DTO/product';
import { productImageStorage } from "../multer/multer";
import { Delete } from '@nestjs/common';

@Controller('dishes')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  getProducts(@Query() query: any) {
    return this.productService.getDishes(query);
  }

  @Get('getAll')
  getAll(@Query() query : any){
    return this.productService.getAll(query);
  }

  @Post('adddish')
  @UseInterceptors(
    FilesInterceptor("images", 5, {
      storage: productImageStorage,
    }),
  )
  addProduct(
    @Body() productData: ProductDefinition,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    return this.productService.addDish(productData, file);
  }

  @Patch('update/:id')
  @UseInterceptors(FilesInterceptor("images", 5, { storage: productImageStorage }))
  updateProduct(
    @Param('id') id: number,
    @Body() dishData: any,
    @UploadedFiles() file: Express.Multer.File
  ) {
    return this.productService.updateDish(id, dishData, file);
  }

  @Patch('ban/:id')
  banDish(@Param('id') id: string) {
    return this.productService.banDish(+id);
  }

  @Patch('unban/:id')
  unbanDish(@Param('id') id: string) {
    return this.productService.unbanDish(+id);
  }

}
