import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partner } from './model/partner.schema';
import {
  Partner as PartnerBody,
  PartnerUpdate,
} from './interface/index.interface';

@Injectable()
export class PartnersService {
  constructor(@InjectModel(Partner.name) private partnerModal: Model<any>) {}

  async addPartner(partner: PartnerBody) {
    try {
      const cursor = await this.partnerModal.countDocuments({
        name: partner.name,
      });
      if (cursor) {
        throw new ConflictException('Partner with this name already exists');
      } else {
        const createdPartner = await new this.partnerModal(partner);
        createdPartner.save();
      }
    } catch (error) {
      const {
        response: { statusCode, message },
      } = error;
      if (statusCode === 409) {
        throw new ConflictException({
          success: false,
          statusCode: HttpStatus.CONFLICT,
          errorMessage: message,
        });
      }
    }
  }

  async getPartner(userId: string): Promise<void> {
    try {
      const partner = await this.partnerModal
        .findOne({
          admin: { $elemMatch: { $eq: userId } },
        })
        .lean();
      const { admin, _id, ...result } = partner;
      return result;
      return partner;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: 'Internal server error',
      });
    }
  }

  async updatePartner(userId: string, partnerUpdate: PartnerUpdate) {
    try {
      await this.partnerModal.updateOne(
        { admin: { $elemMatch: { $eq: userId } } },
        { $set: partnerUpdate },
      );
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: 'Internal server error',
      });
    }
  }
}
