import { Module } from '@nestjs/common';
import { ToursModule } from './tours/tours.module';

@Module({
  imports: [ToursModule],
  providers: [],
})
export class LifestyleModule {}
