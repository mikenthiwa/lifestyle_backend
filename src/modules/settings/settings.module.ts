import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PartnerSchema, Partner } from '../partners/model/partner.schema';
import { PartnersService } from '../partners/partners.service';
import { SettingsController } from './settings.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }]),
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 60 },
    }),
  ],
  providers: [SettingsService, PartnersService],
  controllers: [SettingsController],
})
export class SettingsModule {}
