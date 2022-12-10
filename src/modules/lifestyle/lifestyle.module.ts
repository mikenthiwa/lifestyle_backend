import { Module } from '@nestjs/common';
import { ToursModule } from './tours/tours.module';

@Module({
  imports: [ToursModule],
})
export class LifestyleModule {}
