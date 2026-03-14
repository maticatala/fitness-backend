import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWorkoutLogDto {
  @IsEmail()
  email: string;

  @IsString()
  trainedToday: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  workoutType?: string[];

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  formSubmittedAt: string;
}
