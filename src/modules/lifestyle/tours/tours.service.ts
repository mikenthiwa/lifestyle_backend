import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip } from './model/trips.schema';
import { PartnersService } from '../../partners/partners.service';
import mongoose from 'mongoose';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<any>,
    private partnerService: PartnersService,
  ) {}

  async createTrip(userId: string, TripData: any): Promise<any> {
    const partner = await this.partnerService.getPartner(userId);
    try {
      const createdTrip = await new this.tripModel({
        ...TripData,
        partner: partner._id,
      });
      createdTrip.save();
      return createdTrip;
    } catch (error) {
      console.log('error', error);
    }
  }

  async updateTrip(userId: string, tripID: string, trip: any): Promise<any> {
    try {
      const tripDoc = await this.tripModel.findOne({ _id: tripID }).lean();
      const partner = await this.partnerService.getPartner(userId);
      if (partner._id.toHexString() === tripDoc.partner.toHexString()) {
        const { tripId, ...result } = trip;
        const updatedTripDocument = await this.tripModel.updateOne(
          { _id: new mongoose.Types.ObjectId(tripID) },
          { $set: { ...result } },
        );
        return updatedTripDocument;
      } else {
        console.log('Forbidden resource');
      }
    } catch (e) {
      console.log('e', e);
    }
  }
}
