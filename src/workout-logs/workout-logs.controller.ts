import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WorkoutLogsService } from './workout-logs.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { AuthenticationGuard } from 'utility/guards/authentication.guard';

@Controller('workout-logs')
export class WorkoutLogsController {
  constructor(private readonly workoutLogsService: WorkoutLogsService) {}

  // Público: lo llama Google Apps Script
  @Post()
  create(@Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutLogsService.create(createWorkoutLogDto);
  }

  // Protegidos: los consume el bot u otras apps
  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.workoutLogsService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('pending-notification')
  findPending() {
    return this.workoutLogsService.findPending();
  }

  @UseGuards(AuthenticationGuard)
  @Get('stats')
  getStats(@Query('email') email?: string) {
    return this.workoutLogsService.getStats(email);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutLogsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id/mark-notified')
  markNotified(@Param('id') id: string) {
    return this.workoutLogsService.markNotified(id);
  }
}
