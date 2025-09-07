import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsUUID, MinLength, ValidateIf } from "class-validator";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";


export class AuthRegisterDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ValidateIf((o) => !o.vendorId)
  @IsNotEmpty()
  vendorName?: string;
}