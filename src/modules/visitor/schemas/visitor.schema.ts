import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisitorDocument = HydratedDocument<VisitorEntity>;

@Schema({ timestamps: true, collection: 'visitors' })
export class VisitorEntity {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  age!: number;
}

export const VisitorSchema = SchemaFactory.createForClass(VisitorEntity);
