import { IsOptional, IsString } from 'class-validator';

export class EditVendorDto {
  @IsOptional()
  @IsString()
  name?: string;
}
