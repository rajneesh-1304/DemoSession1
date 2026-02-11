import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AddressService } from "./address.service";
import { Address } from "./DTO/address";
import { FilesInterceptor } from "@nestjs/platform-express";
import { productImageStorage } from "src/multer/multer";

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  getAddress(@Query() query: any) {
    return this.addressService.getAddress(query);
  }

  @Post()
  @UseInterceptors(
      FilesInterceptor("images", 5, {
        storage: productImageStorage,
      }),
    )
  addAddress(@Body() addressData: Address, @UploadedFiles() file: Express.Multer.File,) {
    return this.addressService.addAddress(addressData, file);
  }
}