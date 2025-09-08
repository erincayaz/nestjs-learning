import { Injectable } from "@nestjs/common";
import { DailyReport } from "./domain/daily-report";
import { JwtPayloadType } from "src/auth/strategies/jwt-payload.type";
import { TransactionRepository } from "src/transactions/persistence/transaction.repository";
import { DailyFilterReportDto } from "./dtos/daily-filter.dto";
import { SortReportDto } from "./dtos/base-filter.dto";
import { CardBrandReport } from "./domain/card-brand-report";
import { TopCardBrandFilterReportDto } from "./dtos/card-brand-filter.dto";

@Injectable()
export class ReportService {
  constructor(
    private transactionRepository: TransactionRepository
  ) { }

  getDailyReport({
    filterOptions,
    sortOptions,
    currentUser
  }: {
    filterOptions?: DailyFilterReportDto | null;
    sortOptions?: SortReportDto[] | null;
    currentUser: JwtPayloadType
  }): Promise<DailyReport[]> {
    return this.transactionRepository.findDailyReport({
      filterOptions,
      sortOptions,
      currentUser
    })
  }

  getTopCardBrands({
    filterOptions,
    sortOptions,
    currentUser
  }: {
    filterOptions?: TopCardBrandFilterReportDto | null;
    sortOptions?: SortReportDto[] | null;
    currentUser: JwtPayloadType
  }): Promise<CardBrandReport[]> {
    return this.transactionRepository.findTopCardBrands({
      filterOptions,
      sortOptions,
      currentUser
    })
  }
}