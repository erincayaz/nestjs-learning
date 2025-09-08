import { Controller, Get, HttpCode, HttpStatus, Query, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DailyReport } from "./domain/daily-report";
import { ReportService } from "./report.service";
import { QueryDailyReportDto } from "./dtos/daily-filter.dto";
import { QueryTopCardBrandsReportDto } from "./dtos/card-brand-filter.dto";
import { CardBrandReport } from "./domain/card-brand-report";

@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'report'
})
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/daily')
  getDailyReport(@Query() query: QueryDailyReportDto, @Request() req): Promise<DailyReport[]> {
    return this.reportService.getDailyReport({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      currentUser: req.user,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('/card')
  getTopCardBrands(@Query() query: QueryTopCardBrandsReportDto, @Request() req): Promise<CardBrandReport[]> {
    return this.reportService.getTopCardBrands({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      currentUser: req.user
    })
  }
}