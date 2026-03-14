import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class WorkoutLog {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  trainedToday: string;

  @Prop({ type: [String], default: [] })
  workoutType: string[];

  @Prop()
  duration: string;

  @Prop()
  notes: string;

  @Prop({ required: true })
  formSubmittedAt: Date;

  @Prop({ default: false })
  wspNotified: boolean;

  @Prop()
  wspNotifiedAt: Date;
}

export const WorkoutLogSchema = SchemaFactory.createForClass(WorkoutLog);
