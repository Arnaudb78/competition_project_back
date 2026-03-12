import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChallengeCompletionDocument = HydratedDocument<ChallengeCompletionEntity>;

@Schema({ timestamps: true, collection: 'challenge_completions' })
export class ChallengeCompletionEntity {
  @Prop({ type: Types.ObjectId, ref: 'AccountEntity', required: true })
  accountId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'ChallengeEntity', required: true })
  challengeId!: Types.ObjectId;
  @Prop({ required: true, default: 0 })
  score!: number;
  @Prop({ default: () => new Date() })
  completedAt!: Date;
}

export const ChallengeCompletionSchema = SchemaFactory.createForClass(ChallengeCompletionEntity);
