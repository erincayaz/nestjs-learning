import { plainToInstance, Transform, Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { RoleEnum } from "src/roles/role.enum";
import { User } from "../domain/user";

export class FilterUserDto {
  @IsOptional()
  @IsEnum(RoleEnum, { each: true })
  roles?: RoleEnum[] | null;

  @IsOptional()
  @IsUUID()
  vendorId?: string | null;

  // TODO: Maybe add filters for createdAt
}

export class SortUserDto {
  @Type(() => String)
  @IsString()
  orderBy: keyof User;

  @IsString()
  order: string;
}

export class QueryUserDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => 
    value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto | null;

  @IsOptional()
  @Transform(({ value }) => 
    value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined
  )
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}