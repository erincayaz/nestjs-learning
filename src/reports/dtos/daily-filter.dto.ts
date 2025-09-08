import { IsOptional, IsString, ValidateNested } from "class-validator";
import { BaseFilterReportDto, QueryReportBaseDto } from "./base-filter.dto";
import { plainToInstance, Transform, Type } from "class-transformer";

export class DailyFilterReportDto extends BaseFilterReportDto {
  @IsOptional()
  @IsString()
  declare cardBrand?: string; // sadece daily'de var
}

export class QueryDailyReportDto extends QueryReportBaseDto {
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(DailyFilterReportDto, JSON.parse(value)) : undefined
  )
  @ValidateNested()
  @Type(() => DailyFilterReportDto)
  filters?: DailyFilterReportDto;
}
