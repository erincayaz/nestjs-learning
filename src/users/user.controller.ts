import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, SerializeOptions, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./domain/user";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/role.decorator";
import { Roles } from "src/roles/role.guard";
import { RoleEnum } from "../roles/role.enum";
import { InfinityPaginationResponseDto } from "src/utils/dtos/infinity-pagination-response.dto";
import { QueryUserDto } from "./dtos/query-user.dto";
import { infinityPagination } from "src/utils/inifinity-pagination";
import { NullableType } from "src/utils/types/nullable.type";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateUserGuard } from "./user.guard";

// TODO: Add vendor and vendor guards to delete and find one

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller({
  path: 'user'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleEnum.ADMIN)
  @SerializeOptions({})  
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.VENDOR)
  @SerializeOptions({})
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: QueryUserDto, @Request() req): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.userService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: { page, limit },
        currentUser: req.user
      }),
      { page, limit }
    );
  }

  @SerializeOptions({})
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.userService.findById(id);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.VENDOR)
  @UseGuards(UpdateUserGuard)
  @SerializeOptions({})
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: User['id'], @Body() updateProfileDto: UpdateUserDto) {
    return this.userService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.userService.remove(id);
  }
}