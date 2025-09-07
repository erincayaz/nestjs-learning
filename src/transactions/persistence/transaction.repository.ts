import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TransactionEntity } from "./transaction.entity";
import { Transaction } from "../domain/transaction";
import { TransactionMapper } from "./transaction.mapper";
import { FilterTransactionDto, SortTransactionDto } from "../dtos/query-transaction.dto";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { JwtPayloadType } from "src/auth/strategies/jwt-payload.type";
import { literal, Order, OrderItem, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { RoleEnum } from "src/roles/role.enum";

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(TransactionEntity)
    private transactionModel: typeof TransactionEntity
  ) { }

  async create(data: Transaction): Promise<Transaction> { 
    const transactionModel = TransactionMapper.toPersistence(data);
    const newEntity = await this.transactionModel.create(transactionModel);
    return TransactionMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    currentUser
  }: {
    filterOptions?: FilterTransactionDto | null;
    sortOptions?: SortTransactionDto[] | null;
    paginationOptions: IPaginationOptions;
    currentUser: JwtPayloadType
  }): Promise<Transaction[]> {
    let where: WhereOptions<TransactionEntity> = {};

    // Status filter
    if (filterOptions?.status?.length) {
      where.status = { [Op.in]: filterOptions.status };
    }

    // Vendor id filter
    if (currentUser.role === RoleEnum.VENDOR) {
      where.vendorId = currentUser.vendorId;
    } else if (filterOptions?.vendorId) {
      where.vendorId = filterOptions.vendorId;
    }

    // Amount filter
    if (filterOptions?.minAmount || filterOptions?.maxAmount) {
      where.amount = {};
      if (filterOptions.minAmount) {
        (where.amount as any)[Op.gte] = filterOptions.minAmount;
      }
      if (filterOptions.maxAmount) {
        (where.amount as any)[Op.lte] = filterOptions.maxAmount;
      }
    }

    // Created at filter
    if (filterOptions?.startDate || filterOptions?.endDate) {
      where.createdAt = {};
      if (filterOptions.startDate) {
        (where.createdAt as any)[Op.gte] = filterOptions.startDate;
      }
      if (filterOptions.endDate) {
        (where.createdAt as any)[Op.lte] = filterOptions.endDate;
      }
    }

    // Card brand filter
    if (filterOptions?.cardBrand) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        literal(`"pgExtraInfo"->>'cardBrand' = '${filterOptions.cardBrand}'`),
      ];
    }

    const order: Order = sortOptions?.map<OrderItem>((sort) => [
      sort.orderBy,
      sort.order,
    ]) ?? [];

    const entities = await this.transactionModel.findAll({
      where,
      offset: (paginationOptions.page - 1) * paginationOptions.limit,
      limit: paginationOptions.limit,
      order,
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.transactionModel.findByPk(id);
    if (!entity) {
      return null;
    }
    return TransactionMapper.toDomain(entity);
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction | null> {
    const entity = await this.transactionModel.findByPk(id);
    if (!entity) {
      return null;
    }
    await entity.update(data);
    return TransactionMapper.toDomain(entity);
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await this.transactionModel.destroy({ where: { id } });
    return deletedCount > 0;
  }
}