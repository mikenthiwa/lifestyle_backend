import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../auth/schema/user.schema';

export type PartnerDocument = HydratedDocument<Partner>;

@Schema()
export class Partner {
  @Prop({ type: mongoose.Types.ObjectId })
  static _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  logo: string;

  @Prop()
  facebook: string;

  @Prop()
  twitter: string;

  @Prop()
  Instagram: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  admin: User[];
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
