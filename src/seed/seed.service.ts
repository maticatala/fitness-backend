import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class SeedService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async runSeed() {
    if (!process.env.ADMIN_PASSWORD)
      throw new BadRequestException('Falta la credencial PASSWORD en .env');
    if (!process.env.ADMIN_USERNAME)
      throw new BadRequestException('Falta la credencial USERNAME en .env');

    const username = process.env.ADMIN_USERNAME;

    const password = bcryptjs.hashSync(process.env.ADMIN_PASSWORD, 10);

    await this.create({ username, password });

    return 'SEED EXECUTED';
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      const newUser = new this.userModel(createUserDto);

      await newUser.save();

      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `${createUserDto.username} already exists!`,
        );
      }

      throw new InternalServerErrorException(
        'Something terrible happen!',
        error,
      );
    }
  }
}
