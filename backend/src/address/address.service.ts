import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Address } from "./address.entity";

@Injectable()
export class AddressService {
    constructor(private readonly dataSource: DataSource) { }

    async addAddress(data, files: Express.Multer.File) {
        const addressRepo = this.dataSource.getRepository(Address);
        const imageUrls =`http://localhost:3001/uploads/${files[0]?.filename}`;

        const isExist = await addressRepo.findOne({where : {sellerId : data.sellerId}});
        if(isExist){
            return { message: "Address already exists, You can only Update!" };
        }

        const address = addressRepo.create({
            sellerId: data.sellerId,
            name: data.name,
            description:data.description,
            images: imageUrls
        })
        await addressRepo.save(address);
        return { message: "Address added successfully!" };
    }

    async getAddress(query: any) {
        const addressRepo = this.dataSource.getRepository('Address');
        if (query.sellerId) {
            return addressRepo.findOne({
                where: { sellerId: query.sellerId },
            });
        }
        return await addressRepo.find();
    }

}