import { plainToInstance, Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { TransactionStatus } from "src/transactions/enums/transaction-status.enum";

export class BaseFilterReportDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  cardBrand?: string;

  @IsOptional()
  @IsEnum(TransactionStatus, { each: true })
  status?: TransactionStatus[];

  @IsOptional()
  @IsUUID()
  vendorId?: string;
}

export class SortReportDto {
  @IsString()
  orderBy: 'day' | 'transaction_count' | 'total_amount';

  @IsString()
  order: 'ASC' | 'DESC';
}

export abstract class QueryReportBaseDto {
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(SortReportDto, JSON.parse(value)) : undefined
  )
  @ValidateNested({ each: true })
  @Type(() => SortReportDto)
  sort?: SortReportDto[];
}
