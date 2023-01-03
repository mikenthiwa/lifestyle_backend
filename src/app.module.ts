import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AppService } from './app.service';
import { SettingsModule } from './modules/settings/settings.module';
import { PartnersModule } from './modules/partners/partners.module';
import { ToursModule } from './modules/lifestyle/tours/tours.module';
import { LifestyleModule } from './modules/lifestyle/lifestyle.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<any>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    AuthModule,
    PartnersModule,
    SettingsModule,
    LifestyleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
