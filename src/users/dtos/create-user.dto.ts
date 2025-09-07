import { IsEmail, IsEnum, IsNotEmpty, IsUUID, MinLength, ValidateIf } from 'class-validator';
import { RoleEnum } from '../../roles/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ValidateIf(o => o.role === RoleEnum.VENDOR)
  @IsNotEmpty()
  @IsUUID()
  vendorId?: string;
}