import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<User>;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Schema()
export class User {
  @Prop({ type: mongoose.Types.ObjectId })
  static _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: true, type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ type: Boolean })
  isRegisteredWithGoogle: boolean;

  @Prop()
  currentHashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
