import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChallengeDocument = HydratedDocument<ChallengeEntity>;

export class QuestionPair {
  @Prop({ type: Types.ObjectId, ref: 'QuestionEntity' })
  childQuestion!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'QuestionEntity' })
  adultQuestion!: Types.ObjectId;
}

@Schema({ timestamps: true, collection: 'challenges' })
export class ChallengeEntity {
  @Prop({ required: true })
  name!: string;
  @Prop({ default: '' })
  description!: string;
  @Prop({ default: '' })
  imageUrl!: string;
  @Prop({
    type: [
      {
        childQuestion: { type: Types.ObjectId, ref: 'QuestionEntity' },
        adultQuestion: { type: Types.ObjectId, ref: 'QuestionEntity' },
      },
    ],
    default: [],
  })
  questions!: QuestionPair[];
  @Prop({ default: true })
  isVisible!: boolean;
}

export const ChallengeSchema = SchemaFactory.createForClass(ChallengeEntity);
