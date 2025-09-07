import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from "./persistence/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./persistence/user.repository";
import { VendorModule } from "src/vendors/vendor.module";

@Module({
  imports: [SequelizeModule.forFeature([UserEntity]), VendorModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}