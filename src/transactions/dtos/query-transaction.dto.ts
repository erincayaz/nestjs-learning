import { plainToInstance, Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { TransactionStatus } from "../enums/transaction-status.enum";
import { Transaction } from "../domain/transaction";

export class FilterTransactionDto {
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @IsOptional()
  @IsEnum(TransactionStatus, { each: true })
  status?: TransactionStatus[];

  @IsOptional()
  cardBrand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

export class SortTransactionDto {
  @IsString()
  orderBy: keyof Transaction;

  @IsString()
  order: 'ASC' | 'DESC';
}

export class QueryTransactionDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterTransactionDto, JSON.parse(value)) : undefined
  )
  @ValidateNested()
  @Type(() => FilterTransactionDto)
  filters?: FilterTransactionDto;

  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(SortTransactionDto, JSON.parse(value)) : undefined
  )
  @ValidateNested({ each: true })
  @Type(() => SortTransactionDto)
  sort?: SortTransactionDto[];
}
