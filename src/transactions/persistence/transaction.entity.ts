import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { VendorEntity } from "src/vendors/persistence/vendor.entity";
import { TransactionStatus } from "../enums/transaction-status.enum";

@Table({ tableName: 'transactions', timestamps: true })
export class TransactionEntity extends Model<TransactionEntity> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare currency: string;

  @Column({ type: DataType.ENUM(...Object.values(TransactionStatus)), allowNull: false })
  declare status: TransactionStatus;

  @ForeignKey(() => VendorEntity)
  @Column({ type: DataType.UUID, allowNull: false })
  declare vendorId: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  declare pgExtraInfo: any;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare updatedAt: Date;
}