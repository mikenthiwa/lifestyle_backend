import { Module } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';
import { Trip, TripSchema } from './model/trips.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from '../../partners/model/partner.schema';
import { PartnersService } from '../../partners/partners.service';
import { User, UserSchema } from '../../auth/schema/user.schema';
import { UsersService } from '../../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 60 },
    }),
  ],
  controllers: [ToursController],
  providers: [ToursService, PartnersService, UsersService],
})
export class ToursModule {}
