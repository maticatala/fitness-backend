import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkoutLogDto {
  @IsEmail()
  email: string;

  @IsBoolean()
  trainedToday: boolean;

  @IsString()
  @IsOptional()
  workoutType?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  formSubmittedAt: string;
}
