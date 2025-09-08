import { Module } from "@nestjs/common";
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorModule } from "src/vendors/vendor.module";
import { TransactionEntity } from "./persistence/transaction.entity";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionRepository } from "./persistence/transaction.repository";

@Module({
  imports: [SequelizeModule.forFeature([TransactionEntity]), VendorModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository]
})
export class TransactionModule {}