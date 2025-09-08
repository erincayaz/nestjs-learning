import { IsOptional, ValidateNested } from "class-validator";
import { BaseFilterReportDto, QueryReportBaseDto } from "./base-filter.dto";
import { plainToInstance, Transform, Type } from "class-transformer";

export class TopCardBrandFilterReportDto extends BaseFilterReportDto { }

export class QueryTopCardBrandsReportDto extends QueryReportBaseDto {
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(TopCardBrandFilterReportDto, JSON.parse(value)) : undefined
  )
  @ValidateNested()
  @Type(() => TopCardBrandFilterReportDto)
  filters?: TopCardBrandFilterReportDto;
}
