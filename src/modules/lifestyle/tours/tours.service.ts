import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Trip } from './model/trips.schema';
import { PartnersService } from '../../partners/partners.service';
import { ThrowException } from '../../../lib/helper';
import slugify from 'slugify';
import { generate } from 'short-uuid';

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Trip.name) private tripModel: Model<any>,
    private partnerService: PartnersService,
  ) {}

  async createTrip(userId: string, TripData: any): Promise<any> {
    const partner = await this.partnerService.getPartner(userId);
    const slug = slugify(TripData.tripName, {
      replacement: '-',
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
      locale: 'vi',
    });

    try {
      const createdTrip = await new this.tripModel({
        ...TripData,
        partner: partner._id,
        slug: slug + '-' + generate(),
      });
      createdTrip.save();
      return createdTrip;
    } catch (error) {
      const { response } = error;
      ThrowException(response.statusCode);
    }
  }

  async getTrips(): Promise<any> {
    try {
      return this.tripModel.find().lean();
    } catch (error) {
      const { response } = error;
      ThrowException(response);
    }
  }

  async selectTrips(slug: string): Promise<any> {
    try {
      return this.tripModel.findOne({ slug }).lean();
    } catch (error) {
      const { response } = error;
      ThrowException(response);
    }
  }

  async updateTrip(userId: string, tripID: string, trip: any): Promise<any> {
    try {
      const tripDoc = await this.tripModel.findOne({ _id: tripID }).lean();
      const partner = await this.partnerService.getPartner(userId);
      if (
        tripDoc &&
        partner._id.toHexString() === tripDoc.partner.toHexString()
      ) {
        const { tripId, ...result } = trip;
        return this.tripModel.updateOne(
          { _id: new mongoose.Types.ObjectId(tripID) },
          { $set: { ...result } },
        );
      } else {
        throw new ForbiddenException('You cannot perform this action!');
      }
    } catch (error) {
      const { response } = error;
      ThrowException(response);
    }
  }

  async deleteTrip(userId: string, tripID: any): Promise<any> {
    try {
      const tripDoc = await this.tripModel.findOne({ _id: tripID }).lean();
      const partner = await this.partnerService.getPartner(userId);
      if (
        tripDoc &&
        partner._id.toHexString() === tripDoc.partner.toHexString()
      ) {
        return this.tripModel.deleteOne({
          _id: new mongoose.Types.ObjectId(tripID),
        });
      }
      throw new ForbiddenException('You cannot perform this action!');
    } catch (error) {
      const { response } = error;
      ThrowException(response);
    }
  }
}
