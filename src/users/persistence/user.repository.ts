import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserEntity } from "./user.entity";
import { User } from "../domain/user";
import { UserMapper } from "./user.mapper";
import { FilterUserDto, SortUserDto } from "../dtos/query-user.dto";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { Order, OrderItem, WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { JwtPayloadType } from "src/auth/strategies/jwt-payload.type";
import { RoleEnum } from "src/roles/role.enum";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity)
    private userModel: typeof UserEntity
  ) {}

  async create(data: User): Promise<User> { 
    const userModel = UserMapper.toPersistence(data);
    const newEntity = await this.userModel.create(userModel);
    return UserMapper.toDomain(newEntity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.userModel.findAll();
    return entities.map(UserMapper.toDomain);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userModel.findByPk(id);
    if (!entity) {
      return null;
    }
    return UserMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userModel.findOne({ where: { email } });
    if (!entity) {
      return null;
    }
    return UserMapper.toDomain(entity);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const entity = await this.userModel.findByPk(id);
    if (!entity) {
      return null;
    }
    await entity.update(data);
    return UserMapper.toDomain(entity);
  }

  async remove(id: string): Promise<boolean> {
    const deletedCount = await this.userModel.destroy({ where: { id } });
    return deletedCount > 0;
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    currentUser
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
    currentUser: JwtPayloadType
  }): Promise<User[]> {
    let where: WhereOptions<UserEntity> = {};

    if (filterOptions?.roles?.length) {
      where.role = { [Op.in]: filterOptions.roles };
    }

    if (currentUser.role === RoleEnum.VENDOR) {
      where.vendorId = currentUser.vendorId;
    }

    const order: Order = sortOptions?.map<OrderItem>((sort) => [
      sort.orderBy,
      sort.order,
    ]) ?? [];

    const entities = await this.userModel.findAll({
      where,
      offset: (paginationOptions.page - 1) * paginationOptions.limit,
      limit: paginationOptions.limit,
      order,
    });

    return entities.map((entity) => UserMapper.toDomain(entity));
  }
}