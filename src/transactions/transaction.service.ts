import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { TransactionRepository } from "./persistence/transaction.repository";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { Transaction } from "./domain/transaction";
import { VendorService } from "src/vendors/vendor.service";
import { JwtPayloadType } from "src/auth/strategies/jwt-payload.type";
import { RoleEnum } from "src/roles/role.enum";
import { FilterTransactionDto, SortTransactionDto } from "./dtos/query-transaction.dto";
import { IPaginationOptions } from "src/utils/types/pagination-options";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly vendorService: VendorService,
  ) { }

  async create(createTransactionDto: CreateTransactionDto, jwtPayload: JwtPayloadType): Promise<Transaction> {
    if (jwtPayload.role === RoleEnum.VENDOR && createTransactionDto.vendorId !== jwtPayload.vendorId) {
      throw new UnauthorizedException("You are not authorized to create a transaction for this vendor");
    }

    const vendorObject = await this.vendorService.findById(createTransactionDto.vendorId);
    if (vendorObject === null) {
      throw new BadRequestException("Vendor does not exist");
    }

    return await this.transactionRepository.create({
      vendorId: createTransactionDto.vendorId,
      amount: createTransactionDto.amount,
      currency: createTransactionDto.currency,
      status: createTransactionDto.status,
      cardBrand: createTransactionDto.cardBrand,
      extraInfo: createTransactionDto.extraInfo
    } as Transaction);
  }

  findManyWithPagination({
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
    return this.transactionRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      currentUser
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction | null> {
    return this.transactionRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.transactionRepository.delete(id);
  }
}