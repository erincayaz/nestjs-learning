import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/user.service";
import * as bcrypt from 'bcryptjs';
import { AuthLoginDto } from "./dtos/auth-login.dto";
import { AuthRegisterDto } from "./dtos/auth-register.dto";
import { VendorService } from "src/vendors/vendor.service";
import { RoleEnum } from "src/roles/role.enum";
import { JwtPayloadType } from "./strategies/jwt-payload.type";
import { AuthUpdateDto } from "./dtos/auth-update.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private vendorService: VendorService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: AuthLoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, role: user.role, vendorId: user.vendorId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: AuthRegisterDto) {
    let vendorId = registerDto.vendorId;
    if (!vendorId) {
      const vendor = await this.vendorService.create({
        name: registerDto.vendorName!
      });
      vendorId = vendor.id;
    } else {
      const vendor = await this.vendorService.findById(vendorId);
      if (!vendor) {
        throw new BadRequestException("Vendor does not exists");
      }
    }

    const user = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      role: RoleEnum.VENDOR,
      vendorId: vendorId
    });

    const payload = { id: user.id, role: user.role, vendorId: user.vendorId };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async update(userJwtPayload: JwtPayloadType, userDto: AuthUpdateDto) {
    const currentUser = await this.userService.findById(userJwtPayload.id);

    if (!currentUser) {
      throw new NotFoundException("User not found");
    }

    // TODO: Implement update logic
    return { message: "Update functionality not yet implemented" };
  }
}
