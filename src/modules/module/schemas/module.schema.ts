import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<ModuleEntity>;

@Schema({ timestamps: true })
export class ModuleEntity {
  @Prop({ required: true, unique: true })
  number!: number;

  @Prop({ required: true })
  name!: string;

  @Prop()
  cartel!: string;

  @Prop({ enum: ['audio', 'video', 'none'], default: 'none' })
  mediaType!: string;

  @Prop()
  mediaUrl!: string;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: { x: Number, y: Number }, default: { x: 0, y: 0 } })
  position!: { x: number; y: number };

  @Prop({ default: true })
  isVisible!: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(ModuleEntity);
