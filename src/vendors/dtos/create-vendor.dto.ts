import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'Vendor Name', description: 'The name of the vendor' })
  @IsNotEmpty()
  name: string;
}