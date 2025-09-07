import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Request, SerializeOptions, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dtos/create-transaction.dto";
import { Transaction } from "./domain/transaction";
import { AuthGuard } from "@nestjs/passport";
import { QueryTransactionDto } from "./dtos/query-transaction.dto";
import { InfinityPaginationResponseDto } from "src/utils/dtos/infinity-pagination-response.dto";
import { infinityPagination } from "src/utils/inifinity-pagination";

@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'transaction'
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @SerializeOptions({})
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto, req.user);
  }

  @SerializeOptions({})
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: QueryTransactionDto, @Request() req): Promise<InfinityPaginationResponseDto<Transaction>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.transactionService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: { page, limit },
        currentUser: req.user
      }),
      { page, limit }
    );
  }
}