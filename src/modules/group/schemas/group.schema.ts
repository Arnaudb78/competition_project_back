import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<GroupEntity>;

export class Participant {
  name!: string;
  age!: number;
  score!: number;
}

@Schema({ timestamps: true, collection: 'groups' })
export class GroupEntity {
  @Prop({
    type: [
      {
        name: String,
        age: { type: Number, default: 18 },
        score: { type: Number, default: 0 },
      },
    ],
    required: true,
  })
  participants!: Participant[];

  @Prop({ type: [Number], default: [] })
  completedModules!: number[];

  @Prop()
  endedAt?: Date;
}

export const GroupSchema = SchemaFactory.createForClass(GroupEntity);
