import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getToken(loginUserDto: CreateUserDto) {
    const { username, password } = loginUserDto;

    const userFounded = await this.userModel.findOne({
      username: username,
    });

    if (!userFounded)
      throw new UnauthorizedException('No se encontro el usuario');

    if (!bcryptjs.compareSync(password, userFounded.password))
      throw new UnauthorizedException('Las credenciales no son validas');

    const { password: _, ...user } = userFounded.toJSON();

    return { user, token: this.createJwt({ id: user._id.toString() }) };
  }

  private createJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
