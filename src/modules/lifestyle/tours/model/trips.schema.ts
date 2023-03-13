import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Partner } from '../../../partners/model/partner.schema';

export type tripDocument = HydratedDocument<Trip>;

@Schema({ timestamps: true })
export class Trip {
  @Prop({ type: mongoose.Types.ObjectId })
  static _id: string;

  @Prop({ required: true })
  tripName: string;

  @Prop({ type: String, required: true })
  logo: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  slots: number;

  @Prop({ type: Number, required: false, default: 0 })
  paidSlots: number;

  @Prop({ type: Number, required: false, default: 0 })
  availableSlots: number;

  @Prop({ required: true })
  departureDate: Date;

  @Prop({ required: false })
  returnDate: Date;

  @Prop({ required: true })
  departureArea: string;

  @Prop({ required: true })
  arrivalArea: string;

  @Prop({ required: true })
  departureTime: string;

  @Prop({ required: true })
  arrivalTime: string;

  @Prop({ required: false })
  inclusive: Array<string>;

  @Prop({ required: true })
  tillNumber: number;

  @Prop({ type: String, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  partner: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
