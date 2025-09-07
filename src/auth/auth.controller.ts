import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dtos/auth-login.dto";
import { AuthRegisterDto } from "./dtos/auth-register.dto";
import { AuthUpdateDto } from "./dtos/auth-update.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: AuthRegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async update(@Request() req, @Body() userDto: AuthUpdateDto) {
    return this.authService.update(req.user, userDto);
  }
}
