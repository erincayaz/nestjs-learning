import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";


export class AuthUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string; // TODO: add old password check

  @IsOptional()
  @IsNotEmpty()
  vendorName?: string;
}