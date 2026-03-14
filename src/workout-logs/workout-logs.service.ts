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
    // Filtro solo por hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filter: any = {
      formSubmittedAt: { $gte: today, $lt: tomorrow },
      ...(email ? { email } : {}),
    };

    const logs = await this.workoutLogModel.find(filter);

    const totalSubmissions = logs.length;
    const totalTrained = logs.filter(
      (l) => l.trainedToday === 'Si, completé mi entrenamiento.',
    ).length;
    const totalPartial = logs.filter(
      (l) => l.trainedToday === 'Entrenamiento parcial/ligero.',
    ).length;
    const totalNotTrained = logs.filter(
      (l) => l.trainedToday === 'No, no entrené hoy.',
    ).length;
    const attendanceRate = totalSubmissions
      ? +((totalTrained / totalSubmissions) * 100).toFixed(1)
      : 0;

    // Tipos de entrenamiento del día
    const byWorkoutType: Record<string, number> = {};
    logs.forEach((l) => {
      if (l.workoutType?.length) {
        l.workoutType.forEach((type) => {
          byWorkoutType[type] = (byWorkoutType[type] || 0) + 1;
        });
      }
    });

    // Detalle por persona
    const byPerson = logs.map((l) => ({
      email: l.email,
      trainedToday: l.trainedToday,
      workoutType: l.workoutType ?? [],
      duration: l.duration ?? null,
      notes: l.notes ?? null,
    }));

    return {
      date: today.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      totalSubmissions,
      totalTrained,
      totalPartial,
      totalNotTrained,
      attendanceRate,
      byWorkoutType,
      byPerson,
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
