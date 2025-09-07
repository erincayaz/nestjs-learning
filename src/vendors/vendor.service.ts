import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { VendorRepository } from "./persistence/vendor.repository";
import { CreateVendorDto } from "./dtos/create-vendor.dto";
import { Vendor } from "./domain/vendor";

@Injectable()
export class VendorService {
  constructor(
    private readonly vendorRepository: VendorRepository
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const vendorObject = await this.vendorRepository.findByName(createVendorDto.name);
    if (vendorObject !== null) {
      throw new ConflictException("Vendor already exists");
    }

    return await this.vendorRepository.create({
      name: createVendorDto.name
     } as Vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.findAll();
  }

  async findById(id: string): Promise<Vendor | null> {
    return this.vendorRepository.findById(id);
  }
}