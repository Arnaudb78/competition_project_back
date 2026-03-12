import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export type AccountDocument = HydratedDocument<AccountEntity>;

@Schema({ timestamps: true, collection: 'accounts' })
export class AccountEntity {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  age!: number;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: 0 })
  trophies!: number;
}

export const AccountSchema = SchemaFactory.createForClass(AccountEntity);

AccountSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});
