import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkoutLog } from './entities/workout-log.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';

@Injectable()
export class WorkoutLogsService {
  constructor(
    @InjectModel(WorkoutLog.name) private workoutLogModel: Model<WorkoutLog>,
  ) {}

  async create(createWorkoutLogDto: CreateWorkoutLogDto) {
    const log = new this.workoutLogModel(createWorkoutLogDto);
    return await log.save();
  }

  async findAll() {
    return await this.workoutLogModel.find().sort({ formSubmittedAt: -1 });
  }

  async findOne(id: string) {
    const log = await this.workoutLogModel.findById(id);
    if (!log) throw new NotFoundException('Registro no encontrado');
    return log;
  }

  async findPending() {
    return await this.workoutLogModel.find({ wspNotified: false });
  }

  async getStats(email?: string) {
    const filter = email ? { email } : {};
    const logs = await this.workoutLogModel.find(filter);

    const totalSubmissions = logs.length;
    const totalTrained = logs.filter((l) => l.trainedToday).length;
    const totalNotTrained = totalSubmissions - totalTrained;
    const attendanceRate = totalSubmissions
      ? +((totalTrained / totalSubmissions) * 100).toFixed(1)
      : 0;

    return {
      email: email ?? 'todos',
      totalSubmissions,
      totalTrained,
      totalNotTrained,
      attendanceRate,
    };
  }

  async markNotified(id: string) {
    const log = await this.workoutLogModel.findByIdAndUpdate(
      id,
      { wspNotified: true, wspNotifiedAt: new Date() },
      { new: true },
    );
    if (!log) throw new NotFoundException('Registro no encontrado');
    return log;
  }
}
