import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @MinLength(6)
  password: string;
}
