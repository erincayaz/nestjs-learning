import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { UserRepository } from "./persistence/user.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./domain/user";
import * as bcrypt from 'bcryptjs';
import { VendorService } from "src/vendors/vendor.service";
import { FilterUserDto, SortUserDto } from "./dtos/query-user.dto";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { JwtPayloadType } from "src/auth/strategies/jwt-payload.type";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly vendorService: VendorService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userObject = await this.findByEmail(createUserDto.email);
    if (userObject !== null) {
      throw new ConflictException("User already exists");
    }

    if (createUserDto.role === 'vendor') {
      const vendorObject = await this.vendorService.findById(createUserDto.vendorId!);
      if (vendorObject === null) {
        throw new BadRequestException("Vendor does not exist");
      }
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);

    return await this.userRepository.create({
      email: createUserDto.email,
      password: password,
      role: createUserDto.role,
      vendorId: createUserDto.vendorId
    } as User);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let password: string | undefined = undefined;
    if (updateUserDto.password) {
      const userObject = await this.userRepository.findById(id);

      if (userObject && userObject.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | undefined = undefined;
    if (updateUserDto.email) {
      const userObject = await this.userRepository.findByEmail(updateUserDto.email);

      if (userObject && userObject.id !== id) {
        throw new BadRequestException("Email already exists.")
      }

      email = updateUserDto.email;
    }

    return this.userRepository.update(id, {
      email,
      password,
      vendorId: updateUserDto.vendorId,
      role: updateUserDto.role
    })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  findManyWithPagination({
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
    return this.userRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      currentUser
    });
  }

  async remove(id: User['id']): Promise<void> {
    await this.userRepository.remove(id);
  }
}