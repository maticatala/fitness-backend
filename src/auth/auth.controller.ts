import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticationGuard } from 'utility/guards/authentication.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/getToken')
  login(@Body() loginUserDto: CreateUserDto) {
    return this.authService.getToken(loginUserDto);
  }

  //Este endpoint es solo demostrativo de como deberiamos usar la autenticación con el JWT
  @UseGuards(AuthenticationGuard)
  @Get('')
  findAll() {
    return this.authService.findAll();
  }
}
