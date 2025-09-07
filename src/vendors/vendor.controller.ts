import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { VendorService } from "./vendor.service";
import { Vendor } from "./domain/vendor";
import { CreateVendorDto } from "./dtos/create-vendor.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/role.decorator";
import { RoleEnum } from "src/roles/role.enum";
import { Roles } from "src/roles/role.guard";

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller({
  path: 'vendor'
})
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorService.create(createVendorDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(id: string): Promise<Vendor | null> {
    return this.vendorService.findById(id);
  }
}