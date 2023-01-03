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

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  slots: number;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' })
  partner: Partner;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
