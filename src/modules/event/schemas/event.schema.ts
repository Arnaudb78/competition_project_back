import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true, collection: 'events' })
export class Event {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date!: Date;

  @Prop()
  time?: string;

  @Prop()
  location?: string;

  @Prop({ default: 0 })
  price!: number;

  @Prop()
  imageUrl?: string;

  @Prop()
  organizer?: string;

  @Prop({ default: true })
  isVisible!: boolean;

  @Prop({ type: [String], default: [] })
  participants!: string[];

  @Prop()
  maxCapacity?: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
