import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TransactionEntity } from "./transaction.entity";
import { Transaction } from "../domain/transaction";
import { TransactionMapper } from "./transaction.mapper";
import { FilterTransactionDto, SortTransactionDto } from "../dtos/query-transaction.dto";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { JwtPayloadType } from "src/auth/strategies/jwt-payload.type";
import { literal, Order, OrderItem, Sequelize, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { RoleEnum } from "src/roles/role.enum";
import { DailyReport } from "src/reports/domain/daily-report";
import { TransactionStatus } from "../enums/transaction-status.enum";
import { DailyFilterReportDto } from "src/reports/dtos/daily-filter.dto";
import { SortReportDto } from "src/reports/dtos/base-filter.dto";
import { CardBrandReport } from "src/reports/domain/card-brand-report";
import { TopCardBrandFilterReportDto } from "src/reports/dtos/card-brand-filter.dto";

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

  async findDailyReport({
    filterOptions,
    sortOptions,
    currentUser,
  }: {
    filterOptions?: DailyFilterReportDto | null;
    sortOptions?: SortReportDto[] | null;
    currentUser: JwtPayloadType;
  }): Promise<DailyReport[]> {
    let where: WhereOptions<TransactionEntity> = {};

    // Vendor restriction
    if (currentUser.role === RoleEnum.VENDOR) {
      where.vendorId = currentUser.vendorId;
    } else if (currentUser.role === RoleEnum.ADMIN && filterOptions?.vendorId) {
      where.vendorId = filterOptions.vendorId;
    }

    // Status filter
    if (filterOptions?.status?.length) {
      where.status = { [Op.in]: filterOptions.status };
    } else {
      const defaultStatus = [TransactionStatus.AUTHORIZED, TransactionStatus.CAPTURED]
      where.status = { [Op.in]: defaultStatus }
    }

    // CreatedAt range
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

    // Sorting
    const order: Order = sortOptions?.map<OrderItem>((sort) => [
      sort.orderBy,
      sort.order,
    ]) ?? [['day', 'ASC']];

    // Query with GROUP BY day
    const results = await this.transactionModel.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt')), 'day'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'transaction_count'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
      ],
      where,
      group: [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('createdAt'))],
      order,
      raw: true,
    });

    return results.map((row: any) => ({
      date: row.day,
      transactionCount: Number(row.transaction_count),
      totalAmount: Number(row.total_amount),
    }));
  }

  // TODO: Merge find daily report with this
  async findTopCardBrands({
    filterOptions,
    sortOptions,
    currentUser,
  }: {
    filterOptions?: TopCardBrandFilterReportDto | null;
    sortOptions?: SortReportDto[] | null;
    currentUser: JwtPayloadType;
  }): Promise<CardBrandReport[]> {
    let where: WhereOptions<TransactionEntity> = {};

    // Vendor restriction
    if (currentUser.role === RoleEnum.VENDOR) {
      where.vendorId = currentUser.vendorId;
    } else if (currentUser.role === RoleEnum.ADMIN && filterOptions?.vendorId) {
      where.vendorId = filterOptions.vendorId;
    }

    // Status filter
    if (filterOptions?.status?.length) {
      where.status = { [Op.in]: filterOptions.status };
    } else {
      const defaultStatus = [TransactionStatus.AUTHORIZED, TransactionStatus.CAPTURED]
      where.status = { [Op.in]: defaultStatus }
    }

    // CreatedAt range
    if (filterOptions?.startDate || filterOptions?.endDate) {
      where.createdAt = {};
      if (filterOptions.startDate) {
        (where.createdAt as any)[Op.gte] = filterOptions.startDate;
      }
      if (filterOptions.endDate) {
        (where.createdAt as any)[Op.lte] = filterOptions.endDate;
      }
    }

    // Sorting
    const order: Order = sortOptions?.map<OrderItem>((sort) => [
      sort.orderBy,
      sort.order,
    ]) ?? [['count', 'DESC']];
    // TODO: Remove sorting and add default sorting to find top card brands

    // Query with GROUP BY cardBrand
    const results = await this.transactionModel.findAll({
      attributes: [
        [Sequelize.literal(`"pgExtraInfo"->>'cardBrand'`), 'cardBrand'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'transactionCount'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
      ],
      where,
      group: [Sequelize.literal(`"pgExtraInfo"->>'cardBrand'`) as any],
      order,
      raw: true,
    });

     // Map to DTO
    return results.map((row: any) => ({
      cardBrand: row.cardBrand,
      count: Number(row.transactionCount),
      totalAmount: Number(row.totalAmount),
    }));
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