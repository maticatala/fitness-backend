import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    AuthModule,
  ],
})
export class SeedModule {}
