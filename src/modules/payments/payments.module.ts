import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './model/payment.schema';

import { HttpModule } from '@nestjs/axios';
import { MpesaProxyService } from './mpesa-proxy/mpesa-proxy.service';
import { User, UserSchema } from '../auth/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 60 },
    }),
  ],
  providers: [PaymentsService, MpesaProxyService, UsersService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
