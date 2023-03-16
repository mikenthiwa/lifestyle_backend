import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PartnersService } from './partners.service';
import { Partner, PartnerSchema } from './model/partner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }]),
  ],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
