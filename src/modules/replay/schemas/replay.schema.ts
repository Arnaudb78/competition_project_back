import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReplayDocument = HydratedDocument<Replay>;

@Schema({ timestamps: true, collection: 'replays' })
export class Replay {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  languages!: string[];

  @Prop({ required: true })
  videoUrl!: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ default: true })
  isVisible!: boolean;
}

export const ReplaySchema = SchemaFactory.createForClass(Replay);
