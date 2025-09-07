import { CreationAttributes } from "sequelize";
import { Transaction } from "../domain/transaction";
import { TransactionEntity } from "./transaction.entity";

export class TransactionMapper {
  static toDomain(raw: TransactionEntity): Transaction {
    raw = raw.get({ plain: true });
    const transaction = new Transaction();
    transaction.id = raw.id;
    transaction.amount = Number(raw.amount);
    transaction.currency = raw.currency;
    transaction.status = raw.status;
    transaction.vendorId = raw.vendorId;
    transaction.cardBrand = raw.pgExtraInfo?.cardBrand || 'unknown';
    
    const { cardBrand, ...extraInfo } = raw.pgExtraInfo || {};
    transaction.extraInfo = extraInfo;
    
    transaction.createdAt = raw.createdAt;
    transaction.updatedAt = raw.updatedAt;
    return transaction;
  }

  static toPersistence(transaction: Transaction): CreationAttributes<TransactionEntity> {
    const { cardBrand, ...pgExtraInfo } = transaction.extraInfo || {};

    return {
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      vendorId: transaction.vendorId,
      pgExtraInfo: { ...pgExtraInfo, cardBrand: transaction.cardBrand },
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    } as CreationAttributes<TransactionEntity>;
  }
}