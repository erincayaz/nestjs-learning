import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { TransactionModule } from "src/transactions/transaction.module";
import { ReportService } from "./report.service";

@Module({
  imports: [TransactionModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService]
})
export class ReportModule {}
