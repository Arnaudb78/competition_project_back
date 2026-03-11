import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClipDocument = HydratedDocument<Clip>;

@Schema({ timestamps: true, collection: 'clips' })
export class Clip {
  @Prop({ required: true })
  videoUrl!: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  author!: string;

  @Prop({ type: [String], default: [] })
  likedBy!: string[];

  @Prop({ default: true })
  isVisible!: boolean;
}

export const ClipSchema = SchemaFactory.createForClass(Clip);
