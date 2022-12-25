import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../auth/schema/user.schema';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true })
  facebook: string;

  @Prop()
  twitter: string;

  @Prop({ required: true })
  Instagram: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User }] })
  admin: User[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
