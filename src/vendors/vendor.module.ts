import { Module } from "@nestjs/common";
import { VendorController } from "./vendor.controller";
import { VendorService } from "./vendor.service";
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorEntity } from "./persistence/vendor.entity";
import { VendorRepository } from "./persistence/vendor.repository";

@Module({
  imports: [SequelizeModule.forFeature([VendorEntity])],
  controllers: [VendorController],
  providers: [VendorService, VendorRepository],
  exports: [VendorService]
})
export class VendorModule {}