import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';

@Module({
  providers: [PartnersService],
})
export class PartnersModule {}
