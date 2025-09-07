import { IsNotEmpty, IsNumber, IsString, IsEnum, IsUUID, IsOptional, Length } from 'class-validator';
import { TransactionStatus } from '../enums/transaction-status.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  vendorId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @Length(3)
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsNotEmpty()
  @IsString()
  cardBrand: string;

  @IsOptional()
  extraInfo?: any;
}