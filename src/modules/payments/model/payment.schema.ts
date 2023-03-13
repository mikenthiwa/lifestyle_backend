import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../auth/schema/user.schema';
import { Trip } from '../../lifestyle/tours/model/trips.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: mongoose.Types.ObjectId })
  static _id: string;

  @Prop({ required: false })
  merchantRequestID: string;

  @Prop({ required: true })
  checkoutRequestID: string;

  @Prop({ required: false })
  mpesaCode: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  transactionCode: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' })
  trip: Trip;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
