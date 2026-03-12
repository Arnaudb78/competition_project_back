import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<QuestionEntity>;

export class Answer {
  text!: string;
  isCorrect!: boolean;
}

@Schema({ timestamps: true, collection: 'questions' })
export class QuestionEntity {
  @Prop({ required: true })
  text!: string;

  @Prop({ enum: ['child', 'adult'], required: true })
  ageGroup!: 'child' | 'adult';

  @Prop({
    type: [{ text: String, isCorrect: Boolean }],
    required: true,
    validate: {
      validator: (v: Answer[]) => v.length === 4,
      message: 'Une question doit avoir exactement 4 réponses',
    },
  })
  answers!: Answer[];
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity);
