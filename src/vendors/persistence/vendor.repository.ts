import { Injectable } from "@nestjs/common";
import { VendorEntity } from "./vendor.entity";
import { Vendor } from "../domain/vendor";
import { VendorMapper } from "./vendor.mapper";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class VendorRepository {
  constructor(
    @InjectModel(VendorEntity)
    private vendorModel: typeof VendorEntity
  ) {}

  async create(data: Vendor): Promise<Vendor> { 
    const vendorModel = VendorMapper.toPersistence(data);
    const newEntity = await this.vendorModel.create(vendorModel as any); // TODO: Fix this
    return VendorMapper.toDomain(newEntity);
  }

  async findAll(): Promise<Vendor[]> {
    const entities = await this.vendorModel.findAll();
    return entities.map(VendorMapper.toDomain);
  }

  async findById(id: string): Promise<Vendor | null> {
    const entity = await this.vendorModel.findByPk(id);
    if (!entity) {
      return null;
    }
    return VendorMapper.toDomain(entity);
  }

  async findByName(name: string): Promise<Vendor | null> {
    const entity = await this.vendorModel.findOne({ where: { name } });
    if (!entity) {
      return null;
    }
    return VendorMapper.toDomain(entity);
  }

  async update(id: string, data: Partial<Vendor>): Promise<Vendor | null> {
    const entity = await this.vendorModel.findByPk(id);
    if (!entity) {
      return null;
    }
    await entity.update(data);
    return VendorMapper.toDomain(entity);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.vendorModel.destroy({ where: { id } });
    return deletedCount > 0;
  }
}