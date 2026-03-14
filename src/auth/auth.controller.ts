import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/getToken')
  login(@Body() loginUserDto: CreateUserDto) {
    return this.authService.getToken(loginUserDto);
  }
}
