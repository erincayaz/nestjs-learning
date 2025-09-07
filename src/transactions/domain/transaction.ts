import { TransactionStatus } from "../enums/transaction-status.enum";


export class Transaction {
  id: string;

  vendorId: string;

  amount: number;

  currency: string;

  status: TransactionStatus;

  cardBrand: string;

  extraInfo?: any;

  createdAt: Date;

  updatedAt: Date;
}