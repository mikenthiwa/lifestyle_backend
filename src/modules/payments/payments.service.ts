import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Payment } from './model/payment.schema';
import { ThrowException } from '../../lib/helper';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<any>) {}

  async createPayment(
    checkoutRequestID: string,
    userId: string,
    tripId: string,
  ): Promise<any> {
    try {
      const createdPayment = await new this.paymentModel({
        checkoutRequestID,
        user: new mongoose.Types.ObjectId(userId),
        trip: new mongoose.Types.ObjectId(tripId),
      });
      createdPayment.save();
    } catch (error) {
      ThrowException(error.response);
    }
  }

  async updatePayment(
    checkoutRequestID: string,
    paymentData: any,
  ): Promise<void> {
    try {
      await this.paymentModel.updateOne({ checkoutRequestID }, paymentData);
    } catch (error) {
      ThrowException(error.response);
    }
  }

  async deletePayment(checkoutRequestID: string): Promise<any> {
    try {
      await this.paymentModel.deleteOne({ checkoutRequestID });
    } catch (error) {
      ThrowException(error.response);
    }
  }
}
