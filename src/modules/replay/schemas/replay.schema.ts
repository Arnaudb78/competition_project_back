import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReplayDocument = HydratedDocument<Replay>;

@Schema({ _id: false })
export class ReplayComment {
  @Prop({ required: true })
  author!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export const ReplayCommentSchema = SchemaFactory.createForClass(ReplayComment);

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

  @Prop({ type: [ReplayCommentSchema], default: [] })
  comments!: ReplayComment[];
}

export const ReplaySchema = SchemaFactory.createForClass(Replay);
